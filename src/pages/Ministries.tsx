import PageHeader from '@/components/PageHeader';
import { MINISTRIES } from '@/data/site';
import { ArrowRight } from 'lucide-react';

export default function Ministries({ navigate }: { navigate: (p: string) => void }) {
  return (
    <>
      <PageHeader
        title="Ministries"
        subtitle="Every member has a gift — find your place to grow, serve, and belong."
        image="/images/real-kids-singing.jpg"
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MINISTRIES.map((m) => (
            <article
              key={m.name}
              className="group rounded-xl bg-card ring-1 ring-border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-44 overflow-hidden">
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h2 className="font-display text-xl font-bold text-maroon">{m.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-2xl bg-maroon-deep text-white p-8 sm:p-10 text-center shadow-lg">
          <h2 className="font-display text-2xl sm:text-3xl font-bold">Want to get involved?</h2>
          <p className="mt-3 text-amber-100/85 max-w-xl mx-auto text-sm sm:text-base">
            Whether it's singing in the worship team, helping with outreach, or joining a
            fellowship — we'd love to help you find your place.
          </p>
          <button
            onClick={() => navigate('contact')}
            className="mt-6 inline-flex items-center gap-2 bg-saffron text-maroon-deep font-bold px-6 py-3 rounded-md hover:brightness-110 transition"
          >
            Talk to us <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </>
  );
}
