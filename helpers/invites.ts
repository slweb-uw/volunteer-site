import crypto from "crypto";

export const INVITE_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

export function generateInviteToken(): string {
  return crypto.randomBytes(24).toString("hex");
}

// Which roles a given caller is allowed to hand out via an invite link.
// Admin-level access is deliberately never invitable this way — that stays
// a manual User Manager action.
export function rolesInvitableBy(callerRole: string | undefined): string[] {
  if (callerRole === "admin") return ["lead", "volunteer"];
  if (callerRole === "lead") return ["volunteer"];
  return [];
}
