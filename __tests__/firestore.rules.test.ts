import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { readFileSync } from "fs";
import { resolve } from "path";

let testEnv: RulesTestEnvironment;

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

// helpers
const adminCtx = () =>
  testEnv.authenticatedContext("admin-uid", { role: "admin" });
const leadCtx = () =>
  testEnv.authenticatedContext("lead-uid", { role: "lead" });
const userCtx = () => testEnv.authenticatedContext("user-uid", { role: null });
const unauthCtx = () => testEnv.unauthenticatedContext();

// Program collections (Alaska, Idaho, Montana, Seattle, Spokane, Wyoming)

describe("program collections", () => {
  const collections = [
    "Alaska",
    "Idaho",
    "Montana",
    "Seattle",
    "Spokane",
    "Wyoming",
  ];

  for (const col of collections) {
    describe(col, () => {
      it("allows anyone to read", async () => {
        await assertSucceeds(
          getDoc(doc(unauthCtx().firestore(), `${col}/doc1`)),
        );
      });

      it("allows admin to write", async () => {
        await assertSucceeds(
          setDoc(doc(adminCtx().firestore(), `${col}/doc1`), { name: "test" }),
        );
      });

      it("denies lead from writing", async () => {
        await assertFails(
          setDoc(doc(leadCtx().firestore(), `${col}/doc1`), { name: "test" }),
        );
      });

      it("denies signed-in non-admin from writing", async () => {
        await assertFails(
          setDoc(doc(userCtx().firestore(), `${col}/doc1`), { name: "test" }),
        );
      });

      it("denies unauthenticated from writing", async () => {
        await assertFails(
          setDoc(doc(unauthCtx().firestore(), `${col}/doc1`), { name: "test" }),
        );
      });
    });
  }
});

// Events

describe("events", () => {
  it("allows anyone to read", async () => {
    await assertSucceeds(getDoc(doc(unauthCtx().firestore(), "events/evt1")));
  });

  it("allows admin to create", async () => {
    await assertSucceeds(
      setDoc(doc(adminCtx().firestore(), "events/evt1"), { openings: 5 }),
    );
  });

  it("allows lead to create", async () => {
    await assertSucceeds(
      setDoc(doc(leadCtx().firestore(), "events/evt1"), { openings: 5 }),
    );
  });

  it("denies signed-in user from creating", async () => {
    await assertFails(
      setDoc(doc(userCtx().firestore(), "events/evt1"), { openings: 5 }),
    );
  });

  it("allows admin to delete", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "events/evt1"), { openings: 5 });
    });
    await assertSucceeds(deleteDoc(doc(adminCtx().firestore(), "events/evt1")));
  });

  it("allows lead to delete", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "events/evt1"), { openings: 5 });
    });
    await assertSucceeds(deleteDoc(doc(leadCtx().firestore(), "events/evt1")));
  });

  it("denies user from deleting", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "events/evt1"), { openings: 5 });
    });
    await assertFails(deleteDoc(doc(userCtx().firestore(), "events/evt1")));
  });

  it("denies unauthenticated from deleting", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "events/evt1"), { openings: 5 });
    });
    await assertFails(deleteDoc(doc(unauthCtx().firestore(), "events/evt1")));
  });

  it("allows signed-in user to decrement openings only", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "events/evt1"), { openings: 5 });
    });
    await assertSucceeds(
      updateDoc(doc(userCtx().firestore(), "events/evt1"), { openings: 4 }),
    );
  });

  it("denies signed-in user from setting openings below 0", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "events/evt1"), { openings: 0 });
    });
    await assertFails(
      updateDoc(doc(userCtx().firestore(), "events/evt1"), { openings: -1 }),
    );
  });

  it("denies signed-in user from updating fields other than openings", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "events/evt1"), {
        openings: 5,
        title: "old",
      });
    });
    await assertFails(
      updateDoc(doc(userCtx().firestore(), "events/evt1"), { title: "hacked" }),
    );
  });

  it("allows lead to update any field", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "events/evt1"), { openings: 5, title: "old" });
    });
    await assertSucceeds(
      updateDoc(doc(leadCtx().firestore(), "events/evt1"), { title: "updated" }),
    );
  });

  it("denies unauthenticated from updating", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "events/evt1"), { openings: 5 });
    });
    await assertFails(
      updateDoc(doc(unauthCtx().firestore(), "events/evt1"), { openings: 4 }),
    );
  });
});

// Events / volunteers subcollection

describe("events/volunteers subcollection", () => {
  it("denies unauthenticated read", async () => {
    await assertFails(
      getDoc(doc(unauthCtx().firestore(), "events/evt1/volunteers/vol1")),
    );
  });

  it("allows signed-in user to read", async () => {
    await assertSucceeds(
      getDoc(doc(userCtx().firestore(), "events/evt1/volunteers/vol1")),
    );
  });

  it("allows user to write their own volunteer doc (uid_suffix format)", async () => {
    await assertSucceeds(
      setDoc(
        doc(userCtx().firestore(), "events/evt1/volunteers/user-uid_slot1"),
        { name: "me" },
      ),
    );
  });

  it("denies user from writing another user's volunteer doc", async () => {
    await assertFails(
      setDoc(
        doc(userCtx().firestore(), "events/evt1/volunteers/other-uid_slot1"),
        { name: "not me" },
      ),
    );
  });

  it("allows admin to write any volunteer doc", async () => {
    await assertSucceeds(
      setDoc(
        doc(adminCtx().firestore(), "events/evt1/volunteers/anyone_slot1"),
        { name: "anyone" },
      ),
    );
  });

  it("allows lead to write any volunteer doc", async () => {
    await assertSucceeds(
      setDoc(
        doc(leadCtx().firestore(), "events/evt1/volunteers/anyone_slot1"),
        { name: "anyone" },
      ),
    );
  });
});

// role collections (Admin, Leads, Volunteers)

describe("role collections", () => {
  const roleCols = ["Admins", "Leads", "Volunteers"];

  for (const col of roleCols) {
    describe(col, () => {
      it("allows admin to read", async () => {
        await assertSucceeds(
          getDoc(doc(adminCtx().firestore(), `${col}/doc1`)),
        );
      });

      it("allows admin to write", async () => {
        await assertSucceeds(
          setDoc(doc(adminCtx().firestore(), `${col}/doc1`), {
            email: "a@b.com",
          }),
        );
      });

      it("denies lead from reading", async () => {
        await assertFails(getDoc(doc(leadCtx().firestore(), `${col}/doc1`)));
      });

      it("denies lead from writing", async () => {
        await assertFails(
          setDoc(doc(leadCtx().firestore(), `${col}/doc1`), { email: "a@b.com" }),
        );
      });

      it("denies signed-in user from reading", async () => {
        await assertFails(getDoc(doc(userCtx().firestore(), `${col}/doc1`)));
      });

      it("denies unauthenticated from reading", async () => {
        await assertFails(getDoc(doc(unauthCtx().firestore(), `${col}/doc1`)));
      });
    });
  }
});

// cache
describe("cache", () => {
  it("allows anyone to read", async () => {
    await assertSucceeds(getDoc(doc(unauthCtx().firestore(), "cache/doc1")));
  });

  it("denies anyone from writing", async () => {
    await assertFails(
      setDoc(doc(adminCtx().firestore(), "cache/doc1"), { data: "x" }),
    );
  });
});
