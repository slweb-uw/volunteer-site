import { dateKeyOf, slotId, slotsPath } from "helpers/slots";

describe("slotsPath", () => {
  it("points at the event's slots subcollection", () => {
    expect(slotsPath("abc123")).toBe("events/abc123/slots");
  });
});

describe("slotId", () => {
  it("joins date and role with a double underscore", () => {
    expect(slotId("2026-11-18", "Nursing")).toBe("2026-11-18__Nursing");
  });

  it("URI-encodes the role so document IDs never contain a slash", () => {
    expect(slotId("2026-11-18", "PT/OT/P&O")).toBe("2026-11-18__PT%2FOT%2FP%26O");
    expect(slotId("2026-11-18", "School of Medicine")).toBe(
      "2026-11-18__School%20of%20Medicine",
    );
  });

  it("keeps single underscores in role names, so the separator stays unambiguous", () => {
    const id = slotId("2026-11-18", "team_a");
    expect(id).toBe("2026-11-18__team_a");
    expect(id.split("__")).toEqual(["2026-11-18", "team_a"]);
  });
});

describe("dateKeyOf", () => {
  it("formats a Date as YYYY-MM-DD", () => {
    expect(dateKeyOf(new Date("2026-11-18T12:00:00Z"))).toBe("2026-11-18");
  });

  it("accepts an ISO string", () => {
    expect(dateKeyOf("2026-11-18T12:00:00.000Z")).toBe("2026-11-18");
  });

  it("uses the UTC calendar date", () => {
    // Late evening Pacific time is already the next day in UTC. Callers that
    // pass a local-midnight Date from a timezone east of UTC get the previous
    // day. That behavior is tracked separately (time zone work, #149); this
    // test records it so a change is deliberate.
    expect(dateKeyOf("2026-11-18T23:30:00-08:00")).toBe("2026-11-19");
  });
});
