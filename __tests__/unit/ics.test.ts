import {
  buildIcs,
  escapeText,
  foldLine,
  formatUtc,
  googleCalendarUrl,
  htmlToText,
  signupUrl,
} from "helpers/ics";
import type { Occurrence } from "helpers/calendarEvents";

const BASE = "https://servicelearning.washington.edu";
const NOW = new Date("2026-08-01T12:00:00Z");

const occ = (over: Partial<Occurrence> = {}): Occurrence => ({
  id: "evt1-20260905",
  eventId: "evt1",
  name: "Clinic",
  projectId: "p1",
  projectName: "Mobile Clinic",
  address: "1 Main St, Seattle",
  volunteerTypes: ["Student", "Provider"],
  requiredTraining: "",
  eventInformation: "<p>Bring ID &amp; water</p>",
  dateKey: "2026-09-05",
  timeZone: "America/Los_Angeles",
  start: new Date("2026-09-05T16:00:00Z"),
  end: new Date("2026-09-05T19:30:00Z"),
  allDay: false,
  signupDate: "2026-09-05T07:00:00.000Z",
  ...over,
});

describe("escapeText", () => {
  test("escapes backslashes, semicolons, commas and newlines", () => {
    expect(escapeText("a\\b;c,d\ne\r\nf")).toBe("a\\\\b\\;c\\,d\\ne\\nf");
  });
});

describe("foldLine", () => {
  test("leaves short lines alone", () => {
    expect(foldLine("SUMMARY:Clinic")).toBe("SUMMARY:Clinic");
  });

  test("folds long lines to at most 75 octets, continuing with a space", () => {
    const folded = foldLine("DESCRIPTION:" + "x".repeat(200));
    const parts = folded.split("\r\n");
    expect(parts.length).toBeGreaterThan(2);
    for (const part of parts) expect(Buffer.byteLength(part)).toBeLessThanOrEqual(75);
    for (const part of parts.slice(1)) expect(part.startsWith(" ")).toBe(true);
    // Unfolding restores the original.
    expect(parts.map((p, i) => (i ? p.slice(1) : p)).join("")).toBe(
      "DESCRIPTION:" + "x".repeat(200),
    );
  });

  test("never splits a multi-byte character", () => {
    const original = "SUMMARY:" + "é".repeat(80) + "😀".repeat(20);
    const parts = foldLine(original).split("\r\n");
    for (const part of parts) expect(Buffer.byteLength(part)).toBeLessThanOrEqual(75);
    expect(parts.map((p, i) => (i ? p.slice(1) : p)).join("")).toBe(original);
  });
});

describe("formatUtc", () => {
  test("formats as basic UTC", () => {
    expect(formatUtc(new Date("2026-09-05T16:00:00.000Z"))).toBe("20260905T160000Z");
  });
});

describe("htmlToText", () => {
  test("strips tags and decodes common entities", () => {
    expect(htmlToText("<p>Bring ID &amp; water</p><p>Line two<br>three</p>")).toBe(
      "Bring ID & water\nLine two\nthree",
    );
  });
});

describe("buildIcs", () => {
  const ics = buildIcs([occ()], { baseUrl: BASE, calendarName: "Seattle volunteering", now: NOW });

  test("is a CRLF-terminated VCALENDAR with the required properties", () => {
    expect(ics.startsWith("BEGIN:VCALENDAR\r\nVERSION:2.0\r\n")).toBe(true);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
    expect(ics).toContain("PRODID:");
    expect(ics.replace(/\r\n/g, "")).not.toMatch(/[\r\n]/);
  });

  test("each occurrence is a VEVENT with a stable UID and UTC times", () => {
    expect(ics).toContain("UID:evt1-20260905@servicelearning.washington.edu\r\n");
    expect(ics).toContain("DTSTAMP:20260801T120000Z\r\n");
    expect(ics).toContain("DTSTART:20260905T160000Z\r\n");
    expect(ics).toContain("DTEND:20260905T193000Z\r\n");
    expect(ics).toContain("SUMMARY:Clinic\r\n");
  });

  test("escapes the location and links to the signup page", () => {
    expect(ics).toContain("LOCATION:1 Main St\\, Seattle\r\n");
    // Long lines are folded, so unfold before comparing.
    expect(ics.replace(/\r\n /g, "")).toContain(
      "URL:https://servicelearning.washington.edu/calendar/evt1/signup?date=2026-09-05T07%3A00%3A00.000Z\r\n",
    );
  });

  test("the description is plain text with project, roles and signup link", () => {
    const unfolded = ics.replace(/\r\n /g, "");
    expect(unfolded).toContain("Mobile Clinic\\n\\nVolunteer types: Student\\, Provider");
    expect(unfolded).toContain("Bring ID & water");
    expect(unfolded).toContain("Sign up: https://servicelearning.washington.edu/calendar/evt1/signup");
  });

  test("all-day events use date values", () => {
    const allDay = buildIcs(
      [
        occ({
          allDay: true,
          start: new Date("2026-09-05T07:00:00Z"),
          end: new Date("2026-09-06T07:00:00Z"),
        }),
      ],
      { baseUrl: BASE, calendarName: "x", now: NOW },
    );
    expect(allDay).toContain("DTSTART;VALUE=DATE:20260905\r\n");
    expect(allDay).toContain("DTEND;VALUE=DATE:20260906\r\n");
  });

  test("no line exceeds 75 octets", () => {
    const long = buildIcs([occ({ eventInformation: "word ".repeat(150) })], {
      baseUrl: BASE,
      calendarName: "x",
      now: NOW,
    });
    for (const line of long.split("\r\n")) {
      expect(Buffer.byteLength(line)).toBeLessThanOrEqual(75);
    }
  });

  test("contains no email address", () => {
    expect(ics).not.toMatch(/@(?!servicelearning)/);
    expect(ics.toLowerCase()).not.toContain("mailto:");
  });

  test("an empty list is still a valid calendar", () => {
    const empty = buildIcs([], { baseUrl: BASE, calendarName: "x", now: NOW });
    expect(empty).not.toContain("BEGIN:VEVENT");
    expect(empty.endsWith("END:VCALENDAR\r\n")).toBe(true);
  });
});

describe("googleCalendarUrl", () => {
  test("builds an add-event link with UTC dates", () => {
    const url = new URL(googleCalendarUrl(occ(), BASE));
    expect(url.origin + url.pathname).toBe("https://calendar.google.com/calendar/render");
    expect(url.searchParams.get("action")).toBe("TEMPLATE");
    expect(url.searchParams.get("text")).toBe("Clinic");
    expect(url.searchParams.get("dates")).toBe("20260905T160000Z/20260905T193000Z");
    expect(url.searchParams.get("location")).toBe("1 Main St, Seattle");
    expect(url.searchParams.get("details")).toContain("Sign up: ");
  });

  test("all-day events use date-only values", () => {
    const url = new URL(
      googleCalendarUrl(
        occ({
          allDay: true,
          start: new Date("2026-09-05T07:00:00Z"),
          end: new Date("2026-09-06T07:00:00Z"),
        }),
        BASE,
      ),
    );
    expect(url.searchParams.get("dates")).toBe("20260905/20260906");
  });
});

describe("signupUrl", () => {
  test("keeps the existing /calendar/{id}/signup?date= format", () => {
    expect(signupUrl(BASE, occ())).toBe(
      `${BASE}/calendar/evt1/signup?date=2026-09-05T07%3A00%3A00.000Z`,
    );
  });
});
