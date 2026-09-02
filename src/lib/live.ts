import { WORSHIP } from "@/lib/site";

export function nowPacific(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
}

export function isLiveNow(now: Date = nowPacific()): boolean {
  if (now.getDay() !== WORSHIP.dayOfWeek) return false;
  const minutes = now.getHours() * 60 + now.getMinutes();
  const start = WORSHIP.startHour * 60 + WORSHIP.startMinute - 10;
  const end = WORSHIP.endHour * 60 + WORSHIP.endMinute + 15;
  return minutes >= start && minutes <= end;
}

export function nextWorshipDate(now: Date = nowPacific()): Date {
  const d = new Date(now);
  let add = (WORSHIP.dayOfWeek - d.getDay() + 7) % 7;
  const startMinutes = WORSHIP.startHour * 60 + WORSHIP.startMinute;
  const nowMinutes = d.getHours() * 60 + d.getMinutes();
  if (add === 0 && nowMinutes >= startMinutes) add = 7;
  d.setDate(d.getDate() + add);
  d.setHours(WORSHIP.startHour, WORSHIP.startMinute, 0, 0);
  return d;
}

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function countdownTo(target: Date, now: Date = nowPacific()): Countdown {
  let diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / 86_400_000);
  diff -= days * 86_400_000;
  const hours = Math.floor(diff / 3_600_000);
  diff -= hours * 3_600_000;
  const minutes = Math.floor(diff / 60_000);
  diff -= minutes * 60_000;
  const seconds = Math.floor(diff / 1000);
  return { days, hours, minutes, seconds };
}
