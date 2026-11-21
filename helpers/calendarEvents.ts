import { DateTime } from "luxon";
import { dateKeyOf } from "helpers/slots";
import { eventTimeZone } from "helpers/timezones";

/** The parts of a stored event the calendar needs (Firestore `EventData`). */
export type CalendarEventSource = {
  id: string;
  name: string;
  date?: { toDate(): Date };
  dates?: { toDate(): Date }[];
  startTime?: string;
  endTime?: string;
  address?: string;
  projectId?: string;
  projectName?: string;
  volunteerTypes?: string[];
  requiredTraining?: string;
  eventInformation?: string;
  timeZone?: string;
  archived?: boolean;
  // leadEmail is deliberately not here: it never goes into the calendar,
  // exports or the public feed.
};

/** One event on one date. */
export type Occurrence = {
  /** Stable: `${eventId}-${YYYYMMDD}`. Used as the calendar and .ics UID. */
  id: string;
  eventId: string;
  name: string;
  projectId: string;
  projectName: string;
  address: string;
  volunteerTypes: string[];
  requiredTraining: string;
  eventInformation: string;
  /** "YYYY-MM-DD", the same key slots and volunteer records use. */
  dateKey: string;
  timeZone: string;
  /** Real instants. `allDay` events have no usable times and span the date. */
  start: Date;
  end: Date;
  allDay: boolean;
  /** The stored timestamp as ISO. The signup page reads its date from this. */
  signupDate: string;
};

const HHMM = /^(\d{1,2}):(\d{2})(?::\d{2})?$/;

/**
 * "YYYY-M" keys (month is 0-based, matching how events write their `calendar`
 * array) for every month the range touches. Padded by a day on each side so
 * events near a month edge are not missed to a time-zone offset.
 */
export function monthKeysForRange(start: Date, end: Date): string[] {
  const from = new Date(start.getTime() - 86_400_000);
  const to = new Date(end.getTime() + 86_400_000);
  const keys: string[] = [];
  let y = from.getUTCFullYear();
  let m = from.getUTCMonth();
  const lastY = to.getUTCFullYear();
  const lastM = to.getUTCMonth();
  while (y < lastY || (y === lastY && m <= lastM)) {
    keys.push(`${y}-${m}`);
    m += 1;
    if (m > 11) {
      m = 0;
      y += 1;
    }
  }
  return keys;
}

/**
 * Turn stored events into one Occurrence per date, keeping only those that
 * overlap [rangeStart, rangeEnd). Archived events are skipped.
 */
export function expandOccurrences(
  events: CalendarEventSource[],
  location: string,
  rangeStart: Date,
  rangeEnd: Date,
): Occurrence[] {
  const out: Occurrence[] = [];

  for (const event of events) {
    if (event.archived) continue;

    const stamps =
      event.dates && event.dates.length > 0
        ? event.dates
        : event.date
          ? [event.date]
          : [];
    const timeZone = eventTimeZone(event, location);
    const seen = new Set<string>();

    for (const stamp of stamps) {
      const day = stamp.toDate();
      if (Number.isNaN(day.getTime())) continue;
      const dateKey = dateKeyOf(day);
      if (seen.has(dateKey)) continue;
      seen.add(dateKey);

      const times = resolveTimes(dateKey, event.startTime, event.endTime, timeZone);
      if (times.end <= rangeStart || times.start >= rangeEnd) continue;

      out.push({
        id: `${event.id}-${dateKey.replace(/-/g, "")}`,
        eventId: event.id,
        name: event.name,
        projectId: event.projectId ?? "",
        projectName: event.projectName ?? "",
        address: event.address ?? "",
        volunteerTypes: event.volunteerTypes ?? [],
        requiredTraining: event.requiredTraining ?? "",
        eventInformation: event.eventInformation ?? "",
        dateKey,
        timeZone,
        ...times,
        signupDate: day.toISOString(),
      });
    }
  }

  return out.sort((a, b) => a.start.getTime() - b.start.getTime());
}

function resolveTimes(
  dateKey: string,
  startTime: string | undefined,
  endTime: string | undefined,
  zone: string,
): { start: Date; end: Date; allDay: boolean } {
  const startMatch = startTime ? HHMM.exec(startTime.trim()) : null;
  const dayStart = DateTime.fromISO(dateKey, { zone });

  if (!startMatch) {
    // No usable start time: show it as an all-day event on that date.
    return {
      start: dayStart.toJSDate(),
      end: dayStart.plus({ days: 1 }).toJSDate(),
      allDay: true,
    };
  }

  const start = dayStart.set({
    hour: Number(startMatch[1]),
    minute: Number(startMatch[2]),
  });
  const endMatch = endTime ? HHMM.exec(endTime.trim()) : null;
  let end = endMatch
    ? dayStart.set({ hour: Number(endMatch[1]), minute: Number(endMatch[2]) })
    : start.plus({ hours: 1 });
  // An end at or before the start means the shift runs past midnight.
  if (end <= start) end = end.plus({ days: 1 });

  return { start: start.toJSDate(), end: end.toJSDate(), allDay: false };
}
