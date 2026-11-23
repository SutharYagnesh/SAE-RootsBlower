import Link from 'next/link';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saerootsblower.com';

export const metadata = {
  title: 'Terms of Service | Shree Ambika Engineering',
  description:
    'Terms for using the Shree Ambika Engineering website, product catalog, and inquiry services.',
  alternates: { canonical: `${siteUrl}/terms` },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg-custom py-16">
      <article className="mx-auto max-w-4xl rounded-xl border border-borders-custom bg-white p-8 shadow-sm sm:p-12">
        <h1 className="font-heading text-3xl font-bold text-primary">Terms of Service</h1>
        <p className="mt-3 text-sm text-gray-500">Last updated: November 23, 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-gray-600">
          <section>
            <h2 className="text-lg font-bold text-primary">Using this website</h2>
            <p>
              You may use this website to review our products and technical information and to
              contact us with genuine business inquiries. Do not misuse the website, submit
              knowingly false information, attempt unauthorized access, or interfere with its
              operation.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-primary">Product information and quotations</h2>
            <p>
              Product descriptions and specifications are provided for general information.
              Confirm application requirements and final specifications with us before ordering.
              Prices, configuration, availability, delivery, freight, taxes, and other
              commercial terms are confirmed in a written quotation or accepted order. An
              inquiry or website listing is not an order acceptance or an offer to sell at a
              particular price.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-primary">Orders, warranty, and delivery</h2>
            <p>
              A supply contract is governed by its accepted quotation, purchase order, and
              related written documents. Warranty and return requests are subject to our{' '}
              <Link className="font-semibold text-primary hover:underline" href="/return-policy">Returns & Warranty Policy</Link>.
              Dispatch timing and freight are subject to our{' '}
              <Link className="font-semibold text-primary hover:underline" href="/shipping-policy">Shipping & Delivery Policy</Link>{' '}
              and the terms agreed for the order.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-primary">Intellectual property</h2>
            <p>
              Website text, graphics, logos, and other materials belong to Shree Ambika
              Engineering or their respective rights holders. You may not reproduce or use
              them commercially without prior permission, except where applicable law allows.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-primary">Website information and liability</h2>
            <p>
              We make reasonable efforts to keep website information useful and current, but
              it may change and is not a substitute for written technical or commercial
              confirmation. To the extent permitted by applicable law, Shree Ambika Engineering
              is not responsible for indirect loss arising solely from use of this informational
              website. Nothing in these terms limits liability where applicable law does not
              permit that limitation.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-primary">Privacy and changes</h2>
            <p>
              Our handling of inquiry information is described in the{' '}
              <Link className="font-semibold text-primary hover:underline" href="/privacy-policy">Privacy Policy</Link>.
              We may update these website terms by publishing a revised version on this page.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-primary">Contact</h2>
            <p>
              Questions about these terms can be sent to{' '}
              <a className="font-semibold text-primary hover:underline" href="mailto:sales@saerootsblower.com">
                sales@saerootsblower.com
              </a>
              . Shree Ambika Engineering is located in Ahmedabad, Gujarat, India. Any terms
              applicable to a specific supply contract are governed by the documents accepted
              for that transaction.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
