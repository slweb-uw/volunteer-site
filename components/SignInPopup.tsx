import React, { useState, useEffect } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "firebaseClient";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  Tooltip,
  TextField,
  Divider,
  Snackbar,
  Input,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import HelpIcon from "@mui/icons-material/Help";
import { useRouter } from "next/router";
import { handleHelpButtonClick } from "helpers/navigation";
import Image from "next/image";
import Link from "next/link";
import { FirebaseError } from "firebase/app";
import { useSnackbar } from "notistack";

type SignInPopupProps = {
  open: boolean;
  close: () => void;
};

const CONTENT = {
  LOGIN: "LOGIN",
  SIGNUP: "SIGNUP",
  FORGOT_PASSWORD: "FORGOT_PASSWORD",
};

export default function SignInPopup({ open, close }: SignInPopupProps) {
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = useState("");
  const [content, setContent] = useState(CONTENT.LOGIN);
  const router = useRouter();
  const handleHelpButtonClickLocation = () => {
    handleHelpButtonClick(router, "fromSignIn");
    close();
  };

  useEffect(() => {
    setErrorMessage("");
  }, [open]);

  const handleSignInWithProvider = async (provider: any) => {
    try {
      await signInWithPopup(auth, provider);
      close();
    } catch (error) {
      if (
        error &&
        error.code == "auth/account-exists-with-different-credential"
      ) {
        const option = provider.id == "google.com" ? "Microsoft" : "Google";
        setErrorMessage(
          "An account already exists with the same email address but different sign-in credentials. Please try signing-in using: " +
            option,
        );
      }
    }
  };

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="xs">
      <DialogTitle style={{ display: "flex", justifyContent: "space-between" }}>
        {content === CONTENT.LOGIN
          ? "Sign in"
          : content === CONTENT.FORGOT_PASSWORD
            ? "Forgot password"
            : "Sign up"}
        <Tooltip title="Help" arrow>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<HelpIcon />}
            onClick={handleHelpButtonClickLocation}
          >
            Help
          </Button>
        </Tooltip>
      </DialogTitle>
      <DialogContent>
        {content === CONTENT.LOGIN ? (
          <LoginContent
            errorMessage={errorMessage}
            handleSignInWithProvider={handleSignInWithProvider}
            openSignup={() => setContent(CONTENT.SIGNUP)}
            openForgotPassword={() => setContent(CONTENT.FORGOT_PASSWORD)}
            close={close}
          />
        ) : content === CONTENT.FORGOT_PASSWORD ? (
          <ForgotPasswordContent openLogin={() => setContent(CONTENT.LOGIN)} />
        ) : (
          <SignupContent
            openLogin={() => setContent(CONTENT.LOGIN)}
            close={close}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function LoginContent({
  handleSignInWithProvider,
  openSignup,
  openForgotPassword,
  close,
}: {
  errorMessage: string;
  handleSignInWithProvider: (provider: GoogleAuthProvider) => void;
  openSignup: () => void;
  openForgotPassword: () => void;
  close: () => void;
}) {
  const classes = useStyles();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState<string | null>();
  const { enqueueSnackbar } = useSnackbar();

  async function handleSignInWithEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginError(null);
    try {
      await signInWithEmailAndPassword(
        auth,
        formState.email,
        formState.password,
      );
      enqueueSnackbar(`Sucessfully logged in ${formState.email}`, {
        autoHideDuration: 4000,
        variant: "success",
      });
      close();
    } catch (err) {
      setLoginError("Invalid email or password");
    }
  }

  // clear errors when changing input values
  useEffect(() => {
    if (loginError) setLoginError(null);
  }, [formState]);

  return (
    <div className={classes.contentContainer}>
      <div style={{ maxWidth: "350px" }}>
        {/* <span style={{ color: "red" }}>{errorMessage}</span> */}
        {loginError && (
          <Typography style={{ color: "red" }}>{loginError}</Typography>
        )}
      </div>
      <form onSubmit={handleSignInWithEmail} className={classes.form}>
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          required
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, email: e.target.value }))
          }
          value={formState.email}
          autoFocus
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          required
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, password: e.target.value }))
          }
          value={formState.password}
        />

        <Button
          variant="text"
          type="button"
          onClick={openForgotPassword}
          sx={{ fontSize: "0.7rem", padding: 0, color: "grey" }}
        >
          Forgot password
        </Button>
        <Button variant="contained" type="submit">
          Sign in
        </Button>
      </form>
      <Divider>
        <Typography>Or continue with</Typography>
      </Divider>

      <Button
        variant="outlined"
        fullWidth
        onClick={() => {
          const googleProvider = new GoogleAuthProvider();
          googleProvider.setCustomParameters({
            prompt: "consent",
          });
          googleProvider.addScope("email");
          handleSignInWithProvider(googleProvider);
        }}
        startIcon={
          <Image
            alt="Google Icon"
            height={16}
            width={16}
            src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
          />
        }
      >
        Google
      </Button>

      <Typography className={classes.authLink}>
        Don't have an account?
        <Link href="." onClick={openSignup}>
          Register
        </Link>
      </Typography>
      {/* <Button
            variant="contained"
            onClick={() => {
              const microsoftProvider = new firebaseClient.auth.OAuthProvider(
                "microsoft.com"
              )
              microsoftProvider.setCustomParameters({
                prompt: "consent",
              })
              microsoftProvider.addScope("email")
              handleSignInWithProvider(microsoftProvider)
            }}
            startIcon={MicrosoftLogo}
            className={classes.button}
          >
            Microsoft
          </Button> */}
    </div>
  );
}

