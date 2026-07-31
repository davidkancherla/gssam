import { useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, LayoutList } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import EventCard, { eventDate } from '@/components/EventCard';
import { EVENTS, type ChurchEvent, type EventCategory } from '@/data/site';

const CATEGORIES: Array<EventCategory | 'All'> = [
  'All',
  'Worship',
  'Bible Study',
  'Youth',
  'Outreach',
  'Fellowship',
  'Special Service',
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Events (incl. weekly recurrences) that fall on a given day. */
function eventsOn(day: Date): ChurchEvent[] {
  return EVENTS.filter((ev) => {
    if (ev.date) {
      const [y, m, d] = ev.date.split('-').map(Number);
      return day.getFullYear() === y && day.getMonth() === m - 1 && day.getDate() === d;
    }
    return ev.weeklyDay === day.getDay();
  });
}

export default function Events() {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const filtered = useMemo(
    () =>
      EVENTS.filter((ev) => category === 'All' || ev.category === category).sort(
        (a, b) => eventDate(a).getTime() - eventDate(b).getTime()
      ),
    [category]
  );

  const calDays = useMemo(() => {
    const first = new Date(month);
    const start = new Date(first);
    start.setDate(1 - first.getDay());
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [month]);

  const today = new Date();
  const isToday = (d: Date) =>
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();

  const shiftMonth = (n: number) =>
    setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));

  return (
    <>
      <PageHeader
        title="Events"
        subtitle="Worship, study, fellowship, and celebration — there's always something happening at GSSAM."
        image="/images/real-palm-sunday.jpg"
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                  category === c ? 'bg-maroon text-white' : 'bg-card ring-1 ring-border hover:bg-secondary'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex rounded-md ring-1 ring-border overflow-hidden bg-card self-start">
            <button
              onClick={() => setView('list')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium ${
                view === 'list' ? 'bg-maroon text-white' : 'hover:bg-secondary'
              }`}
            >
              <LayoutList className="w-4 h-4" /> List
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium ${
                view === 'calendar' ? 'bg-maroon text-white' : 'hover:bg-secondary'
              }`}
            >
              <CalendarDays className="w-4 h-4" /> Calendar
            </button>
          </div>
        </div>

        {/* List view */}
        {view === 'list' && (
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((ev) => (
              <EventCard key={ev.id} ev={ev} />
            ))}
          </div>
        )}

        {/* Calendar view */}
        {view === 'calendar' && (
          <div className="mt-8 rounded-xl bg-card ring-1 ring-border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <button
                onClick={() => shiftMonth(-1)}
                className="p-2 rounded-md hover:bg-secondary"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="font-display text-xl font-bold">
                {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={() => shiftMonth(1)}
                className="p-2 rounded-md hover:bg-secondary"
                aria-label="Next month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-7 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
              {WEEKDAYS.map((d) => (
                <div key={d} className="py-2.5">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {calDays.map((d) => {
                const dayEvents = eventsOn(d).filter(
                  (ev) => category === 'All' || ev.category === category
                );
                const inMonth = d.getMonth() === month.getMonth();
                return (
                  <div
                    key={d.toISOString()}
                    className={`min-h-[5.5rem] sm:min-h-[7rem] border-b border-r border-border p-1.5 sm:p-2 ${
                      inMonth ? '' : 'bg-muted/40 text-muted-foreground'
                    }`}
                  >
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 text-xs rounded-full ${
                        isToday(d) ? 'bg-saffron text-maroon-deep font-bold' : ''
                      }`}
                    >
                      {d.getDate()}
                    </span>
                    <div className="mt-1 space-y-1">
                      {dayEvents.map((ev) => (
                        <div
                          key={ev.id}
                          title={`${ev.title} · ${ev.location}`}
                          className={`truncate rounded px-1.5 py-0.5 text-[10px] sm:text-[11px] font-medium ${
                            ev.category === 'Worship'
                              ? 'bg-[hsl(349,68%,25%)] text-white'
                              : ev.category === 'Bible Study'
                                ? 'bg-[hsl(38,70%,45%)] text-white'
                                : ev.category === 'Youth'
                                  ? 'bg-[hsl(200,55%,35%)] text-white'
                                  : ev.category === 'Outreach'
                                    ? 'bg-[hsl(140,40%,35%)] text-white'
                                    : ev.category === 'Fellowship'
                                      ? 'bg-[hsl(20,70%,45%)] text-white'
                                      : 'bg-[hsl(280,45%,35%)] text-white'
                          }`}
                        >
                          {ev.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p className="mt-8 text-sm text-muted-foreground text-center">
          Ministry leaders: events are managed in one simple file — no coding required to keep this
          page current.
        </p>
      </section>
    </>
  );
}
