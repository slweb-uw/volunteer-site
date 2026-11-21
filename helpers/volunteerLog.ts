/**
 * The volunteer log: an append-only record of who signed up for what, who
 * changed it, and when (issue #225). One entry is written for every signup,
 * edit, withdrawal, removal and event archive, in the same transaction as the
 * change itself. Entries are never updated or deleted (see firestore.rules).
 *
 * Each entry carries snapshots of the volunteer and event as they were at the
 * time, so it stays meaningful after the live data is edited or removed.
 */

export const LOG_COLLECTION = "volunteerLog";

/** Written from the browser. `backfill` is only ever written by the script. */
export type ClientLogAction =
  | "signup"
  | "update"
  | "withdraw"
  | "remove"
  | "event_archived";
export type LogAction = ClientLogAction | "backfill";

export const CLIENT_LOG_ACTIONS: ClientLogAction[] = [
  "signup",
  "update",
  "withdraw",
  "remove",
  "event_archived",
];

export type ActorRole = "admin" | "lead" | "volunteer";

export type LogActor = { uid: string; email: string; role: ActorRole };

export const actorRoleOf = (flags: {
  isAdmin?: boolean;
  isLead?: boolean;
}): ActorRole => (flags.isAdmin ? "admin" : flags.isLead ? "lead" : "volunteer");

export type VolunteerSnapshot = {
  name: string;
  phoneNumber: string;
  studentDiscipline: string;
  comments: string;
  role: string;
};

export type EventSnapshot = {
  name: string;
  projectId: string;
  projectName: string;
  location: string;
  address: string;
  startTime: string;
  endTime: string;
};

export type FieldChange = { from: string; to: string };

export type VolunteerLogEntry = {
  action: LogAction;
  /** serverTimestamp() from the client; a Firestore Timestamp when read back. */
  at: unknown;
  actorUid: string;
  actorEmail: string;
  actorRole: ActorRole;
  subjectUid: string;
  /** Lower-cased so lookups by email are exact. */
  subjectEmail: string;
  volunteer: VolunteerSnapshot | null;
  /** Only for `update`: the fields that changed. */
  changes: Record<string, FieldChange> | null;
  eventId: string;
  /** "YYYY-MM-DD", the same key slots and volunteer records use. */
  shiftDate: string;
  shiftYear: number;
  event: EventSnapshot;
};

const str = (v: unknown) => (v === undefined || v === null ? "" : String(v));

export function snapshotVolunteer(v: {
  name?: unknown;
  phoneNumber?: unknown;
  studentDiscipline?: unknown;
  comments?: unknown;
  role?: unknown;
}): VolunteerSnapshot {
  return {
    name: str(v.name),
    phoneNumber: str(v.phoneNumber),
    studentDiscipline: str(v.studentDiscipline),
    comments: str(v.comments),
    role: str(v.role),
  };
}

export function snapshotEvent(e: {
  name?: unknown;
  projectId?: unknown;
  projectName?: unknown;
  location?: unknown;
  address?: unknown;
  startTime?: unknown;
  endTime?: unknown;
}): EventSnapshot {
  return {
    name: str(e.name),
    projectId: str(e.projectId),
    projectName: str(e.projectName),
    location: str(e.location),
    address: str(e.address),
    startTime: str(e.startTime),
    endTime: str(e.endTime),
  };
}

/** The fields that differ between two snapshots, as `{ field: { from, to } }`. */
export function diffSnapshots(
  before: VolunteerSnapshot,
  after: VolunteerSnapshot,
  fields: (keyof VolunteerSnapshot)[],
): Record<string, FieldChange> {
  const out: Record<string, FieldChange> = {};
  for (const f of fields) {
    if (before[f] !== after[f]) out[f] = { from: before[f], to: after[f] };
  }
  return out;
}

export function buildLogEntry(input: {
  action: LogAction;
  at: unknown;
  actor: LogActor;
  subject: { uid: string; email: string };
  volunteer: VolunteerSnapshot | null;
  changes?: Record<string, FieldChange> | null;
  eventId: string;
  /** A "YYYY-MM-DD" key, or any date string/Date (reduced to its UTC date). */
  shiftDate: string | Date;
  event: EventSnapshot;
}): VolunteerLogEntry {
  const shiftDate =
    typeof input.shiftDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input.shiftDate)
      ? input.shiftDate
      : new Date(input.shiftDate).toISOString().split("T")[0];

  return {
    action: input.action,
    at: input.at,
    actorUid: input.actor.uid,
    actorEmail: input.actor.email.trim().toLowerCase(),
    actorRole: input.actor.role,
    subjectUid: input.subject.uid,
    subjectEmail: input.subject.email.trim().toLowerCase(),
    volunteer: input.volunteer,
    changes: input.changes ?? null,
    eventId: input.eventId,
    shiftDate,
    shiftYear: Number(shiftDate.slice(0, 4)),
    event: input.event,
  };
}
