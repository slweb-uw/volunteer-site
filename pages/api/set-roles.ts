import type { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../firebaseAdmin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method != "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  // only admins allowed to set roles (TODO: make a script to set custom claims for pre-existing users)
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
  const { uid, role } = req.body;
  // check if uid is non-null and role is valid value
  if (!uid || typeof uid != "string") {
    return res.status(400).json({ error: "Invalid uid" });
  }
  if (!["admin", "lead", "volunteer"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  await firebaseAdmin.auth().setCustomUserClaims(uid, { role });

  return res.status(200).json({ success: true });
}
