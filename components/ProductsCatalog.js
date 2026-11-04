'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { FaArrowRight, FaCogs, FaSearch } from 'react-icons/fa';

export default function ProductsCatalog({ products = [] }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(
    () => [
      'All',
      ...new Set(
        products
          .map((product) => product.sourceCategory || product.sourceCategories?.[0])
          .filter(Boolean)
      ),
    ],
    [products]
  );
  const filteredProducts = useMemo(() => {
    const search = query.trim().toLowerCase();
    return products.filter((product) => {
      const category = product.sourceCategory || product.sourceCategories?.[0] || '';
      const matchesCategory = activeCategory === 'All' || category === activeCategory;
      const searchableText = [
        product.title,
        product.shortDescription,
        category,
        ...(product.specifications || []).flatMap(({ key, value }) => [key, value]),
      ]
        .join(' ')
        .toLowerCase();

      return matchesCategory && (!search || searchableText.includes(search));
    });
  }, [activeCategory, products, query]);

  return (
    <div className="space-y-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-center">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search products and specifications</span>
          <FaSearch
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products, models, or specifications"
            className="w-full rounded-lg border border-borders-custom bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </label>
        <p className="text-sm text-gray-500 sm:shrink-0" aria-live="polite">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 sm:flex-wrap sm:justify-center">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            aria-pressed={activeCategory === category}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              activeCategory === category
                ? 'border-primary bg-primary text-white shadow'
                : 'border-borders-custom bg-white text-gray-600 hover:bg-bg-custom'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-xl border border-borders-custom bg-white py-14 text-center text-gray-500">
          No products match this search. Try another product name or specification.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const specs = product.specifications || [];
            const model = specs.find(({ key }) => /model|model name|model no/i.test(key));
            const keySpecs = specs
              .filter((spec) => spec !== model)
              .slice(0, 3);
            const category = product.sourceCategory || product.sourceCategories?.[0];

            return (
              <article
                key={product._id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-borders-custom bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl"
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gray-50 p-5"
                  aria-label={`View ${product.title} details`}
                >
                  {product.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.images[0]}
                      alt={`${product.title} product`}
                      width={600}
                      height={450}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <FaCogs aria-hidden="true" className="h-14 w-14 text-gray-300" />
                  )}
                  {category && (
                    <span className="absolute left-4 top-4 max-w-[80%] truncate rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary shadow-sm">
                      {category}
                    </span>
                  )}
                </Link>

                <div className="flex flex-1 flex-col p-5">
                  <h2 className="line-clamp-2 text-lg font-bold font-heading text-primary transition-colors group-hover:text-secondary">
                    <Link href={`/products/${product.slug}`}>{product.title}</Link>
                  </h2>
                  {model?.value && (
                    <p className="mt-1 text-xs font-semibold text-gray-500">
                      Model: <span className="text-gray-700">{model.value}</span>
                    </p>
                  )}
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-500">
                    {product.shortDescription}
                  </p>

                  {keySpecs.length > 0 && (
                    <dl className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                      {keySpecs.map((spec, index) => (
                        <div
                          key={`${spec.key}-${index}`}
                          className="flex justify-between gap-3 text-xs"
                        >
                          <dt className="text-gray-500">{spec.key}</dt>
                          <dd className="text-right font-semibold text-gray-800">{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  {product.sourcePrice && (
                    <p className="mt-4 text-sm font-bold text-primary">
                      {product.sourcePrice}
                    </p>
                  )}

                  <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary px-3 py-2.5 text-xs font-bold text-primary transition hover:bg-primary hover:text-white"
                    >
                      Specifications <FaArrowRight aria-hidden="true" size={11} />
                    </Link>
                    <Link
                      href={`/products/${product.slug}#request-quote`}
                      className="inline-flex items-center justify-center rounded-lg bg-accent px-3 py-2.5 text-xs font-bold text-primary transition hover:bg-accent/80"
                    >
                      Get a Quote
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
