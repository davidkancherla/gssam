import PageHeader from '@/components/PageHeader';
import { CHURCH } from '@/data/site';
import { HandCoins, Mail, Smartphone, Building2 } from 'lucide-react';

export default function Give() {
  return (
    <>
      <PageHeader
        title="Give & Support"
        subtitle="Your generosity sustains worship, outreach, and fellowship at GSSAM."
        image="/images/outreach.png"
      />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        <div className="rounded-2xl bg-maroon-deep text-amber-50 p-6 sm:p-8 text-center shadow-md">
          <p className="font-display italic text-lg sm:text-xl leading-relaxed">
            "Each of you should give what you have decided in your heart to give, not reluctantly
            or under compulsion, for God loves a cheerful giver."
          </p>
          <p className="mt-2 text-sm text-amber-300 font-semibold tracking-wide">— 2 Corinthians 9:7</p>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 gap-5">
          <div className="rounded-xl bg-card ring-1 ring-border p-6 shadow-sm">
            <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-saffron/25 text-maroon">
              <HandCoins className="w-5 h-5" />
            </span>
            <h2 className="mt-3 font-display font-bold text-lg">During Worship</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Offerings are received during every Sunday service. Cash and checks are welcome —
              envelopes are available in the sanctuary.
            </p>
          </div>

          <div className="rounded-xl bg-card ring-1 ring-border p-6 shadow-sm">
            <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-saffron/25 text-maroon">
              <Mail className="w-5 h-5" />
            </span>
            <h2 className="mt-3 font-display font-bold text-lg">By Mail</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Checks payable to <strong>"GSSAM"</strong> may be mailed to:
              <br />
              <span className="block mt-1 font-medium text-foreground">
                Good Shepherd South Asian Ministry
                <br />
                {CHURCH.address}
              </span>
            </p>
          </div>

          <div className="rounded-xl bg-card ring-1 ring-border p-6 shadow-sm">
            <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-saffron/25 text-maroon">
              <Smartphone className="w-5 h-5" />
            </span>
            <h2 className="mt-3 font-display font-bold text-lg">Online Giving — Coming Soon</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              We're setting up secure online giving (tithe.ly / PayPal). Until then, please give
              during worship or by mail — or contact us and we'll help you directly.
            </p>
          </div>

          <div className="rounded-xl bg-card ring-1 ring-border p-6 shadow-sm">
            <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-saffron/25 text-maroon">
              <Building2 className="w-5 h-5" />
            </span>
            <h2 className="mt-3 font-display font-bold text-lg">Where Your Gift Goes</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Worship &amp; music ministry · youth programs · community outreach in Fremont ·
              fellowship meals and cultural celebrations · care for families in need.
            </p>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          GSSAM is a registered nonprofit congregation. Questions about giving or receipts?
          Call us at{' '}
          <a href={CHURCH.phoneHref} className="text-maroon font-semibold hover:underline">
            {CHURCH.phone}
          </a>
          .
        </p>
      </section>
    </>
  );
}
