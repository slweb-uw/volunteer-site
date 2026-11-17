import { useState } from "react";
import { Alert, Button, Stack } from "@mui/material";
import { reload, sendEmailVerification, signOut } from "firebase/auth";
import { useSnackbar } from "notistack";
import { useAuth } from "auth";
import { auth } from "firebaseClient";

export default function EmailVerificationBanner() {
  const { user, isLoading } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [busy, setBusy] = useState(false);
  const [resendAvailableAt, setResendAvailableAt] = useState(0);

  if (isLoading || !user || user.emailVerified) return null;

  async function checkVerification() {
    if (!user) return;
    setBusy(true);

    try {
      // Fetch the latest verification status from Firebase.
      await reload(user);

      if (!user.emailVerified) {
        enqueueSnackbar(
          "Your email is not verified yet. Open the link in your email, then try again.",
          { variant: "info" },
        );
        return;
      }

      // Refresh email_verified in the token. This also triggers
      // AuthProvider's existing onIdTokenChanged listener.
      await user.getIdToken(true);

      enqueueSnackbar("Email verified successfully.", {
        variant: "success",
      });
    } catch {
      enqueueSnackbar(
        "Unable to check verification. Try again or sign out and back in.",
        { variant: "error" },
      );
    } finally {
      setBusy(false);
    }
  }

  async function resendVerification() {
    if (!user) return;

    if (Date.now() < resendAvailableAt) {
      enqueueSnackbar("Please wait a minute before requesting another email.", {
        variant: "info",
      });
      return;
    }

    setBusy(true);

    try {
      await sendEmailVerification(user);
      setResendAvailableAt(Date.now() + 60_000);
      enqueueSnackbar("Verification email sent. Check your inbox and spam folder.", {
        variant: "success",
      });
    } catch {
      enqueueSnackbar(
        "Unable to send verification email. Please wait and try again.",
        { variant: "error" },
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    setBusy(true);

    try {
      await signOut(auth);
    } catch {
      enqueueSnackbar("Unable to sign out. Please try again.", {
        variant: "error",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Alert severity="warning" sx={{ m: 2 }}>
      Verify {user.email} using the link in your email before accessing
      protected features.
      <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
        <Button disabled={busy} onClick={checkVerification}>
          I've verified my email
        </Button>
        <Button disabled={busy} onClick={resendVerification}>
          Resend verification email
        </Button>
        <Button disabled={busy} onClick={handleSignOut}>
          Sign out
        </Button>
      </Stack>
    </Alert>
  );
}