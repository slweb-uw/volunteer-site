import {
  expandOccurrences,
  monthKeysForRange,
  type CalendarEventSource,
} from "helpers/calendarEvents";

// Stored dates are Timestamps; only toDate() matters here.
const ts = (iso: string) => ({ toDate: () => new Date(iso) });

const clinic = (over: Partial<CalendarEventSource> = {}): CalendarEventSource => ({
  id: "evt1",
  name: "Clinic",
  projectId: "p1",
  projectName: "Mobile Clinic",
  address: "1 Main St",
  startTime: "09:00",
  endTime: "12:30",
  dates: [ts("2026-09-05T07:00:00Z")],
  ...over,
});

const wide = [new Date("2026-01-01T00:00:00Z"), new Date("2027-01-01T00:00:00Z")] as const;

describe("monthKeysForRange", () => {
  test("uses 0-based months, matching how events write `calendar`", () => {
    const keys = monthKeysForRange(
      new Date("2026-09-10T00:00:00Z"),
      new Date("2026-09-20T00:00:00Z"),
    );
    expect(keys).toEqual(["2026-8"]);
  });

  test("a month grid that spills into neighbours covers all three months", () => {
    // Month view of September 2026 shows Aug 30 - Oct 10.
    const keys = monthKeysForRange(
      new Date("2026-08-30T00:00:00Z"),
      new Date("2026-10-11T00:00:00Z"),
    );
    expect(keys).toEqual(["2026-7", "2026-8", "2026-9"]);
  });

  test("rolls over the year boundary", () => {
    const keys = monthKeysForRange(
      new Date("2026-12-10T00:00:00Z"),
      new Date("2027-01-20T00:00:00Z"),
    );
    expect(keys).toEqual(["2026-11", "2027-0"]);
  });

  test("is padded a day so events at a month edge are not missed", () => {
    const keys = monthKeysForRange(
      new Date("2026-09-01T00:00:00Z"),
      new Date("2026-09-30T23:00:00Z"),
    );
    expect(keys).toEqual(["2026-7", "2026-8", "2026-9"]);
  });
});

describe("expandOccurrences", () => {
  test("applies wall-clock times in the location's zone (Pacific, daylight time)", () => {
    const [occ] = expandOccurrences([clinic()], "Seattle", ...wide);
    expect(occ.dateKey).toBe("2026-09-05");
    expect(occ.timeZone).toBe("America/Los_Angeles");
    expect(occ.start.toISOString()).toBe("2026-09-05T16:00:00.000Z"); // 09:00 PDT
    expect(occ.end.toISOString()).toBe("2026-09-05T19:30:00.000Z"); // 12:30 PDT
    expect(occ.allDay).toBe(false);
  });

  test("uses standard time in winter", () => {
    const [occ] = expandOccurrences(
      [clinic({ dates: [ts("2026-01-10T08:00:00Z")] })],
      "Seattle",
      ...wide,
    );
    expect(occ.start.toISOString()).toBe("2026-01-10T17:00:00.000Z"); // 09:00 PST
  });

  test("Mountain and Alaska events land at different instants", () => {
    const [denver] = expandOccurrences([clinic()], "Montana", ...wide);
    const [anchorage] = expandOccurrences([clinic()], "Alaska", ...wide);
    expect(denver.start.toISOString()).toBe("2026-09-05T15:00:00.000Z"); // MDT
    expect(anchorage.start.toISOString()).toBe("2026-09-05T17:00:00.000Z"); // AKDT
  });

  test("a per-event timeZone overrides the location", () => {
    const [occ] = expandOccurrences(
      [clinic({ timeZone: "America/Chicago" })],
      "Seattle",
      ...wide,
    );
    expect(occ.timeZone).toBe("America/Chicago");
    expect(occ.start.toISOString()).toBe("2026-09-05T14:00:00.000Z"); // CDT
  });

  test("makes one occurrence per date with stable ids, in time order", () => {
    const occs = expandOccurrences(
      [
        clinic({
          dates: [
            ts("2026-09-19T07:00:00Z"),
            ts("2026-09-05T07:00:00Z"),
            ts("2026-09-05T07:00:00Z"), // duplicate date is ignored
          ],
        }),
      ],
      "Seattle",
      ...wide,
    );
    expect(occs.map((o) => o.id)).toEqual(["evt1-20260905", "evt1-20260919"]);
    expect(occs[0].signupDate).toBe("2026-09-05T07:00:00.000Z");
  });

  test("falls back to `date` when `dates` is missing or empty", () => {
    const a = expandOccurrences(
      [clinic({ dates: undefined, date: ts("2026-09-05T07:00:00Z") })],
      "Seattle",
      ...wide,
    );
    const b = expandOccurrences(
      [clinic({ dates: [], date: ts("2026-09-05T07:00:00Z") })],
      "Seattle",
      ...wide,
    );
    expect(a).toHaveLength(1);
    expect(b).toHaveLength(1);
  });

  test("keeps only occurrences that overlap the requested range", () => {
    const events = [
      clinic({ dates: [ts("2026-09-05T07:00:00Z"), ts("2026-10-17T07:00:00Z")] }),
    ];
    const occs = expandOccurrences(
      events,
      "Seattle",
      new Date("2026-09-01T00:00:00Z"),
      new Date("2026-10-01T00:00:00Z"),
    );
    expect(occs.map((o) => o.dateKey)).toEqual(["2026-09-05"]);
  });

  test("a shift that ends after midnight rolls the end to the next day", () => {
    const [occ] = expandOccurrences(
      [clinic({ startTime: "22:00", endTime: "02:00" })],
      "Seattle",
      ...wide,
    );
    expect(occ.end.getTime() - occ.start.getTime()).toBe(4 * 3_600_000);
  });

  test("a missing end time defaults to one hour", () => {
    const [occ] = expandOccurrences(
      [clinic({ endTime: undefined })],
      "Seattle",
      ...wide,
    );
    expect(occ.end.getTime() - occ.start.getTime()).toBe(3_600_000);
  });

  test("a missing or malformed start time becomes an all-day event", () => {
    for (const startTime of [undefined, "", "soon"]) {
      const [occ] = expandOccurrences([clinic({ startTime })], "Seattle", ...wide);
      expect(occ.allDay).toBe(true);
      expect(occ.dateKey).toBe("2026-09-05");
    }
  });

  test("skips archived events", () => {
    expect(
      expandOccurrences([clinic({ archived: true })], "Seattle", ...wide),
    ).toEqual([]);
  });

  test("never carries a lead email into an occurrence", () => {
    const source = { ...clinic(), leadEmail: "lead@example.edu" } as CalendarEventSource;
    const [occ] = expandOccurrences([source], "Seattle", ...wide);
    expect(JSON.stringify(occ)).not.toContain("lead@example.edu");
  });
});
