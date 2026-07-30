import { useMemo } from 'react';
import { CalendarPlus, Clock, MapPin, Repeat } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CATEGORY_COLORS, type ChurchEvent } from '@/data/site';
import { formatTime } from '@/lib/live';

/** Next occurrence (or the fixed date) of an event, as a local Date. */
export function eventDate(ev: ChurchEvent, from: Date = new Date()): Date {
  if (ev.date) {
    const [y, m, d] = ev.date.split('-').map(Number);
    const [hh, mm] = ev.startTime.split(':').map(Number);
    return new Date(y, m - 1, d, hh, mm);
  }
  const d = new Date(from);
  const [hh, mm] = ev.startTime.split(':').map(Number);
  let add = ((ev.weeklyDay ?? 0) - d.getDay() + 7) % 7;
  if (add === 0 && (d.getHours() * 60 + d.getMinutes()) >= hh * 60 + mm) add = 7;
  d.setDate(d.getDate() + add);
  d.setHours(hh, mm, 0, 0);
  return d;
}

function endDate(start: Date, ev: ChurchEvent): Date {
  const [hh, mm] = ev.endTime.split(':').map(Number);
  const e = new Date(start);
  e.setHours(hh, mm, 0, 0);
  return e;
}

const pad = (n: number) => String(n).padStart(2, '0');
const toGCal = (d: Date) =>
  `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

function googleCalUrl(ev: ChurchEvent, start: Date): string {
  const end = endDate(start, ev);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${ev.title} — GSSAM Fremont`,
    dates: `${toGCal(start)}/${toGCal(end)}`,
    details: ev.description,
    location: ev.location,
    ctz: 'America/Los_Angeles',
  });
  if (ev.weeklyDay !== undefined) {
    const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    params.set('recur', `RRULE:FREQ=WEEKLY;BYDAY=${days[ev.weeklyDay]}`);
  }
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function downloadIcs(ev: ChurchEvent, start: Date) {
  const end = endDate(start, ev);
  const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GSSAM Fremont//Events//EN',
    'BEGIN:VEVENT',
    `UID:${ev.id}-${start.getTime()}@gssam-iccfremont.com`,
    `DTSTART:${toGCal(start)}`,
    `DTEND:${toGCal(end)}`,
    `SUMMARY:${ev.title} — GSSAM Fremont`,
    `DESCRIPTION:${ev.description.replace(/,/g, '\\,')}`,
    `LOCATION:${ev.location.replace(/,/g, '\\,')}`,
  ];
  if (ev.weeklyDay !== undefined) lines.push(`RRULE:FREQ=WEEKLY;BYDAY=${days[ev.weeklyDay]}`);
  lines.push('END:VEVENT', 'END:VCALENDAR');

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${ev.id}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function EventCard({ ev }: { ev: ChurchEvent }) {
  const start = useMemo(() => eventDate(ev), [ev]);
  const dateLabel = start.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="flex flex-col rounded-xl bg-card ring-1 ring-border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {ev.image && (
        <div className="h-40 overflow-hidden">
          <img src={ev.image} alt="" className="w-full h-full object-cover" loading="lazy" />
        </div>
      )}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[ev.category]}`}>
            {ev.category}
          </span>
          {ev.weeklyDay !== undefined && (
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Repeat className="w-3 h-3" /> Weekly
            </span>
          )}
        </div>
        <h3 className="mt-3 font-display text-xl font-bold">{ev.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {dateLabel} · {formatTime(ev.startTime)} – {formatTime(ev.endTime)} PT
        </p>
        <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" /> {ev.location}
        </p>
        <p className="mt-3 text-sm leading-relaxed flex-1">{ev.description}</p>
        <div className="mt-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 text-sm font-semibold text-maroon border border-gold rounded-md px-3.5 py-2 hover:bg-saffron/20 transition-colors">
              <CalendarPlus className="w-4 h-4" /> Add to Calendar
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <a href={googleCalUrl(ev, start)} target="_blank" rel="noopener noreferrer">
                  Google Calendar
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => downloadIcs(ev, start)}>
                Apple / Outlook (.ics)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </article>
  );
}
