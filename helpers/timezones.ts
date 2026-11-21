import { IANAZone } from "luxon";
import { Location } from "helpers/locations";

/**
 * Event times are stored as bare wall-clock strings ("09:00"), so the zone that
 * gives them meaning comes from the event's location. An event can override it
 * with its own optional `timeZone` field (an IANA name such as "America/Boise").
 *
 * Converting to the *viewer's* zone and choosing a zone when creating an event
 * are tracked separately in #149.
 */
export const LOCATION_TZ: Record<Location, string> = {
  [Location.SEATTLE]: "America/Los_Angeles",
  [Location.SPOKANE]: "America/Los_Angeles",
  [Location.MONTANA]: "America/Denver",
  [Location.WYOMING]: "America/Denver",
  [Location.ALASKA]: "America/Anchorage",
  // TODO: confirm. Most of Idaho is on Mountain time, but North Idaho is on
  // Pacific. Events there can set their own `timeZone`.
  [Location.IDAHO]: "America/Boise",
};

export const DEFAULT_TZ = "America/Los_Angeles";

export function eventTimeZone(
  event: { timeZone?: string } | undefined,
  location: string,
): string {
  const own = event?.timeZone;
  if (own && IANAZone.isValidZone(own)) return own;
  return LOCATION_TZ[location as Location] ?? DEFAULT_TZ;
}

/** "Pacific Time", "Mountain Time", ... Falls back to the IANA name. */
export function timeZoneLabel(timeZone: string, at: Date = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "longGeneric",
    }).formatToParts(at);
    return parts.find((p) => p.type === "timeZoneName")?.value ?? timeZone;
  } catch {
    return timeZone;
  }
}
