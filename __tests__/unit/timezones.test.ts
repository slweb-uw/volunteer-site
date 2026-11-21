import { eventTimeZone, timeZoneLabel, LOCATION_TZ } from "helpers/timezones";
import { Location } from "helpers/locations";

describe("eventTimeZone", () => {
  test("maps every location to a zone", () => {
    expect(eventTimeZone(undefined, "Seattle")).toBe("America/Los_Angeles");
    expect(eventTimeZone(undefined, "Spokane")).toBe("America/Los_Angeles");
    expect(eventTimeZone(undefined, "Montana")).toBe("America/Denver");
    expect(eventTimeZone(undefined, "Wyoming")).toBe("America/Denver");
    expect(eventTimeZone(undefined, "Alaska")).toBe("America/Anchorage");
    expect(eventTimeZone(undefined, "Idaho")).toBe("America/Boise");
    for (const loc of Object.values(Location)) {
      expect(LOCATION_TZ[loc]).toBeTruthy();
    }
  });

  test("an event's own timeZone wins", () => {
    expect(eventTimeZone({ timeZone: "America/Chicago" }, "Seattle")).toBe(
      "America/Chicago",
    );
  });

  test("an invalid event timeZone falls back to the location", () => {
    expect(eventTimeZone({ timeZone: "Mars/Olympus" }, "Montana")).toBe(
      "America/Denver",
    );
  });

  test("an unknown location falls back to Pacific", () => {
    expect(eventTimeZone({}, "Nowhere")).toBe("America/Los_Angeles");
  });
});

describe("timeZoneLabel", () => {
  test("uses a generic name that does not change with daylight saving", () => {
    expect(timeZoneLabel("America/Los_Angeles", new Date("2026-01-15T12:00:00Z"))).toBe(
      "Pacific Time",
    );
    expect(timeZoneLabel("America/Los_Angeles", new Date("2026-07-15T12:00:00Z"))).toBe(
      "Pacific Time",
    );
    expect(timeZoneLabel("America/Denver")).toBe("Mountain Time");
  });

  test("falls back to the zone name when it cannot be formatted", () => {
    expect(timeZoneLabel("Not/AZone")).toBe("Not/AZone");
  });
});
