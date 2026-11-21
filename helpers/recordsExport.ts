import Papa from "papaparse";
import type { VolunteerLogEntry } from "helpers/volunteerLog";

/**
 * CSV exports of volunteer log entries for records requests.
 *
 * - Full: everything we hold, for internal use and for legal or audit requests.
 * - Public release: leaves out the volunteer's email, phone number, discipline
 *   and comments (personal contact details that are exempt from disclosure
 *   under RCW 42.56.250) and the staff's email addresses. It keeps who (name),
 *   what (role, event, project), when (shift date, time, entry time) and where.
 *
 * Whether a particular request may be answered with the public release export
 * is a decision for UW's Office of Public Records, not this code.
 */

/** A log entry as read back from Firestore (`at` is a Timestamp). */
export type StoredLogEntry = Omit<VolunteerLogEntry, "at"> & {
  id?: string;
  at?: { toDate?: () => Date } | null;
};

const atIso = (e: StoredLogEntry) => {
  const d = e.at?.toDate?.();
  return d && Number.isFinite(d.getTime()) ? d.toISOString() : "";
};

const changesText = (e: StoredLogEntry) =>
  Object.entries(e.changes ?? {})
    .map(([field, c]) => `${field}: "${c.from}" -> "${c.to}"`)
    .join("; ");

const byShiftThenTime = (a: StoredLogEntry, b: StoredLogEntry) =>
  a.shiftDate.localeCompare(b.shiftDate) ||
  atIso(a).localeCompare(atIso(b));

export function toFullRows(entries: StoredLogEntry[]) {
  return [...entries].sort(byShiftThenTime).map((e) => ({
    "Logged at (UTC)": atIso(e),
    Action: e.action,
    "Shift date": e.shiftDate,
    Location: e.event.location,
    Project: e.event.projectName,
    Event: e.event.name,
    "Start time": e.event.startTime,
    "End time": e.event.endTime,
    Address: e.event.address,
    Role: e.volunteer?.role ?? "",
    Name: e.volunteer?.name ?? "",
    Email: e.subjectEmail,
    Phone: e.volunteer?.phoneNumber ?? "",
    Discipline: e.volunteer?.studentDiscipline ?? "",
    Comments: e.volunteer?.comments ?? "",
    Changes: changesText(e),
    "Done by": e.actorEmail,
    "Done by (role)": e.actorRole,
    "Event ID": e.eventId,
  }));
}

export function toPublicRows(entries: StoredLogEntry[]) {
  return [...entries].sort(byShiftThenTime).map((e) => ({
    "Logged at (UTC)": atIso(e),
    Action: e.action,
    "Shift date": e.shiftDate,
    Location: e.event.location,
    Project: e.event.projectName,
    Event: e.event.name,
    "Start time": e.event.startTime,
    "End time": e.event.endTime,
    Role: e.volunteer?.role ?? "",
    Name: e.volunteer?.name ?? "",
  }));
}

/** Papa.unparse with spreadsheet formula escaping on. */
export const toCsv = (rows: Record<string, unknown>[]) =>
  Papa.unparse(rows, { escapeFormulae: true });
