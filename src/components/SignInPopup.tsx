import React, { useState, useEffect } from "react";
import { firebaseClient } from "firebaseClient";
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    Button, 
    Typography, 
    makeStyles,
    Avatar,
    Tooltip,
} from '@material-ui/core';
import HelpIcon from "@material-ui/icons/Help";
import {useRouter} from 'next/router';
import { handleHelpButtonClick } from "helpers/navigation";

const MicrosoftLogo = (
    <Avatar
      alt="Microsoft Logo"
      src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
      style={{ borderRadius: 0 }}
    />
  );
  
const GoogleLogo = (
    <Avatar
        alt="Google Logo"
        src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
    />
);
  
const useStyles = makeStyles((theme) => ({
  dialog: {
    minWidth: 350,
  },
  buttonRow: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(2),
    marginBottom: "1.5rem"
  },
  button: {
    margin: theme.spacing(1),
    width: "200px",
    color: "black",
    border: "2px solid black",
    backgroundColor: "white",
  },
}));

type SignInPopupProps = {
  open: boolean;
  close: () => void;
};

const SignInPopup: React.FC<SignInPopupProps> = ({ open, close }) => {
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const handleHelpButtonClickLocation = () => {
    handleHelpButtonClick(router, 'fromSignIn');
    close();
  };

  useEffect(() => {
    setErrorMessage("");
  }, [open]); 

  const handleSignInWithProvider = async (provider: any) => {
    try {
      const result = await firebaseClient.auth().signInWithPopup(provider);
      close();
    } catch (error) {
      if(error && error.code == "auth/account-exists-with-different-credential"){
        const option = provider.id == "google.com" ? "Microsoft" : "Google";
        setErrorMessage("An account already exists with the same email address but different sign-in credentials. Please try signing-in using: " + option)
      }
    }
  };

  return (
    <Dialog open={open} onClose={close} className={classes.dialog}>
      <DialogTitle>
        <Typography variant="h5" align="center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Log In
          <Tooltip title="Help" arrow>
            <Button
              variant='outlined'
              color='secondary'
              startIcon={<HelpIcon />}
              onClick={handleHelpButtonClickLocation}
            >
              Help
            </Button>
          </Tooltip>
        </Typography>
      </DialogTitle>
      <DialogContent>
        <div style={{maxWidth: "350px"}}>
          <span style={{color: "red"}}>{errorMessage}</span>
        </div>
        <div className={classes.buttonRow}>
          <Button
            variant="contained"
            onClick={() => {
              const googleProvider = new firebaseClient.auth.GoogleAuthProvider();
              googleProvider.setCustomParameters({
                prompt: 'consent',
              });
              googleProvider.addScope("email");
              handleSignInWithProvider(googleProvider);
            }}
            startIcon={GoogleLogo}
            className={classes.button}
          >
            Sign In with Google
          </Button>
        </div>
        <div className={classes.buttonRow}>
          <Button
            variant="contained"
            onClick={() => {
              const microsoftProvider = new firebaseClient.auth.OAuthProvider("microsoft.com");
              microsoftProvider.setCustomParameters({
                prompt: 'consent',
              });
              microsoftProvider.addScope("email");
              handleSignInWithProvider(microsoftProvider);
            }}
            startIcon={MicrosoftLogo}
            className={classes.button}
          >
            Sign In with Microsoft
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignInPopup;
