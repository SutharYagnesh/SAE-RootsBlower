import Link from 'next/link';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saerootsblower.com';

export const metadata = {
  title: 'Shipping & Delivery Policy | Shree Ambika Engineering',
  description:
    'How Shree Ambika Engineering arranges dispatch, freight, and delivery for industrial blower equipment.',
  alternates: { canonical: `${siteUrl}/shipping-policy` },
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-bg-custom py-16">
      <article className="mx-auto max-w-4xl rounded-xl border border-borders-custom bg-white p-8 shadow-sm sm:p-12">
        <h1 className="font-heading text-3xl font-bold text-primary">Shipping & Delivery Policy</h1>
        <p className="mt-3 text-sm text-gray-500">Last updated: November 23, 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-gray-600">
          <section>
            <h2 className="text-lg font-bold text-primary">Order-specific dispatch</h2>
            <p>
              Roots blowers and related industrial equipment may be configured to the
              application. Dispatch readiness and estimated delivery timing are confirmed in
              the applicable quotation or order documents; a general website estimate does not
              replace that written schedule.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-primary">Freight and delivery charges</h2>
            <p>
              The quotation or accepted purchase order will specify the delivery destination,
              freight arrangement, and who is responsible for freight and related charges.
              Applicable taxes, duties, unloading, and other destination costs are handled as
              stated in those documents.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-primary">Delivery and transit</h2>
            <p>
              Delivery timing can depend on configuration, production readiness, carrier
              schedules, destination, and applicable customs or local procedures. We share
              dispatch and carrier documents when available. Please arrange suitable receiving
              equipment and inspect the consignment on arrival.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-primary">Questions about an order</h2>
            <p>
              For a delivery estimate or shipment update, contact{' '}
              <a className="font-semibold text-primary hover:underline" href="mailto:sales@saerootsblower.com">
                sales@saerootsblower.com
              </a>{' '}
              or visit our <Link className="font-semibold text-primary hover:underline" href="/contact">contact page</Link>.
              Include your quotation or order reference and delivery location.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
