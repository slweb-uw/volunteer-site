import type { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../firebaseAdmin";
import { generateInviteToken, rolesInvitableBy, INVITE_TTL_MS } from "../../helpers/invites";

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

  const allowedRoles = rolesInvitableBy(decoded.role as string | undefined);
  if (allowedRoles.length === 0) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const { email, role } = req.body;
  if (!email || typeof email != "string") {
    return res.status(400).json({ error: "Invalid email" });
  }
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const inviteToken = generateInviteToken();
  const now = Date.now();

  await firebaseAdmin
    .firestore()
    .collection("Invites")
    .doc(inviteToken)
    .set({
      email: normalizedEmail,
      role,
      createdByUid: decoded.uid,
      createdByEmail: decoded.email ?? null,
      createdAt: firebaseAdmin.firestore.Timestamp.fromMillis(now),
      expiresAt: firebaseAdmin.firestore.Timestamp.fromMillis(now + INVITE_TTL_MS),
      usedAt: null,
    });

  return res.status(200).json({ token: inviteToken });
}
