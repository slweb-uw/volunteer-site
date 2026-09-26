import React, { useState } from "react";
import { useAuth } from "auth";
import { auth } from "firebaseClient";
import {
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import AuthorizationMessage from "./AuthorizationMessage";
import { useSnackbar } from "notistack";

export default function InvitePreceptorPage() {
  const { user, isAdmin, isLead, isLoading } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("volunteer");
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isLoading) {
    return null;
  }
  if (!user || (!isAdmin && !isLead)) {
    return <AuthorizationMessage user={user} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLink(null);
    setSubmitting(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/create-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          role: isAdmin ? role : "volunteer",
        }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        enqueueSnackbar(error || "Couldn't create invite", { variant: "error" });
        return;
      }
      const { token: inviteToken } = await res.json();
      setInviteLink(`${window.location.origin}/invite/${inviteToken}`);
      setEmail("");
    } catch (error) {
      enqueueSnackbar("Couldn't create invite", { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const copyLink = async () => {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    enqueueSnackbar("Link copied", { variant: "success", autoHideDuration: 2000 });
  };

  return (
    <div style={{ maxWidth: 480, margin: "3rem auto", padding: "0 1rem" }}>
      <Typography variant="h4" gutterBottom>
        Invite a preceptor
      </Typography>
      <Typography color="text.secondary" gutterBottom>
        Generate a link for someone to set up their account with access already
        granted — no waiting on User Manager.
      </Typography>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}
      >
        <TextField
          label="Their email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {isAdmin && (
          <FormControl>
            <InputLabel id="invite-role-label">Role</InputLabel>
            <Select
              labelId="invite-role-label"
              label="Role"
              value={role}
              onChange={(e: SelectChangeEvent) => setRole(e.target.value)}
            >
              <MenuItem value="volunteer">Non-UW preceptor</MenuItem>
              <MenuItem value="lead">Project lead</MenuItem>
            </Select>
          </FormControl>
        )}
        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
          style={{ backgroundColor: "#4b2e83" }}
        >
          Generate invite link
        </Button>
      </form>
      {inviteLink && (
        <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#f5f5f5", borderRadius: 8 }}>
          <Typography variant="body2" gutterBottom>
            Share this link — it works once:
          </Typography>
          <Typography style={{ wordBreak: "break-all", fontFamily: "monospace", fontSize: "0.85rem" }}>
            {inviteLink}
          </Typography>
          <Button onClick={copyLink} size="small" style={{ marginTop: "0.5rem" }}>
            Copy
          </Button>
        </div>
      )}
    </div>
  );
}
