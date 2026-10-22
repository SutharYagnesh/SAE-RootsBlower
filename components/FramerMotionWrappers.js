function ContentWrapper({ children }) {
  return <div>{children}</div>;
}

export function FadeUp({ children }) {
  return <ContentWrapper>{children}</ContentWrapper>;
}

export function FadeIn({ children }) {
  return <ContentWrapper>{children}</ContentWrapper>;
}

export function StaggerContainer({ children }) {
  return <ContentWrapper>{children}</ContentWrapper>;
}

export function StaggerItem({ children }) {
  return <ContentWrapper>{children}</ContentWrapper>;
}

export function AnimatedCounter({ value }) {
  return <span>{value}</span>;
}

export function ClientTicker({ items = [] }) {
  const tripleItems = [...items, ...items, ...items];

  return (
    <div className="relative w-full overflow-hidden py-6">
      <div className="absolute inset-y-0 left-0 w-16 md:w-28 bg-gradient-to-r from-bg-custom to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-16 md:w-28 bg-gradient-to-l from-bg-custom to-transparent z-10 pointer-events-none"></div>
      
      <div className="flex overflow-hidden">
        <div
          className="client-logo-marquee flex space-x-8 whitespace-nowrap shrink-0"
          style={{ width: 'fit-content' }}
        >
          {tripleItems.map((logo, idx) => (
            <div
              key={idx}
              className="inline-flex h-20 w-44 items-center justify-center p-4 bg-white rounded-xl border border-borders-custom shadow-sm hover:border-accent hover:shadow-md transition-all duration-300 group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt={`${logo.name} logo`}
                width={144}
                height={48}
                loading="lazy"
                className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
