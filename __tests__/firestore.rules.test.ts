import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  runTransaction,
  writeBatch,
} from "firebase/firestore";
import { readFileSync } from "fs";
import { resolve } from "path";

let testEnv: RulesTestEnvironment;

// demo-test is just a mock project (tests should be project agnostic anyways)
beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "demo-test",
    firestore: {
      rules: readFileSync(resolve(__dirname, "../firestore.rules"), "utf8"),
      host: "localhost",
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

afterEach(async () => {
  await testEnv.clearFirestore();
});

const VOL_UID = "vol-uid";
const OTHER_UID = "other-uid";
const DATE = "2026-09-01";

// The six states a caller can be in. `noClaims` is the first-sign-in window:
// a real account whose token has not yet picked up anything from
// /api/reconcile-role. `unauthorized` is a non-UW address, or someone an admin
// has removed.
const admin = () =>
  testEnv.authenticatedContext("admin-uid", { role: "admin", authorized: true }).firestore();
const lead = () =>
  testEnv.authenticatedContext("lead-uid", { role: "lead", authorized: true }).firestore();
const volunteer = () =>
  testEnv.authenticatedContext(VOL_UID, { role: null, authorized: true }).firestore();
const unauthorized = () =>
  testEnv.authenticatedContext("nonuw-uid", { role: null, authorized: false }).firestore();
const noClaims = () => testEnv.authenticatedContext("brand-new-uid").firestore();
const anon = () => testEnv.unauthenticatedContext().firestore();

const EVENT = "evt1";
const SLOT = `${DATE}__Student`;
const slotPath = `events/${EVENT}/slots/${SLOT}`;
const volPath = (uid: string) => `events/${EVENT}/volunteers/${uid}_${DATE}`;

async function seed(remaining = 5, capacity = 5) {
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, `events/${EVENT}`), { name: "Clinic", projectId: "p1" });
    await setDoc(doc(db, slotPath), {
      date: DATE,
      role: "Student",
      capacity,
      remaining,
    });
  });
}

async function seedVolunteer(uid: string) {
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), volPath(uid)), {
      uid,
      name: "Someone",
      email: "s@uw.edu",
      role: "Student",
      date: DATE,
    });
  });
}

// The authorized axis -- the whole point of the rewrite.

describe("authorized gate", () => {
  beforeEach(() => seed());

  it("lets an authorized volunteer read slots", async () => {
    await assertSucceeds(getDoc(doc(volunteer(), slotPath)));
  });

  it("denies slot reads to a signed-in but unauthorized user", async () => {
    await assertFails(getDoc(doc(unauthorized(), slotPath)));
  });

  it("denies slot reads during the first-sign-in window (no claims yet)", async () => {
    await assertFails(getDoc(doc(noClaims(), slotPath)));
  });

  it("denies volunteer-record reads to an unauthorized user", async () => {
    await seedVolunteer(OTHER_UID);
    await assertFails(getDoc(doc(unauthorized(), volPath(OTHER_UID))));
  });

  it("denies volunteer-record reads to anonymous visitors", async () => {
    await seedVolunteer(OTHER_UID);
    await assertFails(getDoc(doc(anon(), volPath(OTHER_UID))));
  });

  it("keeps the event document publicly readable", async () => {
    await assertSucceeds(getDoc(doc(anon(), `events/${EVENT}`)));
  });
});

// Slot arithmetic -- the only place in the rules doing real work.

describe("slot counter", () => {
  it("allows a signup decrement of one", async () => {
    await seed(5);
    await assertSucceeds(updateDoc(doc(volunteer(), slotPath), { remaining: 4 }));
  });

  it("allows a withdrawal increment of one", async () => {
    await seed(4);
    await assertSucceeds(updateDoc(doc(volunteer(), slotPath), { remaining: 5 }));
  });

  it("denies a jump of more than one", async () => {
    await seed(5);
    await assertFails(updateDoc(doc(volunteer(), slotPath), { remaining: 3 }));
  });

  it("denies dropping below zero", async () => {
    await seed(0);
    await assertFails(updateDoc(doc(volunteer(), slotPath), { remaining: -1 }));
  });

  it("denies rising above capacity", async () => {
    await seed(5, 5);
    await assertFails(updateDoc(doc(volunteer(), slotPath), { remaining: 6 }));
  });

  it("denies a volunteer editing capacity", async () => {
    await seed(5, 5);
    await assertFails(updateDoc(doc(volunteer(), slotPath), { capacity: 99 }));
  });

  it("denies a volunteer widening capacity alongside a legal decrement", async () => {
    await seed(5, 5);
    await assertFails(
      updateDoc(doc(volunteer(), slotPath), { capacity: 99, remaining: 4 }),
    );
  });

  it("denies a non-integer count", async () => {
    await seed(5);
    await assertFails(updateDoc(doc(volunteer(), slotPath), { remaining: 4.5 }));
  });

  it("denies an unauthorized user decrementing", async () => {
    await seed(5);
    await assertFails(updateDoc(doc(unauthorized(), slotPath), { remaining: 4 }));
  });

  it("lets staff set capacity and count freely (the syncSlots path)", async () => {
    await seed(5, 5);
    await assertSucceeds(
      updateDoc(doc(lead(), slotPath), { capacity: 10, remaining: 10 }),
    );
  });

  it("denies a volunteer creating or deleting a slot", async () => {
    await seed();
    await assertFails(
      setDoc(doc(volunteer(), `events/${EVENT}/slots/${DATE}__Invented`), {
        date: DATE,
        role: "Invented",
        capacity: 99,
        remaining: 99,
      }),
    );
    await assertFails(deleteDoc(doc(volunteer(), slotPath)));
  });

  // Known and accepted: rules are evaluated per document, so nothing binds the
  // counter to the roster. An authorized user can move the count on its own.
  // Asserted here so the gap stays visible rather than being mistaken for
  // coverage we have.
  it("KNOWN GAP: a bare decrement with no signup is allowed", async () => {
    await seed(5);
    await assertSucceeds(updateDoc(doc(volunteer(), slotPath), { remaining: 4 }));
  });
});

