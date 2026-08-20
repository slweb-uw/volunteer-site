import type { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../firebaseAdmin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method != "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authToken = req.headers.authorization?.split("Bearer ")[1];
  if (!authToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  let decoded;
  try {
    decoded = await firebaseAdmin.auth().verifyIdToken(authToken);
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const { token } = req.body;
  if (!token || typeof token != "string") {
    return res.status(400).json({ error: "Invalid invite token" });
  }

  const db = firebaseAdmin.firestore();
  const inviteRef = db.collection("Invites").doc(token);
  const inviteSnap = await inviteRef.get();

  if (!inviteSnap.exists) {
    return res.status(404).json({ error: "Invite not found" });
  }

  const invite = inviteSnap.data();

  if (invite.usedAt) {
    return res.status(410).json({ error: "This invite has already been used" });
  }
  if (invite.expiresAt.toMillis() < Date.now()) {
    return res.status(410).json({ error: "This invite has expired" });
  }
  if (!decoded.email || decoded.email.toLowerCase() !== invite.email) {
    return res
      .status(403)
      .json({ error: "This invite was issued to a different email address" });
  }

  await firebaseAdmin
    .auth()
    .setCustomUserClaims(decoded.uid, { role: invite.role, authorized: true });
  await inviteRef.update({ usedAt: firebaseAdmin.firestore.Timestamp.now() });

  // Keep it visible in User Manager alongside admin-granted roles.
  const rosterCollection = invite.role === "lead" ? "Leads" : "Volunteers";
  await db.collection(rosterCollection).add({
    email: invite.email,
    timestamp: firebaseAdmin.firestore.Timestamp.now(),
  });

  return res.status(200).json({ role: invite.role });
}
