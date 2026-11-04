import nextEnv from '@next/env';
import * as cheerio from 'cheerio';
import mongoose from 'mongoose';

const sourceIndexUrl = 'https://www.shreeambikaeng.com/products-and-services.html';
const sourceHost = new URL(sourceIndexUrl).hostname;
const excludedPages = new Set([
  'profile.html',
  'testimonial.html',
  'enquiry.html',
  'sitemap.html',
  'photos.html',
]);
const headers = {
  'User-Agent': 'SAE Roots Blower Catalogue Importer',
  Accept: 'text/html,application/xhtml+xml',
};
const { loadEnvConfig } = nextEnv;

function normalizeText(value) {
  return value.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function canonicalPageUrl(value) {
  const url = new URL(value);
  url.search = '';
  url.hash = '';
  return url.toString();
}

function absoluteUrl(value, baseUrl) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value, baseUrl);
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(45_000),
  });

  if (!response.ok) {
    throw new Error(`Could not fetch ${url}: HTTP ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    throw new Error(`Expected HTML at ${url}, received ${contentType || 'unknown content type'}`);
  }

  return response.text();
}

function discoverCategoryPages($) {
  const pages = new Set();

  $('a[href]').each((_, element) => {
    const href = $(element).attr('href');
    if (!href) {
      return;
    }

    const url = new URL(href, sourceIndexUrl);
    const filename = url.pathname.split('/').pop();

    if (
      url.hostname !== sourceHost ||
      !filename.endsWith('.html') ||
      filename === 'products-and-services.html' ||
      excludedPages.has(filename)
    ) {
      return;
    }

    pages.add(canonicalPageUrl(url.toString()));
  });

  if (pages.size === 0) {
    throw new Error(`No product category pages were found on ${sourceIndexUrl}`);
  }

  return [...pages].sort();
}

function getImages($, $block, pageUrl) {
  const images = new Set();
  const addImage = (image) => {
    const url = absoluteUrl(image, pageUrl);

    if (url && !url.startsWith('data:')) {
      images.add(url);
    }
  };

  $block.find('img').each((_, element) => {
    addImage(
      element.attribs['data-src']
        || element.attribs['data-original']
        || element.attribs['data-lazy-src']
        || element.attribs.src
    );
  });

  $block.find('noscript').each((_, element) => {
    const fallback = cheerio.load($(element).html() || '');
    fallback('img').each((__, image) => addImage(image.attribs.src));
  });

  return [...images];
}

function getDocuments($, $block, pageUrl) {
  const documents = new Map();
  const candidates = [
    ['a', 'href'],
    ['iframe', 'src'],
    ['embed', 'src'],
    ['object', 'data'],
  ];

  for (const [selector, attribute] of candidates) {
    $block.find(`${selector}[${attribute}]`).each((_, element) => {
      const url = absoluteUrl(element.attribs[attribute], pageUrl);
      if (!url || !new URL(url).pathname.toLowerCase().endsWith('.pdf')) {
        return;
      }

      const title = normalizeText($(element).text())
        || element.attribs.title
        || decodeURIComponent(new URL(url).pathname.split('/').pop())
        || 'Product PDF';
      documents.set(url, { title, url });
    });
  }

  return [...documents.values()];
}

function getSpecifications($, $block) {
  const specifications = [];

  $block.find('tr').each((_, row) => {
    const cells = $(row)
      .children('th, td')
      .map((__, cell) => normalizeText($(cell).text()))
      .get();
    if (cells.length >= 2 && cells[0] && cells[1]) {
      specifications.push({ key: cells[0], value: cells.slice(1).join(' | ') });
    }
  });

  return specifications;
}

function extractProduct($, block, index, category, pageUrl, cardId, occurrences) {
  const $block = $(block);
  const title = normalizeText($block.find('h2').first().text());
  if (!title) {
    throw new Error(`A product on ${pageUrl} is missing its title`);
  }

  const specs = getSpecifications($, $block);
  const paragraphs = $block.find('p')
    .map((_, paragraph) => normalizeText($(paragraph).text()))
    .get()
    .filter(Boolean);
  const explicitDescription = specs.find(({ key }) => /product description/i.test(key))?.value;
  const longDescription = paragraphs.join('\n\n') || explicitDescription || '';
  const shortDescription = (paragraphs[0] || explicitDescription || title).slice(0, 500);
  const sourceCardId = cardId || slugify(title) || `product-${index + 1}`;
  const occurrence = (occurrences.get(sourceCardId) || 0) + 1;
  occurrences.set(sourceCardId, occurrence);
  const sourceId = `${pageUrl}#${sourceCardId}:${occurrence}`;
  const sourceUrl = `${pageUrl}#${encodeURIComponent(sourceCardId)}`;
  const plainText = normalizeText($block.text());
  const priceMatch = plainText.match(
    /Approx(?:imate)?\.?\s*Price\s*:\s*([\s\S]{1,120}?)(?=\bGet Latest Price\b|\bProduct Brochure\b|\bProduct Details\b|$)/i
  );
  const images = getImages($, $block, pageUrl);
  const documents = getDocuments($, $block, pageUrl);
  const applications = specs
    .filter(({ key }) => /\bapplications?\b/i.test(key))
    .map(({ value }) => value);
  const features = specs
    .filter(({ key }) => /\bfeatures?\b/i.test(key))
    .map(({ value }) => value);

  return {
    sourceId,
    sourceUrl,
    sourceCategory: category,
    sourceCategories: [category],
    sourcePrice: priceMatch ? normalizeText(priceMatch[1]) : undefined,
    title,
    slug: '',
    shortDescription,
    longDescription,
    specifications: specs,
    features,
    applications,
    images,
    documents,
    status: 'published',
  };
}

function assignSeoFriendlySlugs(products) {
  const usedSlugs = new Set();
  const sortedProducts = [...products].sort((a, b) => a.sourceId.localeCompare(b.sourceId));

  for (const product of sortedProducts) {
    const baseSlug = slugify(product.title).slice(0, 70).replace(/-+$/g, '') || 'product';
    const categorySlug = slugify(product.sourceCategory).slice(0, 40);
    const candidates = [baseSlug];

    if (categorySlug) {
      candidates.push(`${baseSlug}-${categorySlug}`);
    }

    let slug = candidates.find((candidate) => !usedSlugs.has(candidate));
    let suffix = 2;

    while (!slug) {
      const candidate = `${baseSlug}-${categorySlug ? `${categorySlug}-` : ''}${suffix++}`;
      if (!usedSlugs.has(candidate)) {
        slug = candidate;
      }
    }

    usedSlugs.add(slug);
    product.slug = slug;
  }

  return products;
}

async function scrapeCategory(pageUrl) {
  const $ = cheerio.load(await fetchHtml(pageUrl));
  const category = normalizeText($('h1').first().text());
  const blocks = $('div.cont9.bx2.w1.ds2.ps2').toArray();
  const summaryCards = $('div.w15.ds3.vr2.bx2').toArray();

  if (!category || blocks.length === 0) {
    throw new Error(`No product details were found on ${pageUrl}`);
  }
  if (summaryCards.length !== blocks.length) {
    throw new Error(
      `Product card/detail count mismatch on ${pageUrl}: ${summaryCards.length} cards, ${blocks.length} details`
    );
  }

  const occurrences = new Map();
  const products = blocks.map((block, index) => {
    const cardId = summaryCards[index].attribs.id;
    return extractProduct($, block, index, category, pageUrl, cardId, occurrences);
  });

  return { category, pageUrl, products };
}

async function mapLimit(values, limit, mapper) {
  const results = new Array(values.length);
  let nextIndex = 0;

  await Promise.all(
    Array.from({ length: Math.min(limit, values.length) }, async () => {
      while (nextIndex < values.length) {
        const index = nextIndex++;
        results[index] = await mapper(values[index], index);
      }
    })
  );

  return results;
}

async function verifyImages(products) {
  const imageUrls = [...new Set(products.map((product) => product.images[0]).filter(Boolean))];
  const results = await mapLimit(imageUrls, 4, async (url) => {
    const hostname = new URL(url).hostname;
    if (hostname !== sourceHost && !hostname.endsWith('.imimg.com')) {
      return { url, ok: false, reason: 'image host is not an allowed source host' };
    }

    let response = await fetch(url, {
      method: 'HEAD',
      headers,
      signal: AbortSignal.timeout(20_000),
    });

    if (response.status === 405 || response.status === 501) {
      await response.body?.cancel();
      response = await fetch(url, {
        headers: { ...headers, Range: 'bytes=0-0' },
        signal: AbortSignal.timeout(20_000),
      });
    }

    const result = { url, ok: response.ok, reason: response.ok ? '' : `HTTP ${response.status}` };
    await response.body?.cancel();
    return result;
  });

  const failures = results.filter(({ ok }) => !ok);
  console.log(`Primary product images reachable: ${results.length - failures.length}/${results.length}`);
  for (const failure of failures) {
    console.error(`Image check failed (${failure.reason}): ${failure.url}`);
  }

  if (failures.length > 0) {
    throw new Error(`${failures.length} primary product image(s) could not be verified`);
  }
}

async function importProducts(products) {
  if (!process.env.MONGODB_URI) {
    throw new Error('Set MONGODB_URI in .env.local before importing products');
  }

  const { default: connectDB } = await import('../lib/db.js');
  const { default: Product } = await import('../models/Product.js');

  await connectDB();
  await Product.init();

  let inserted = 0;
  let updated = 0;

  try {
    for (const product of products) {
      const existing = await Product.findOne({ sourceId: product.sourceId })
        .select('slug status previousSlugs')
        .lean();
      let slug = product.slug;
      let suffix = 1;

      while (await Product.exists({ slug, sourceId: { $ne: product.sourceId } })) {
        slug = `${product.slug}-${suffix++}`;
      }
      product.slug = slug;

      const { sourceId, sourceUrl, sourceCategory, sourceCategories, sourcePrice, title,
        shortDescription, longDescription, specifications, features, applications,
        images, documents } = product;
      const previousSlugs = new Set(existing?.previousSlugs || []);
      if (existing?.slug && existing.slug !== slug) {
        previousSlugs.add(existing.slug);
      }
      previousSlugs.delete(slug);
      const sourceFields = {
        sourceId,
        sourceUrl,
        sourceCategory,
        sourceCategories,
        sourcePrice: sourcePrice || '',
        title,
        slug,
        previousSlugs: [...previousSlugs],
        shortDescription,
        longDescription,
        specifications,
        features,
        applications,
        images,
        documents,
        status: existing?.status || 'published',
      };

      const result = await Product.updateOne(
        { sourceId },
        {
          $set: sourceFields,
          $setOnInsert: { offers: [], reviews: [] },
        },
        { upsert: true, runValidators: true }
      );

      if (result.upsertedCount) {
        inserted += 1;
      } else {
        updated += 1;
      }
    }

    const storedProducts = await Product.find({
      sourceId: { $in: products.map(({ sourceId }) => sourceId) },
    })
      .select('sourceId slug previousSlugs images specifications status')
      .lean();
    const storedBySourceId = new Map(storedProducts.map((product) => [product.sourceId, product]));
    const storedSlugs = new Set(storedProducts.map(({ slug }) => slug));

    if (storedProducts.length !== products.length || storedSlugs.size !== products.length) {
      throw new Error(
        `Database verification failed: expected ${products.length} unique products, found ${storedProducts.length}`
      );
    }

    for (const product of products) {
      const stored = storedBySourceId.get(product.sourceId);
      if (
        !stored ||
        stored.slug !== product.slug ||
        stored.images.length !== product.images.length ||
        stored.specifications.length !== product.specifications.length
      ) {
        throw new Error(`Database verification failed for source product ${product.sourceId}`);
      }
    }
  } finally {
    await mongoose.disconnect();
  }

  return { inserted, updated };
}

async function main() {
  loadEnvConfig(process.cwd());
  const dryRun = process.argv.includes('--dry-run');
  const shouldVerifyImages = process.argv.includes('--verify-images');
  const index = cheerio.load(await fetchHtml(sourceIndexUrl));
  const categoryPages = discoverCategoryPages(index);
  const categories = await mapLimit(categoryPages, 3, scrapeCategory);
  const products = assignSeoFriendlySlugs(
    categories.flatMap(({ products: categoryProducts }) => categoryProducts)
  );
  const sourceIds = new Set(products.map(({ sourceId }) => sourceId));
  const slugs = new Set(products.map(({ slug }) => slug));

  if (sourceIds.size !== products.length) {
    throw new Error(`Found duplicate source product IDs (${products.length - sourceIds.size} duplicates)`);
  }
  if (slugs.size !== products.length) {
    throw new Error(`Found duplicate SEO-friendly product slugs (${products.length - slugs.size} duplicates)`);
  }

  const imageCount = new Set(products.flatMap(({ images }) => images)).size;
  const productsWithoutImages = products.filter(({ images }) => images.length === 0).length;
  const productsWithDescriptions = products.filter(({ longDescription }) => longDescription).length;
  const productsWithSpecifications = products.filter(({ specifications }) => specifications.length > 0).length;
  const productsWithSourcePrices = products.filter(({ sourcePrice }) => sourcePrice).length;
  const documentCount = products.reduce((count, product) => count + product.documents.length, 0);

  console.log(`Product categories scanned: ${categories.length}`);
  console.log(`Product listings found: ${products.length}`);
  console.log(`Unique SEO-friendly slugs assigned: ${slugs.size}`);
  console.log(`Distinct product images found: ${imageCount}`);
  console.log(`Listings without images: ${productsWithoutImages}`);
  console.log(`Listings with source descriptions: ${productsWithDescriptions}`);
  console.log(`Listings with technical specifications: ${productsWithSpecifications}`);
  console.log(`Listings with source prices: ${productsWithSourcePrices}`);
  console.log(`PDF documents found: ${documentCount}`);
  for (const category of categories) {
    console.log(`  ${category.category}: ${category.products.length}`);
  }

  if (shouldVerifyImages) {
    await verifyImages(products);
  }

  if (dryRun) {
    console.log('Dry run complete; no database changes were made.');
    return;
  }

  const result = await importProducts(products);
  console.log(`Products inserted: ${result.inserted}`);
  console.log(`Products updated: ${result.updated}`);
  console.log(`Products total: ${result.inserted + result.updated}`);
}

main().catch((error) => {
  console.error('Product catalogue import failed:', error);
  process.exitCode = 1;
});
