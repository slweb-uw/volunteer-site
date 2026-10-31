import type { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../firebaseAdmin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }
// verify the firebase authentication token
  const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];

  if (!token) {
    return res.status(401).json({ error: "Please sign in." });
  }

  const auth = firebaseAdmin.auth();

  try {
    const decoded = await auth.verifyIdToken(token, true);
    const actor = await auth.getUser(decoded.uid);
    const role = actor.customClaims?.role;
//if the user is not an admin or lead, they should not be allowed to remove
// anyone registered for the event. 
    if (role !== "admin" && role !== "lead") {
      return res.status(403).json({
        error: "Only admins and leads can look up volunteers.",
      });
    }
  } catch {
    return res.status(401).json({ error: "Invalid session." });
  }

  const email = req.body?.email;

  if (typeof email !== "string" || !email.trim()) {
    return res.status(400).json({ error: "Enter an email." });
  }

  try {
    const target = await auth.getUserByEmail(email.trim().toLowerCase());
// returns the uid of the user 
    return res.status(200).json({
      uid: target.uid,
      email: target.email,
    });
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      return res.status(404).json({
        error: "This person must create an account before being registered.",
      });
    }

    if (error.code === "auth/invalid-email") {
      return res.status(400).json({ error: "Enter a valid email." });
    }

    console.error("Volunteer lookup failed:", error);
    return res.status(500).json({ error: "Volunteer lookup failed." });
  }
}