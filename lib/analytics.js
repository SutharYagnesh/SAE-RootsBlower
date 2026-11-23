export function trackLeadConversion(formName) {
  if (typeof window === 'undefined') {
    return;
  }

  const eventData = { form_name: formName };
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', eventData);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'generate_lead', ...eventData });
}
