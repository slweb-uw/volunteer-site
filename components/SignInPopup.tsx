import React, { useState, useEffect } from "react"
import { firebaseClient } from "firebaseClient"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  Avatar,
  Tooltip,
  TextField,
  Divider,
} from "@mui/material"
import makeStyles from "@mui/styles/makeStyles"
import HelpIcon from "@mui/icons-material/Help"
import { useRouter } from "next/router"
import { handleHelpButtonClick } from "helpers/navigation"
import Image from "next/image"
import Link from "next/link"

const MicrosoftLogo = (
  <Avatar
    alt="Microsoft Logo"
    src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
    style={{ borderRadius: 0 }}
  />
)

const GoogleLogo = (
  <Avatar
    alt="Google Logo"
    src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
  />
)

const useStyles = makeStyles((theme) => ({
  dialog: {
    minWidth: 350,
  },
  buttonRow: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(2),
    marginBottom: "1.5rem",
  },
  button: {
    margin: theme.spacing(1),
    width: "200px",
    color: "black",
    border: "2px solid black",
    backgroundColor: "white",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "0.5rem 0",
  },
}))

type SignInPopupProps = {
  open: boolean
  close: () => void
}

const CONTENT = {
  LOGIN: "LOGIN",
  SIGNUP: "SIGNUP",
}

const SignInPopup: React.FC<SignInPopupProps> = ({ open, close }) => {
  const classes = useStyles()
  const [errorMessage, setErrorMessage] = useState("")
  const [content, setContent] = useState(CONTENT.LOGIN)
  const router = useRouter()
  const handleHelpButtonClickLocation = () => {
    handleHelpButtonClick(router, "fromSignIn")
    close()
  }

  useEffect(() => {
    setErrorMessage("")
  }, [open])

  const handleSignInWithProvider = async (provider: any) => {
    try {
      await firebaseClient.auth().signInWithPopup(provider)
      close()
    } catch (error) {
      if (
        error &&
        error.code == "auth/account-exists-with-different-credential"
      ) {
        const option = provider.id == "google.com" ? "Microsoft" : "Google"
        setErrorMessage(
          "An account already exists with the same email address but different sign-in credentials. Please try signing-in using: " +
            option
        )
      }
    }
  }

  async function handleSignInWithEmail() {
    await firebaseClient.auth().signInWithEmailAndPassword(email, password)
  }

  return (
    <Dialog open={open} onClose={close} className={classes.dialog}>
      <DialogTitle>
        <Typography
          variant="h5"
          align="center"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          Sign In
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
        </Typography>
      </DialogTitle>
      <DialogContent>
        {content === CONTENT.LOGIN ? (
          <LoginContent
            errorMessage={errorMessage}
            handleSignInWithProvider={handleSignInWithProvider}
            openSignup={() => setContent(CONTENT.SIGNUP)}
          />
        ) : (
          <SignupContent openLogin={() => setContent(CONTENT.LOGIN)} />
        )}
      </DialogContent>
    </Dialog>
  )
}

function LoginContent({
  errorMessage,
  handleSignInWithProvider,
  openSignup,
}: {
  errorMessage: string
  handleSignInWithProvider: (
    provider: firebaseClient.auth.GoogleAuthProvider
  ) => void
  openSignup: () => void
}) {
  const classes = useStyles()
  return (
    <>
      <div style={{ maxWidth: "350px" }}>
        <span style={{ color: "red" }}>{errorMessage}</span>
      </div>
      <form action="" className={classes.form}>
        <TextField label="Email" variant="outlined" type="email" />
        <TextField label="Password" variant="outlined" type="password" />
        <Button variant="contained">Sign in</Button>
      </form>
      <Divider>
        <Typography>Or continue with</Typography>
      </Divider>

      <Button
        variant="outlined"
        fullWidth
        onClick={() => {
          const googleProvider = new firebaseClient.auth.GoogleAuthProvider()
          googleProvider.setCustomParameters({
            prompt: "consent",
          })
          googleProvider.addScope("email")
          handleSignInWithProvider(googleProvider)
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

      <Typography>
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
    </>
  )
}

function SignupContent({ openLogin }: { openLogin: () => void }) {
  const classes = useStyles()
  return (
    <>
      <form className={classes.form}>
        <TextField label="Email" variant="outlined" type="email" required />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          required
        />
        <TextField
          label="Confirm Password"
          variant="outlined"
          type="password"
          required
        />
        <Button variant="contained">Sign up</Button>
      </form>
      <Typography>
        Already have an account?
        <Link href="." onClick={openLogin}>
          Sign in
        </Link>
      </Typography>
    </>
  )
}

export default SignInPopup
