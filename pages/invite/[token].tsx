import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  User,
} from "firebase/auth";
import { auth } from "firebaseClient";
import { firebaseAdmin } from "firebaseAdmin";
import { Typography, TextField, Button, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { FirebaseError } from "firebase/app";

type InviteProps = {
  valid: boolean;
  error?: string;
  email?: string;
  role?: string;
};

export const getServerSideProps: GetServerSideProps<InviteProps> = async (
  context,
) => {
  const { token } = context.params as { token: string };

  try {
    const snap = await firebaseAdmin
      .firestore()
      .collection("Invites")
      .doc(token)
      .get();

    if (!snap.exists) {
      return { props: { valid: false, error: "This invite link isn't valid." } };
    }
    const invite = snap.data();
    if (invite.usedAt) {
      return {
        props: { valid: false, error: "This invite has already been used." },
      };
    }
    if (invite.expiresAt.toMillis() < Date.now()) {
      return {
        props: {
          valid: false,
          error: "This invite has expired. Ask whoever sent it for a new one.",
        },
      };
    }
    return { props: { valid: true, email: invite.email, role: invite.role } };
  } catch (error) {
    return {
      props: { valid: false, error: "Something went wrong loading this invite." },
    };
  }
};

const ROLE_LABEL: Record<string, string> = {
  lead: "project lead",
  volunteer: "non-UW preceptor",
};

export default function InvitePage({ valid, error, email, role }: InviteProps) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [formState, setFormState] = useState({ fullName: "", password: "" });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setCheckingAuth(false);
    });
    return unsubscribe;
  }, []);

  const redeem = async (firebaseUser: User) => {
    setRedeeming(true);
    try {
      const idToken = await firebaseUser.getIdToken();
      const res = await fetch("/api/redeem-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ token: router.query.token }),
      });
      if (!res.ok) {
        const { error: redeemError } = await res.json();
        enqueueSnackbar(redeemError || "Couldn't redeem this invite", {
          variant: "error",
        });
        setRedeeming(false);
        return;
      }
      await firebaseUser.getIdTokenResult(true);
      enqueueSnackbar(
        `Welcome! You're all set up as a ${ROLE_LABEL[role || ""] || "team member"}.`,
        { variant: "success", autoHideDuration: 5000 },
      );
      router.push("/");
    } catch (err) {
      enqueueSnackbar("Something went wrong redeeming this invite", {
        variant: "error",
      });
      setRedeeming(false);
    }
  };

  useEffect(() => {
    if (
      !checkingAuth &&
      user &&
      valid &&
      user.email?.toLowerCase() === email?.toLowerCase()
    ) {
      redeem(user);
    }
    // Only re-run when auth state settles, not on every redeem() identity change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkingAuth, user, valid]);

  if (!valid) {
    return (
      <div style={{ maxWidth: 420, margin: "4rem auto", textAlign: "center", padding: "0 1rem" }}>
        <Typography variant="h5" gutterBottom>
          Invite not available
        </Typography>
        <Typography color="text.secondary">{error}</Typography>
      </div>
    );
  }

  if (checkingAuth || redeeming) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "4rem" }}>
        <CircularProgress />
      </div>
    );
  }

  if (user && user.email?.toLowerCase() !== email?.toLowerCase()) {
    return (
      <div style={{ maxWidth: 420, margin: "4rem auto", textAlign: "center", padding: "0 1rem" }}>
        <Typography variant="h5" gutterBottom>
          Wrong account
        </Typography>
        <Typography color="text.secondary">
          This invite is for <b>{email}</b>, but you&apos;re signed in as {user.email}.
          Sign out and reopen this link to accept it.
        </Typography>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      const credential =
        mode === "signup"
          ? await createUserWithEmailAndPassword(
              auth,
              email as string,
              formState.password,
            )
          : await signInWithEmailAndPassword(
              auth,
              email as string,
              formState.password,
            );

      if (mode === "signup" && formState.fullName) {
        await updateProfile(credential.user, { displayName: formState.fullName });
      }
      await redeem(credential.user);
    } catch (err) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/email-already-in-use") {
          setFormError("An account already exists for this email — switch to sign in below.");
          setMode("login");
        } else if (err.code === "auth/weak-password") {
          setFormError("Password should be at least six characters.");
        } else if (
          err.code === "auth/invalid-credential" ||
          err.code === "auth/wrong-password"
        ) {
          setFormError("Incorrect password.");
        } else {
          setFormError("Something went wrong, try again.");
        }
      }
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "4rem auto", padding: "0 1rem" }}>
      <Typography variant="h5" gutterBottom>
        You&apos;ve been invited as a {ROLE_LABEL[role || ""] || "team member"}
      </Typography>
      <Typography color="text.secondary" gutterBottom>
        {mode === "signup"
          ? "Create a password to finish setting up your account."
          : "Sign in to accept this invite."}
      </Typography>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}
      >
        <TextField label="Email" value={email} disabled fullWidth />
        {mode === "signup" && (
          <TextField
            label="Full name"
            value={formState.fullName}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, fullName: e.target.value }))
            }
            fullWidth
          />
        )}
        <TextField
          label="Password"
          type="password"
          required
          value={formState.password}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, password: e.target.value }))
          }
          fullWidth
        />
        {formError && <Typography color="error">{formError}</Typography>}
        <Button type="submit" variant="contained">
          {mode === "signup" ? "Create account" : "Sign in"}
        </Button>
        <Button
          type="button"
          variant="text"
          onClick={() => setMode(mode === "signup" ? "login" : "signup")}
        >
          {mode === "signup"
            ? "Already have an account? Sign in"
            : "Need to create an account instead?"}
        </Button>
      </form>
    </div>
  );
}
