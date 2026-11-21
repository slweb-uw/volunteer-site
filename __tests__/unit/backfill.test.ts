import { buildLogEntry, snapshotEvent, snapshotVolunteer } from "helpers/volunteerLog";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { backfillEntry, backfillId, shiftDateOf } = require("../../scripts/backfill-volunteer-log.js");

const event = {
  name: "Clinic",
  projectId: "p1",
  projectName: "Mobile Clinic",
  location: "Seattle",
  address: "1 Main St",
  startTime: "09:00",
  endTime: "12:00",
};
const volunteer = {
  uid: "vol-1",
  email: "Ada@Example.EDU",
  name: "Ada",
  phoneNumber: 2065550100,
  studentDiscipline: "Nursing",
  role: "Student",
  date: "2026-09-05T07:00:00.000Z",
};

describe("backfillEntry", () => {
  const entry = backfillEntry({
    eventId: "evt1",
    event,
    volunteerDocId: "vol-1_2026-09-05",
    volunteer,
    at: "SERVER_TIME",
  });

  test("has exactly the same shape as an entry the app writes", () => {
    const appEntry = buildLogEntry({
      action: "signup",
      at: "SERVER_TIME",
      actor: { uid: "u", email: "u@uw.edu", role: "admin" },
      subject: { uid: "vol-1", email: "ada@example.edu" },
      volunteer: snapshotVolunteer(volunteer),
      eventId: "evt1",
      shiftDate: "2026-09-05",
      event: snapshotEvent(event),
    });
    expect(Object.keys(entry).sort()).toEqual(Object.keys(appEntry).sort());
    expect(Object.keys(entry.volunteer).sort()).toEqual(Object.keys(appEntry.volunteer!).sort());
    expect(Object.keys(entry.event).sort()).toEqual(Object.keys(appEntry.event).sort());
  });

  test("copies the signup and event as they are, marked as a backfill", () => {
    expect(entry).toMatchObject({
      action: "backfill",
      actorUid: "system",
      subjectUid: "vol-1",
      subjectEmail: "ada@example.edu",
      eventId: "evt1",
      shiftDate: "2026-09-05",
      shiftYear: 2026,
      changes: null,
    });
    expect(entry.volunteer).toMatchObject({ name: "Ada", phoneNumber: "2065550100", role: "Student" });
    expect(entry.event).toMatchObject({ name: "Clinic", location: "Seattle" });
  });

  test("skips a signup with no usable date", () => {
    expect(
      backfillEntry({
        eventId: "evt1",
        event,
        volunteerDocId: "garbage",
        volunteer: { ...volunteer, date: undefined },
        at: "T",
      }),
    ).toBeNull();
  });
});

describe("shiftDateOf", () => {
  test("accepts ISO strings, Timestamps and Dates", () => {
    expect(shiftDateOf({ date: "2026-09-05T07:00:00.000Z" }, "x")).toBe("2026-09-05");
    expect(shiftDateOf({ date: { toDate: () => new Date("2026-09-05T07:00:00Z") } }, "x")).toBe("2026-09-05");
    expect(shiftDateOf({ date: new Date("2026-09-05T07:00:00Z") }, "x")).toBe("2026-09-05");
  });

  test("falls back to the date in the document id", () => {
    expect(shiftDateOf({}, "vol-1_2026-09-05")).toBe("2026-09-05");
    expect(shiftDateOf({ date: "not a date" }, "vol-1_2026-09-05")).toBe("2026-09-05");
    expect(shiftDateOf({}, "no-date-here")).toBeNull();
  });
});

test("entry ids are fixed, so re-running never duplicates", () => {
  expect(backfillId("evt1", "vol-1_2026-09-05")).toBe("backfill_evt1_vol-1_2026-09-05");
});
