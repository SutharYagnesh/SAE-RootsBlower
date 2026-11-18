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
        <p className="mt-3 text-sm text-gray-500">Last updated: November 18, 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-gray-600">
          <section>
            <h2 className="text-lg font-bold text-primary">Information we collect</h2>
            <p>
              When you submit an inquiry, quote request or contact form, we may collect your name,
              email address, telephone number, product interest and message details.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-primary">How we use information</h2>
            <p>
              We use submitted information to respond to inquiries, prepare quotations, provide
              technical support and improve our products and website communications.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-primary">Retention and sharing</h2>
            <p>
              We retain inquiry records only for legitimate sales and support purposes. We do not
              sell personal information. Access is limited to authorized personnel and service
              providers that support website operations.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-primary">Cookies and analytics</h2>
            <p>
              The website may use essential cookies and analytics to measure traffic and improve
              performance. You can control cookies through your browser settings.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-primary">Contact us</h2>
            <p>
              Shree Ambika Engineering, Plot No. 136, Phase 1, Nr Pushpak Industrial Estate,
              Vatva GIDC, Ahmedabad - 382418, Gujarat, India. Email:
              {' '}<a className="font-semibold text-primary hover:underline" href="mailto:sales@saerootsblower.com">sales@saerootsblower.com</a>.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
