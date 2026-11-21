#!/usr/bin/env node
// Backfill the volunteer log (#225) from signups that already exist.
//
// Signups made before the log existed have no entry, so we could not show who
// volunteered at what. This writes one "backfill" entry per existing signup.
// It is safe to run more than once: entries have fixed ids, and ones that
// already exist are skipped.
//
//   node scripts/backfill-volunteer-log.js            dry run: counts only
//   node scripts/backfill-volunteer-log.js --commit   write the entries
//
// Credentials, same as the app: FB_PROJECT_ID, FB_CLIENT_EMAIL, FB_PRIVATE_KEY.
// To try it against the local emulator, set FIRESTORE_EMULATOR_HOST (and
// optionally FB_PROJECT_ID, default "demo-test"); no credentials are needed.
//
// Backfilled entries say "backfill" and were not written at signup time: their
// `at` is when this script ran, and the actor is the script, not the person who
// signed up. The shift date and volunteer details are the signup's own.

const LOG_COLLECTION = "volunteerLog";
const BATCH_SIZE = 400; // Firestore allows 500 writes per batch

const str = (v) => (v === undefined || v === null ? "" : String(v));

/** "YYYY-MM-DD" from an ISO string, a Timestamp, a Date, or the doc id. */
function shiftDateOf(volunteer, volunteerDocId) {
  const raw = volunteer.date;
  const date =
    typeof raw === "string"
      ? new Date(raw)
      : raw && typeof raw.toDate === "function"
        ? raw.toDate()
        : raw instanceof Date
          ? raw
          : null;
  if (date && Number.isFinite(date.getTime())) {
    return date.toISOString().split("T")[0];
  }
  // Volunteer docs are named `${uid}_${YYYY-MM-DD}`.
  const fromId = /_(\d{4}-\d{2}-\d{2})$/.exec(volunteerDocId);
  return fromId ? fromId[1] : null;
}

/**
 * One log entry for one existing signup, or null if it has no usable date.
 * Must keep the same shape as buildLogEntry in helpers/volunteerLog.ts; a unit
 * test checks that.
 */
function backfillEntry({ eventId, event, volunteerDocId, volunteer, at }) {
  const shiftDate = shiftDateOf(volunteer, volunteerDocId);
  if (!shiftDate) return null;
  return {
    action: "backfill",
    at,
    actorUid: "system",
    actorEmail: "backfill-script",
    actorRole: "admin",
    subjectUid: str(volunteer.uid),
    subjectEmail: str(volunteer.email).trim().toLowerCase(),
    volunteer: {
      name: str(volunteer.name),
      phoneNumber: str(volunteer.phoneNumber),
      studentDiscipline: str(volunteer.studentDiscipline),
      comments: str(volunteer.comments),
      role: str(volunteer.role),
    },
    changes: null,
    eventId,
    shiftDate,
    shiftYear: Number(shiftDate.slice(0, 4)),
    event: {
      name: str(event.name),
      projectId: str(event.projectId),
      projectName: str(event.projectName),
      location: str(event.location),
      address: str(event.address),
      startTime: str(event.startTime),
      endTime: str(event.endTime),
    },
  };
}

const backfillId = (eventId, volunteerDocId) =>
  `backfill_${eventId}_${volunteerDocId}`;

function initAdmin() {
  const admin = require("firebase-admin");
  if (admin.apps.length) return admin;
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    admin.initializeApp({ projectId: process.env.FB_PROJECT_ID || "demo-test" });
  } else {
    const { FB_PROJECT_ID, FB_CLIENT_EMAIL, FB_PRIVATE_KEY } = process.env;
    if (!FB_PROJECT_ID || !FB_CLIENT_EMAIL || !FB_PRIVATE_KEY) {
      console.error(
        "Set FB_PROJECT_ID, FB_CLIENT_EMAIL and FB_PRIVATE_KEY (or FIRESTORE_EMULATOR_HOST).",
      );
      process.exit(2);
    }
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FB_PROJECT_ID,
        clientEmail: FB_CLIENT_EMAIL,
        privateKey: FB_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  }
  return admin;
}

async function main() {
  const commit = process.argv.includes("--commit");
  const admin = initAdmin();
  const db = admin.firestore();
  const target = process.env.FIRESTORE_EMULATOR_HOST
    ? `emulator ${process.env.FIRESTORE_EMULATOR_HOST}`
    : `project ${process.env.FB_PROJECT_ID}`;
  console.log(`${commit ? "COMMIT" : "Dry run"} against ${target}\n`);

  const entries = []; // { id, entry }
  let skippedNoDate = 0;
  const events = await db.collection("events").get();

  for (const eventDoc of events.docs) {
    const volunteers = await eventDoc.ref.collection("volunteers").get();
    for (const v of volunteers.docs) {
      const entry = backfillEntry({
        eventId: eventDoc.id,
        event: eventDoc.data(),
        volunteerDocId: v.id,
        volunteer: v.data(),
        at: admin.firestore.FieldValue.serverTimestamp(),
      });
      if (!entry) {
        skippedNoDate += 1;
        console.warn(`  skipped ${eventDoc.id}/${v.id}: no usable date`);
        continue;
      }
      entries.push({ id: backfillId(eventDoc.id, v.id), entry });
    }
  }

  // Skip entries a previous run already wrote.
  const refs = entries.map(({ id }) => db.collection(LOG_COLLECTION).doc(id));
  const existing = new Set();
  for (let i = 0; i < refs.length; i += BATCH_SIZE) {
    const snaps = await db.getAll(...refs.slice(i, i + BATCH_SIZE));
    snaps.forEach((s) => s.exists && existing.add(s.id));
  }
  const todo = entries.filter(({ id }) => !existing.has(id));

  console.log(`Events scanned:            ${events.size}`);
  console.log(`Signups found:             ${entries.length + skippedNoDate}`);
  console.log(`  already in the log:      ${existing.size}`);
  console.log(`  skipped (no usable date): ${skippedNoDate}`);
  console.log(`  to write:                ${todo.length}`);

  if (!commit) {
    console.log("\nDry run only. Re-run with --commit to write them.");
    return;
  }

  for (let i = 0; i < todo.length; i += BATCH_SIZE) {
    const batch = db.batch();
    for (const { id, entry } of todo.slice(i, i + BATCH_SIZE)) {
      batch.create(db.collection(LOG_COLLECTION).doc(id), entry);
    }
    await batch.commit();
  }
  console.log(`\nWrote ${todo.length} entries.`);
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { backfillEntry, backfillId, shiftDateOf };
