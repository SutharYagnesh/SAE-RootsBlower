const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saerootsblower.com';

export const metadata = {
  title: 'Privacy Policy | Shree Ambika Engineering',
  description: 'How Shree Ambika Engineering collects, uses, retains and protects information submitted through its website.',
  alternates: {
    canonical: `${siteUrl}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-bg-custom py-16">
      <article className="mx-auto max-w-4xl rounded-xl border border-borders-custom bg-white p-8 shadow-sm sm:p-12">
        <h1 className="font-heading text-3xl font-bold text-primary">Privacy Policy</h1>
        <p className="mt-3 text-sm text-gray-500">Last updated: November 23, 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-gray-600">
          <section>
            <h2 className="text-lg font-bold text-primary">Information we collect</h2>
            <p>
              When you submit an inquiry, quote request or contact form, we may collect your name,
              email address, telephone number, company details, product interest and message
              details that you choose to provide. Website hosting and analytics services may
              also process technical information such as browser and usage data.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-primary">How we use information</h2>
            <p>
              We use inquiry information to respond to you, prepare quotations, provide product
              or technical support, maintain the website, and meet applicable legal obligations.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-primary">Retention and sharing</h2>
            <p>
              We do not sell personal information. We may share information with service
              providers that help operate the website or respond to your inquiry, and where
              disclosure is required by law. We keep inquiry records for as long as reasonably
              needed for the business purpose or legal obligations.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-primary">Cookies and analytics</h2>
            <p>
              The website uses Google Analytics to understand site usage and may use essential
              technologies needed for website operation. You can manage cookies through your
              browser settings; disabling them may affect some features.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-primary">Contact us</h2>
            <p>
              You may request access to or correction or deletion of information you submitted,
              subject to applicable retention requirements. Contact Shree Ambika Engineering
              at Plot No. 136, Phase 1, Nr Pushpak Industrial Estate, Vatva GIDC, Ahmedabad -
              382418, Gujarat, India. Email:
              {' '}<a className="font-semibold text-primary hover:underline" href="mailto:sales@saerootsblower.com">sales@saerootsblower.com</a>.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
