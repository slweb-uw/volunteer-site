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

  // already has a role claim, nothing to reconcile
  if (decoded.role) {
    return res.status(200).json({ role: decoded.role });
  }

  if (!decoded.email) {
    return res.status(200).json({ role: null });
  }

  const db = firebaseAdmin.firestore();

  for (const [collectionName, role] of Object.entries(ROLE_COLLECTIONS)) {
    const snapshot = await db
      .collection(collectionName)
      .where("email", "==", decoded.email)
      .limit(1)
      .get();
    if (!snapshot.empty) {
      await firebaseAdmin.auth().setCustomUserClaims(decoded.uid, { role });
      return res.status(200).json({ role });
    }
  }

  return res.status(200).json({ role: null });
}
