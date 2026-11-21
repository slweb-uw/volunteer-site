import type { Occurrence } from "helpers/calendarEvents";

/**
 * Calendar export: RFC 5545 (.ics) files and Google Calendar "add event" links.
 * Occurrences carry no lead email or other contact details, so none can leak
 * into a downloaded file or the public feed.
 */

export function signupUrl(baseUrl: string, occ: Occurrence): string {
  return `${baseUrl}/calendar/${occ.eventId}/signup?date=${encodeURIComponent(occ.signupDate)}`;
}

/** Escape a TEXT value (RFC 5545 section 3.3.11). */
export function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");
}

/**
 * Fold a content line to at most 75 octets per line (section 3.1). Never
 * splits a multi-byte character; continuation lines start with one space.
 */
export function foldLine(line: string): string {
  if (Buffer.byteLength(line, "utf8") <= 75) return line;
  const lines: string[] = [];
  let current = "";
  let bytes = 0;
  // The first line may hold 75 octets, continuations 74 plus the leading space.
  let limit = 75;
  for (const ch of line) {
    const size = Buffer.byteLength(ch, "utf8");
    if (bytes + size > limit) {
      lines.push(current);
      current = "";
      bytes = 0;
      limit = 74;
    }
    current += ch;
    bytes += size;
  }
  lines.push(current);
  return lines.join("\r\n ");
}

/** "20260905T163000Z" */
export function formatUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function formatDateOnly(date: Date): string {
  return formatUtc(date).slice(0, 8);
}

/** Plain-text version of the rich-text event information. */
export function htmlToText(html: string): string {
  return html
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function description(occ: Occurrence, url: string): string {
  const parts = [occ.projectName];
  if (occ.volunteerTypes.length) {
    parts.push(`Volunteer types: ${occ.volunteerTypes.join(", ")}`);
  }
  const info = htmlToText(occ.eventInformation).slice(0, 1000);
  if (info) parts.push(info);
  parts.push(`Sign up: ${url}`);
  return parts.filter(Boolean).join("\n\n");
}

export function buildIcs(
  occurrences: Occurrence[],
  opts: { baseUrl: string; calendarName: string; now?: Date },
): string {
  const now = opts.now ?? new Date();
  const host = new URL(opts.baseUrl).host;
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//UW Service Learning//Volunteer Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(opts.calendarName)}`,
  ];

  for (const occ of occurrences) {
    const url = signupUrl(opts.baseUrl, occ);
    lines.push("BEGIN:VEVENT", `UID:${occ.id}@${host}`, `DTSTAMP:${formatUtc(now)}`);
    if (occ.allDay) {
      lines.push(
        `DTSTART;VALUE=DATE:${formatDateOnly(occ.start)}`,
        `DTEND;VALUE=DATE:${formatDateOnly(occ.end)}`,
      );
    } else {
      lines.push(`DTSTART:${formatUtc(occ.start)}`, `DTEND:${formatUtc(occ.end)}`);
    }
    lines.push(`SUMMARY:${escapeText(occ.name)}`);
    lines.push(`DESCRIPTION:${escapeText(description(occ, url))}`);
    if (occ.address) lines.push(`LOCATION:${escapeText(occ.address)}`);
    lines.push(`URL:${url}`, "END:VEVENT");
  }
  lines.push("END:VCALENDAR");

  return lines.map(foldLine).join("\r\n") + "\r\n";
}

export function googleCalendarUrl(occ: Occurrence, baseUrl: string): string {
  const dates = occ.allDay
    ? `${formatDateOnly(occ.start)}/${formatDateOnly(occ.end)}`
    : `${formatUtc(occ.start)}/${formatUtc(occ.end)}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: occ.name,
    dates,
    details: description(occ, signupUrl(baseUrl, occ)),
  });
  if (occ.address) params.set("location", occ.address);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
