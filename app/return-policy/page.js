import Link from 'next/link';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saerootsblower.com';

export const metadata = {
  title: 'Returns & Warranty Policy | Shree Ambika Engineering',
  description:
    'Warranty, inspection, and return-authorization information for industrial equipment supplied by Shree Ambika Engineering.',
  alternates: { canonical: `${siteUrl}/return-policy` },
};

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-bg-custom py-16">
      <article className="mx-auto max-w-4xl rounded-xl border border-borders-custom bg-white p-8 shadow-sm sm:p-12">
        <h1 className="font-heading text-3xl font-bold text-primary">Returns & Warranty Policy</h1>
        <p className="mt-3 text-sm text-gray-500">Last updated: November 23, 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-gray-600">
          <section>
            <h2 className="text-lg font-bold text-primary">Manufacturer warranty</h2>
            <p>
              Products supplied by Shree Ambika Engineering are covered by a 12-month
              manufacturer warranty. The applicable coverage, exclusions, and warranty start
              date are those stated in the accepted quotation, purchase order, or other written
              supply documents.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-primary">Inspection and return authorization</h2>
            <p>
              Industrial blowers and engineered assemblies are supplied for specific technical
              requirements. A return is not automatic: contact us with the order and product
              details, allow inspection and technical assessment, and obtain written approval
              from Shree Ambika Engineering before shipping any item back. Unapproved returns
              may be refused.
            </p>
            <p className="mt-3">
              Warranty remedies, repair or replacement decisions, and any approved commercial
              adjustment are handled in accordance with the written supply documents and the
              inspection findings.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-primary">Transit damage or missing items</h2>
            <p>
              Please inspect the consignment when it arrives and note visible damage or
              shortages on the carrier&apos;s delivery record. Contact us promptly with
              photographs, delivery documents, and the order reference so we can investigate
              and coordinate the next steps.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-primary">Contact</h2>
            <p>
              For warranty or return assistance, email{' '}
              <a className="font-semibold text-primary hover:underline" href="mailto:sales@saerootsblower.com">
                sales@saerootsblower.com
              </a>{' '}
              or use our <Link className="font-semibold text-primary hover:underline" href="/contact">contact page</Link>.
              Please include your order or quotation reference.
            </p>
            <p className="mt-3">
              Shree Ambika Engineering, Plot No. 136, Phase 1, Nr Pushpak Industrial Estate,
              Vatva GIDC, Ahmedabad - 382418, Gujarat, India.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
