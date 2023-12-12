import React from "react";
import { firebaseClient } from "firebaseClient";
import { Dialog, DialogTitle, DialogContent, Button, Grid, Typography, makeStyles } from '@material-ui/core';

const GoogleLogo = "G";
const MicrosoftLogo = "M"; 

const useStyles = makeStyles((theme) => ({
  dialog: {
    minWidth: 300,
  },
  buttonRow: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
    width: "200px",
  },
}));

const SignInPopup = ({ open, close }) => {
  const classes = useStyles();

  const handleSignInWithProvider = async (provider) => {
    try {
      const result = await firebaseClient.auth().signInWithPopup(provider);
  
      if (result.additionalUserInfo && result.additionalUserInfo.isNewUser) {
      } else {
        const currentUser = firebaseClient.auth().currentUser;
        if (!currentUser.providerData.some((pd) => pd.providerId === provider.providerId)) {
          await currentUser.linkWithPopup(provider);
        }
      }
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <Dialog open={open} onClose={close} className={classes.dialog}>
      <DialogTitle>
        <Typography variant="h5" align="center">
          Log In
        </Typography>
      </DialogTitle>
      <DialogContent>
        <div className={classes.buttonRow}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSignInWithProvider(new firebaseClient.auth.GoogleAuthProvider())}
            startIcon={<span role="img" aria-label="Google Logo">{GoogleLogo}</span>}
            className={classes.button}
          >
            Sign In with Google
          </Button>
        </div>
        <div className={classes.buttonRow}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSignInWithProvider(new firebaseClient.auth.OAuthProvider("microsoft.com"))}
            startIcon={<span role="img" aria-label="Microsoft Logo">{MicrosoftLogo}</span>}
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
