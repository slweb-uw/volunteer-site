import { firebaseAdmin } from "../firebaseAdmin";

const db = firebaseAdmin.firestore();
const adminAuth = firebaseAdmin.auth();
const roleMap: Record<string, string> = {
  Admins: "admin",
  Leads: "lead",
  Volunteers: "volunteer",
};

async function main() {
  for (const [col, role] of Object.entries(roleMap)) {
    const snapshot = await db.collection(col).get();
    for (const doc of snapshot.docs) {
      const { email } = doc.data();
      try {
        const user = await adminAuth.getUserByEmail(email);
        await adminAuth.setCustomUserClaims(user.uid, { role });
        console.log(`Set ${role} claim for ${email}`);
      } catch {
        console.warn(`No auth account for ${email}, skipping`);
      }
    }
  }
}

main();
