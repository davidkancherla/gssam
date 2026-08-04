export default function PageHeader({
  title,
  subtitle,
  image,
}: {
  title: string;
  subtitle?: string;
  image?: string;
}) {
  return (
    <section className="relative bg-maroon-deep text-white overflow-hidden">
      {image && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${image}')` }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" aria-hidden="true" />
        </>
      )}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-20 text-center">
        <h1 className="font-display text-3xl sm:text-5xl font-bold">{title}</h1>
        {subtitle && <p className="mt-3 text-amber-100/85 max-w-2xl mx-auto text-sm sm:text-base">{subtitle}</p>}
        <div className="ornament-divider mt-6">
          <span className="text-amber-300 text-lg" aria-hidden="true">✦</span>
        </div>
      </div>
    </section>
  );
}
