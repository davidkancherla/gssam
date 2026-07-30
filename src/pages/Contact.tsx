import { useState } from 'react';
import { Clock, Mail, MapPin, Phone, Send, Youtube } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { CHURCH, WORSHIP, YOUTUBE } from '@/data/site';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Website message from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`);
    window.location.href = `mailto:${CHURCH.email}?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <PageHeader
        title="Contact & Visit"
        subtitle="We'd love to meet you — this Sunday, or anytime."
        image="/images/hero-worship.png"
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid lg:grid-cols-2 gap-10">
        {/* Info + map */}
        <div>
          <h2 className="font-display text-2xl font-bold text-maroon">Plan Your Visit</h2>
          <ul className="mt-5 space-y-4">
            <li className="flex gap-3 rounded-xl bg-card ring-1 ring-border p-4">
              <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Sunday Worship</p>
                <p className="text-sm text-muted-foreground">{WORSHIP.label}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Also streamed live on{' '}
                  <a
                    href={YOUTUBE.channelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-maroon font-medium hover:underline"
                  >
                    YouTube {YOUTUBE.handle}
                  </a>
                </p>
              </div>
            </li>
            <li className="flex gap-3 rounded-xl bg-card ring-1 ring-border p-4">
              <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Address</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${CHURCH.addressMapsQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-maroon hover:underline"
                >
                  {CHURCH.address}
                </a>
              </div>
            </li>
            <li className="flex gap-3 rounded-xl bg-card ring-1 ring-border p-4">
              <Phone className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Phone</p>
                <a href={CHURCH.phoneHref} className="text-sm text-muted-foreground hover:text-maroon">
                  {CHURCH.phone}
                </a>
              </div>
            </li>
            <li className="flex gap-3 rounded-xl bg-card ring-1 ring-border p-4">
              <Youtube className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">YouTube</p>
                <a
                  href={YOUTUBE.channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-maroon"
                >
                  {YOUTUBE.handle} — services, sermons &amp; celebrations
                </a>
              </div>
            </li>
          </ul>

          <div className="mt-6 rounded-xl overflow-hidden ring-1 ring-border shadow-sm">
            <iframe
              title="Map to GSSAM Fremont"
              src={`https://www.google.com/maps?q=${CHURCH.addressMapsQuery}&output=embed`}
              className="w-full h-64 border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Contact form */}
        <div>
          <h2 className="font-display text-2xl font-bold text-maroon">Send Us a Message</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Prayer requests, questions about faith, or just want to say hello — we read every
            message.
          </p>
          <form onSubmit={submit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                Your Name
              </label>
              <input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ring-gold"
                placeholder="Full name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ring-gold"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1.5">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ring-gold resize-y"
                placeholder="How can we pray for you or help you?"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-maroon text-white font-semibold px-6 py-3 rounded-md hover:bg-maroon-deep transition-colors"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Opens your email app addressed to {CHURCH.email}
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
