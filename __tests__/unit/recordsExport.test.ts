import {
  toCsv,
  toFullRows,
  toPublicRows,
  type StoredLogEntry,
} from "helpers/recordsExport";

const at = (iso: string) => ({ toDate: () => new Date(iso) });

const entry = (over: Partial<StoredLogEntry> = {}): StoredLogEntry => ({
  id: "log1",
  action: "signup",
  at: at("2026-08-01T17:00:00Z"),
  actorUid: "lead-1",
  actorEmail: "lead@uw.edu",
  actorRole: "lead",
  subjectUid: "vol-1",
  subjectEmail: "ada@example.edu",
  volunteer: {
    name: "Ada Lovelace",
    phoneNumber: "2065550100",
    studentDiscipline: "Nursing",
    comments: "Allergic to latex",
    role: "Student",
  },
  changes: null,
  eventId: "evt1",
  shiftDate: "2026-09-05",
  shiftYear: 2026,
  event: {
    name: "Clinic",
    projectId: "p1",
    projectName: "Mobile Clinic",
    location: "Seattle",
    address: "1 Main St",
    startTime: "09:00",
    endTime: "12:00",
  },
  ...over,
});

describe("toFullRows", () => {
  test("includes contact details, comments, who did it and the event id", () => {
    const [row] = toFullRows([entry()]);
    expect(row.Email).toBe("ada@example.edu");
    expect(row.Phone).toBe("2065550100");
    expect(row.Discipline).toBe("Nursing");
    expect(row.Comments).toBe("Allergic to latex");
    expect(row["Done by"]).toBe("lead@uw.edu");
    expect(row["Event ID"]).toBe("evt1");
    expect(row["Logged at (UTC)"]).toBe("2026-08-01T17:00:00.000Z");
  });

  test("spells out what an edit changed", () => {
    const [row] = toFullRows([
      entry({ action: "update", changes: { name: { from: "Ada", to: "Ada Lovelace" } } }),
    ]);
    expect(row.Changes).toBe('name: "Ada" -> "Ada Lovelace"');
  });

  test("sorts by shift date, then by when it was logged", () => {
    const rows = toFullRows([
      entry({ shiftDate: "2026-10-01", at: at("2026-08-01T10:00:00Z") }),
      entry({ shiftDate: "2026-09-05", at: at("2026-08-03T10:00:00Z") }),
      entry({ shiftDate: "2026-09-05", at: at("2026-08-02T10:00:00Z") }),
    ]);
    expect(rows.map((r) => r["Logged at (UTC)"].slice(0, 10))).toEqual([
      "2026-08-02",
      "2026-08-03",
      "2026-08-01",
    ]);
  });

  test("copes with an entry whose server timestamp has not resolved", () => {
    expect(toFullRows([entry({ at: null })])[0]["Logged at (UTC)"]).toBe("");
  });
});

describe("toPublicRows", () => {
  const rows = toPublicRows([entry()]);
  const text = JSON.stringify(rows) + toCsv(rows);

  test("keeps who, what, when and where", () => {
    expect(rows[0]).toMatchObject({
      Name: "Ada Lovelace",
      Role: "Student",
      Event: "Clinic",
      Project: "Mobile Clinic",
      Location: "Seattle",
      "Shift date": "2026-09-05",
      "Start time": "09:00",
      Action: "signup",
    });
  });

  test("leaves out the volunteer's email, phone, discipline and comments", () => {
    for (const secret of [
      "ada@example.edu",
      "2065550100",
      "Nursing",
      "Allergic to latex",
    ]) {
      expect(text).not.toContain(secret);
    }
    expect(Object.keys(rows[0])).not.toEqual(
      expect.arrayContaining(["Email", "Phone", "Discipline", "Comments"]),
    );
  });

  test("leaves out staff email addresses and internal ids", () => {
    expect(text).not.toContain("lead@uw.edu");
    expect(text).not.toContain("lead-1");
    expect(text).not.toContain("vol-1");
    expect(text).not.toContain("evt1");
  });

  test("leaves out the address and any edit details", () => {
    expect(text).not.toContain("1 Main St");
    const edited = toPublicRows([
      entry({ action: "update", changes: { comments: { from: "", to: "secret note" } } }),
    ]);
    expect(JSON.stringify(edited)).not.toContain("secret note");
  });
});

describe("toCsv", () => {
  test("escapes spreadsheet formulas", () => {
    const csv = toCsv(
      toFullRows([
        entry({ volunteer: { ...entry().volunteer!, name: "=HYPERLINK(\"http://evil\")" } }),
      ]),
    );
    expect(csv).not.toMatch(/(^|,)"?=HYPERLINK/m);
    expect(csv).toContain("'=HYPERLINK");
  });
});
