import type { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../firebaseAdmin";

// Collections an admin can pre-assign a role to by email, before that
// person has an account. Checked in priority order.
const ROLE_COLLECTIONS: Record<string, string> = {
  Admins: "admin",
  Leads: "lead",
  Volunteers: "volunteer",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method != "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  let decoded;
  try {
    decoded = await firebaseAdmin.auth().verifyIdToken(token);
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }


  if (!decoded.email) {
    return res.status(200).json({ role: null });
  }

  const db = firebaseAdmin.firestore();

  let authorized: boolean = false;
  for (const [collectionName, role] of Object.entries(ROLE_COLLECTIONS)) {
    const snapshot = await db
      .collection(collectionName)
      .where("email", "==", decoded.email)
      .limit(1)
      .get();
    if (!snapshot.empty) {
      authorized = true;
      await firebaseAdmin.auth().setCustomUserClaims(decoded.uid, { role, authorized });
      return res.status(200).json({ role });
    }
  }
  if (decoded.email && decoded.email.toLowerCase().endsWith("@uw.edu")) {
    authorized = true;
    await firebaseAdmin.auth().setCustomUserClaims(decoded.uid, {role: null, authorized})
  } else {
    await firebaseAdmin.auth().setCustomUserClaims(decoded.uid, {role: null, authorized})
  }

  return res.status(200).json({ role: null, authorized });
}
