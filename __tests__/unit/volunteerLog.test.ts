import {
  actorRoleOf,
  buildLogEntry,
  diffSnapshots,
  snapshotEvent,
  snapshotVolunteer,
  CLIENT_LOG_ACTIONS,
} from "helpers/volunteerLog";

const actor = { uid: "lead-1", email: "Lead@UW.edu ", role: "lead" as const };
const volunteer = snapshotVolunteer({
  name: "Ada",
  phoneNumber: 2065550100,
  studentDiscipline: "Nursing",
  comments: undefined,
  role: "Student",
});
const event = snapshotEvent({
  name: "Clinic",
  projectId: "p1",
  projectName: "Mobile Clinic",
  location: "Seattle",
  address: "1 Main St",
  startTime: "09:00",
  endTime: "12:00",
});

describe("snapshots", () => {
  test("stringify values and turn missing ones into empty strings", () => {
    expect(volunteer).toEqual({
      name: "Ada",
      phoneNumber: "2065550100",
      studentDiscipline: "Nursing",
      comments: "",
      role: "Student",
    });
    expect(snapshotEvent({})).toEqual({
      name: "",
      projectId: "",
      projectName: "",
      location: "",
      address: "",
      startTime: "",
      endTime: "",
    });
  });
});

describe("actorRoleOf", () => {
  test("admin outranks lead, and neither means volunteer", () => {
    expect(actorRoleOf({ isAdmin: true, isLead: true })).toBe("admin");
    expect(actorRoleOf({ isLead: true })).toBe("lead");
    expect(actorRoleOf({})).toBe("volunteer");
  });
});

describe("diffSnapshots", () => {
  test("lists only the fields that changed, with before and after", () => {
    const after = { ...volunteer, name: "Ada L.", comments: "Vegan lunch" };
    expect(diffSnapshots(volunteer, after, ["name", "phoneNumber", "comments"])).toEqual({
      name: { from: "Ada", to: "Ada L." },
      comments: { from: "", to: "Vegan lunch" },
    });
  });

  test("is empty when nothing changed", () => {
    expect(diffSnapshots(volunteer, { ...volunteer }, ["name", "comments"])).toEqual({});
  });
});

describe("buildLogEntry", () => {
  const base = {
    action: "signup" as const,
    at: "SERVER_TIME",
    actor,
    subject: { uid: "vol-1", email: "Ada@Example.EDU" },
    volunteer,
    eventId: "evt1",
    shiftDate: "2026-09-05",
    event,
  };

  test("records who, what, when and where", () => {
    expect(buildLogEntry(base)).toEqual({
      action: "signup",
      at: "SERVER_TIME",
      actorUid: "lead-1",
      actorEmail: "lead@uw.edu",
      actorRole: "lead",
      subjectUid: "vol-1",
      subjectEmail: "ada@example.edu",
      volunteer,
      changes: null,
      eventId: "evt1",
      shiftDate: "2026-09-05",
      shiftYear: 2026,
      event,
    });
  });

  test("reduces an ISO timestamp to its UTC date, like slot keys do", () => {
    const e = buildLogEntry({ ...base, shiftDate: "2026-12-31T08:00:00.000Z" });
    expect(e.shiftDate).toBe("2026-12-31");
    expect(e.shiftYear).toBe(2026);
  });

  test("carries changes for updates", () => {
    const changes = { name: { from: "Ada", to: "Ada L." } };
    expect(buildLogEntry({ ...base, action: "update", changes }).changes).toEqual(changes);
  });

  test("allows an entry with no volunteer snapshot (event archive)", () => {
    const e = buildLogEntry({
      ...base,
      action: "event_archived",
      subject: { uid: "", email: "" },
      volunteer: null,
    });
    expect(e.volunteer).toBeNull();
    expect(e.subjectEmail).toBe("");
  });
});

test("the browser can write every action except backfill", () => {
  expect(CLIENT_LOG_ACTIONS).toEqual([
    "signup",
    "update",
    "withdraw",
    "remove",
    "event_archived",
  ]);
  expect(CLIENT_LOG_ACTIONS).not.toContain("backfill" as any);
});
