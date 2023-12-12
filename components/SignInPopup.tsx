import React from "react";
import { firebaseClient } from "firebaseClient";
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    Button, 
    Typography, 
    makeStyles,
    Avatar 
} from '@material-ui/core';

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
    color: "black",
    border: "2px solid black",
    backgroundColor: "white",
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
            onClick={() => handleSignInWithProvider(new firebaseClient.auth.GoogleAuthProvider())}
            startIcon={GoogleLogo}
            className={classes.button}
          >
            Sign In with Google
          </Button>
        </div>
        <div className={classes.buttonRow}>
          <Button
            variant="contained"
            onClick={() => handleSignInWithProvider(new firebaseClient.auth.OAuthProvider("microsoft.com"))}
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
