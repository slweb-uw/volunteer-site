import type { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../firebaseAdmin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method != "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  // only admins allowed to set roles
  const token = req.headers.authorization?.split("Bearer ")[1];
  // no token = not authenticated
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const decoded = await firebaseAdmin.auth().verifyIdToken(token);
    // authenticated but not authorized
    if (decoded.role != "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
  const { email, role } = req.body;
  // check if email is non-null and role is valid value
  if (!email || typeof email != "string") {
    return res.status(400).json({ error: "Invalid email" });
  }
  if (role != null && !["admin", "lead", "volunteer"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  // Derived here rather than taken from the request so the two can never
  // disagree. Anyone holding a role is authorized by that fact; everyone else
  // falls back to the @uw.edu rule, which is what keeps demoting a UW student
  // from locking them out of the site entirely.
  const authorized =
    role != null || email.toLowerCase().endsWith("@uw.edu");
  // validate email actually exists in Firebase
  try {
    // throws an error if user not found by email
    const userRecord = await firebaseAdmin.auth().getUserByEmail(email);

    await firebaseAdmin.auth().setCustomUserClaims(userRecord.uid, { role, authorized });
  } catch (error) {
    return res.status(404).json({ error: "No account found for this email" });
  }

  return res.status(200).json({ success: true });
}