// Volunteer records -- ownership.

describe("volunteer records", () => {
  beforeEach(() => seed());

  it("lets a volunteer create their own record", async () => {
    await assertSucceeds(
      setDoc(doc(volunteer(), volPath(VOL_UID)), {
        uid: VOL_UID,
        name: "Me",
        email: "me@uw.edu",
        role: "Student",
        date: DATE,
      }),
    );
  });

  it("denies a record whose payload uid disagrees with the document id", async () => {
    await assertFails(
      setDoc(doc(volunteer(), volPath(VOL_UID)), {
        uid: OTHER_UID,
        name: "Me",
        email: "me@uw.edu",
        role: "Student",
        date: DATE,
      }),
    );
  });

  it("denies writing someone else's record", async () => {
    await assertFails(
      setDoc(doc(volunteer(), volPath(OTHER_UID)), {
        uid: OTHER_UID,
        name: "Not me",
        email: "x@uw.edu",
        role: "Student",
        date: DATE,
      }),
    );
  });

  it("lets a volunteer delete their own record but not another's", async () => {
    await seedVolunteer(VOL_UID);
    await seedVolunteer(OTHER_UID);
    await assertFails(deleteDoc(doc(volunteer(), volPath(OTHER_UID))));
    await assertSucceeds(deleteDoc(doc(volunteer(), volPath(VOL_UID))));
  });

  it("denies an unauthorized user creating a record even under their own id", async () => {
    await assertFails(
      setDoc(doc(unauthorized(), `events/${EVENT}/volunteers/nonuw-uid_${DATE}`), {
        uid: "nonuw-uid",
        name: "No",
        email: "x@gmail.com",
        role: "Student",
        date: DATE,
      }),
    );
  });

  it("lets staff write any record", async () => {
    await assertSucceeds(
      setDoc(doc(admin(), volPath(OTHER_UID)), {
        uid: OTHER_UID,
        name: "Anyone",
        email: "a@uw.edu",
        role: "Student",
        date: DATE,
      }),
    );
  });
});

// The event document no longer carries a volunteer-writable field.

describe("event document", () => {
  beforeEach(() => seed());

  it("denies a volunteer updating the event", async () => {
    await assertFails(updateDoc(doc(volunteer(), `events/${EVENT}`), { name: "hacked" }));
  });

  it("denies a volunteer writing the retired openings field", async () => {
    await assertFails(updateDoc(doc(volunteer(), `events/${EVENT}`), { openings: 4 }));
  });

  it("lets staff create, update and delete", async () => {
    await assertSucceeds(updateDoc(doc(lead(), `events/${EVENT}`), { name: "new" }));
    await assertSucceeds(deleteDoc(doc(admin(), `events/${EVENT}`)));
  });
});

// The real multi-document shapes from signup.tsx and EventAdmin.tsx. Per-document
// tests can all pass while these fail.

describe("real client transactions", () => {
  it("permits the signup transaction (slot decrement + record create)", async () => {
    await seed(5);
    const db = volunteer();
    await assertSucceeds(
      runTransaction(db, async (tx) => {
        const slot = await tx.get(doc(db, slotPath));
        tx.update(doc(db, slotPath), { remaining: slot.data()!.remaining - 1 });
        tx.set(doc(db, volPath(VOL_UID)), {
          uid: VOL_UID,
          name: "Me",
          email: "me@uw.edu",
          role: "Student",
          date: DATE,
        });
      }),
    );
  });

  it("permits the withdrawal transaction (slot increment + record delete)", async () => {
    await seed(4);
    await seedVolunteer(VOL_UID);
    const db = volunteer();
    await assertSucceeds(
      runTransaction(db, async (tx) => {
        const slot = await tx.get(doc(db, slotPath));
        tx.update(doc(db, slotPath), { remaining: slot.data()!.remaining + 1 });
        tx.delete(doc(db, volPath(VOL_UID)));
      }),
    );
  });

  it("permits the admin event teardown batch (event + slots + volunteers)", async () => {
    await seed();
    await seedVolunteer(OTHER_UID);
    const db = admin();
    const batch = writeBatch(db);
    batch.delete(doc(db, slotPath));
    batch.delete(doc(db, volPath(OTHER_UID)));
    batch.delete(doc(db, `events/${EVENT}`));
    await assertSucceeds(batch.commit());
  });
});

// Role directories -- these hold the pre-assigned email lists.

describe("role directories", () => {
  for (const col of ["Admins", "Leads", "Volunteers"]) {
    it(`${col}: admin only`, async () => {
      await assertSucceeds(setDoc(doc(admin(), `${col}/d1`), { email: "a@uw.edu" }));
      await assertFails(getDoc(doc(lead(), `${col}/d1`)));
      await assertFails(getDoc(doc(volunteer(), `${col}/d1`)));
      await assertFails(getDoc(doc(anon(), `${col}/d1`)));
    });
  }

  it("program listings are public to read and admin-only to write", async () => {
    await assertSucceeds(getDoc(doc(anon(), "Seattle/p1")));
    await assertSucceeds(setDoc(doc(admin(), "Seattle/p1"), { Title: "t" }));
    await assertFails(setDoc(doc(lead(), "Seattle/p1"), { Title: "t" }));
  });
});
