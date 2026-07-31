import PageHeader from '@/components/PageHeader';
import { CHURCH } from '@/data/site';
import { Cross, Globe2, Music4, Users, Church } from 'lucide-react';

export default function About() {
  return (
    <>
      <PageHeader
        title="About Us"
        subtitle="Rooted in Lutheran tradition, blossoming in South Asian heritage — one family in Christ since 1988."
        image="/images/real-communion-wide.jpg"
      />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-maroon">Our Story</h2>
        <div className="mt-4 space-y-4 leading-relaxed text-foreground/85">
          <p>
            Good Shepherd South Asian Ministry (GSSAM) began in 1988 as a home for South Asian
            families in the Bay Area who longed to worship in the Lutheran tradition while
            honoring the languages and culture of their homeland. What started as a small
            gathering has grown into a warm, multi-generational congregation in the heart of Fremont.
          </p>
          <p>
            Today, our members lead worship through traditional Lutheran hymns sung in
            Telugu, Hindi, Tamil, and English — a living picture of Revelation's vision of every
            nation, tribe, and tongue gathered before the throne of the Lamb.
          </p>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 gap-5">
          {[
            {
              icon: Cross,
              title: 'Our Mission',
              text: 'To worship the Lord Jesus Christ, proclaim the Gospel of grace, and nurture a community where South Asian families encounter the love of the Good Shepherd.',
            },
            {
              icon: Globe2,
              title: 'Our Vision',
              text: 'A church where South Asian heritage and Lutheran faith flourish together — and where every newcomer finds family, belonging, and hope.',
            },
            {
              icon: Music4,
              title: 'Our Worship',
              text: 'Traditional Lutheran liturgy and hymns, led by our own congregation members in four languages, with the warmth and joy of South Asian fellowship.',
            },
            {
              icon: Users,
              title: 'Our Community',
              text: 'From baptisms to potlucks, youth nights to prayer meetings — we share life together as one family across generations.',
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-xl bg-card ring-1 ring-border p-6 shadow-sm">
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-saffron/25 text-maroon">
                <Icon className="w-5 h-5" />
              </span>
              <h3 className="mt-3 font-display font-bold text-lg">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-14">
        <div className="rounded-2xl bg-maroon-deep text-amber-50 p-8 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 pattern-dots opacity-40" aria-hidden="true" />
          <div className="relative flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
            <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-saffron/20 ring-2 ring-gold shrink-0">
              <Church className="w-9 h-9 text-gold" />
            </span>
            <div>
              <p className="text-gold font-semibold tracking-[0.2em] uppercase text-xs">Our Pastor</p>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold">Pastor Edward Kuntam</h2>
              <p className="mt-3 text-amber-50/85 leading-relaxed text-sm sm:text-base">
                Pastor Edward shepherds our congregation with a heart for South Asian families —
                preaching the Word, administering the Sacraments, and leading worship in the
                languages of our people. He and his family would love to welcome you this Sunday.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/60 pattern-dots">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-maroon">What We Believe</h2>
          <p className="mt-4 leading-relaxed text-foreground/85">
            As a {CHURCH.denomination} congregation, we confess the historic Christian faith
            summarized in the Apostles' and Nicene Creeds:
          </p>
          <ul className="mt-5 space-y-3">
            {[
              'Grace alone — we are saved by God\'s undeserved love, received through faith in Jesus Christ.',
              'Faith alone — not by our works, but by trusting in the finished work of Christ on the cross.',
              'Scripture alone — the Bible is the inspired Word of God and the final authority for faith and life.',
              'The priesthood of all believers — every member is called and gifted to serve.',
              'The Sacraments — Holy Baptism and Holy Communion, means of grace for all who believe.',
            ].map((b) => (
              <li key={b} className="flex gap-3 rounded-lg bg-card ring-1 ring-border px-4 py-3 text-sm leading-relaxed">
                <span className="text-gold font-bold shrink-0" aria-hidden="true">✦</span>
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-xl bg-maroon text-amber-50 p-6 sm:p-8 text-center shadow-md">
            <p className="font-display italic text-lg sm:text-xl leading-relaxed">
              "I am the good shepherd. The good shepherd lays down his life for the sheep."
            </p>
            <p className="mt-2 text-sm text-gold font-semibold tracking-wide">— John 10:11</p>
          </div>
        </div>
      </section>
    </>
  );
}