const SIGNUP_ERRORS = {
  WEAK_PASSWORD: {
    CODE: "auth/weak-password",
    MESSAGE: "Password should be at least six characters",
  },
  EMAIL_USED: {
    CODE: "auth/email-already-in-use",
    MESSAGE: "Email addressed already used by another account",
  },
};

function SignupContent({
  openLogin,
  close,
}: {
  openLogin: () => void;
  close: () => void;
}) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<string | null>();

  useEffect(() => {
    if (errors) setErrors(null);
  }, [formState]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        formState.email,
        formState.password,
      );
      await sendEmailVerification(user.user);
      enqueueSnackbar(
        `Successfully registered ${user.user.email}, check email for verification`,
        {
          autoHideDuration: 5000,
          variant: "success",
        },
      );
      close();
    } catch (err) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case SIGNUP_ERRORS.EMAIL_USED.CODE:
            setErrors(SIGNUP_ERRORS.EMAIL_USED.MESSAGE);
            break;
          case SIGNUP_ERRORS.WEAK_PASSWORD.CODE:
            setErrors(SIGNUP_ERRORS.WEAK_PASSWORD.MESSAGE);
            break;
          default:
            setErrors("Something went wrong try again");
            break;
        }
      }
    }
  }

  return (
    <div className={classes.contentContainer}>
      <div>
        {errors && <Typography style={{ color: "red" }}>{errors}</Typography>}
      </div>
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          required
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, email: e.target.value }))
          }
          value={formState.email}
          autoFocus
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          required
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, password: e.target.value }))
          }
          value={formState.password}
          helperText="Password should be at least 6 characters"
        />
        <Button variant="contained" type="submit">
          Sign up
        </Button>
      </form>
      <Typography className={classes.authLink}>
        Already have an account?
        <Link href="." onClick={openLogin}>
          Sign in
        </Link>
      </Typography>
    </div>
  );
}

function ForgotPasswordContent({ openLogin }: { openLogin: () => void }) {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { enqueueSnackbar } = useSnackbar();


  useEffect(() => {
    setError("")
  }, [email])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      enqueueSnackbar(`check ${email}, for reset password email`, {
        autoHideDuration: 5000,
      });
      openLogin()
    } catch (err) {
      setError("user not found")
    }
  }
  return (
    <form
      className={classes.contentContainer}
      onSubmit={(e) => handleSubmit(e)}
    >
      <Typography style={{ color: "red" }}>{error}</Typography>
      <TextField
        label="Email"
        variant="outlined"
        type="email"
        required
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        autoFocus
      />
      <Button variant="contained" type="submit">
        Send email
      </Button>

      <Typography className={classes.authLink}>
        Go back to
        <Link href="." onClick={openLogin}>
          Login
        </Link>
      </Typography>
    </form>
  );
}

const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "0.5rem 0",
  },

  authLink: {
    display: "flex",
    gap: "0.25rem",
    justifyContent: "center",
  },

  contentContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
}));
