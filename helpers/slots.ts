/**
 * Slot documents live at events/{eventId}/slots/{slotId} and hold the signup
 * counter for a single date-and-role pair.
 *
 * The role is URI-encoded because document IDs cannot contain "/" and role
 * names are free text. The separator is a double underscore because dates
 * already contain hyphens and role names may contain single underscores.
 */

export const slotsPath = (eventId: string) => `events/${eventId}/slots`;

export const slotId = (date: string, role: string) =>
  `${date}__${encodeURIComponent(role)}`;

/** "YYYY-MM-DD", the key format shared by slot IDs and volunteer records. */
export const dateKeyOf = (value: string | Date) =>
  (value instanceof Date ? value : new Date(value)).toISOString().split("T")[0];
