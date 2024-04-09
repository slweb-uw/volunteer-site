import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Snackbar } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
    title: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
}));

const SharePopup = ({ onClose, link }) => {
  const classes = useStyles();
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link)
        .then(() => {
          setIsSnackbarOpen(true);
        })
        .catch((error) => {
          console.error('Unable to copy to clipboard', error);
        });
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSnackbarOpen(false);
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle className={classes.title}>Share Link</DialogTitle>
      <DialogContent>
        <TextField
          variant="outlined"
          fullWidth
          value={link}
          InputProps={{
            readOnly: true,
          }}
        />
        <Button 
        onClick={copyToClipboard} 
        color="primary" 
        variant="contained" 
        fullWidth
        style={{marginTop: "1rem", marginBottom: "1rem"}}>
          Copy to Clipboard
        </Button>
        <Snackbar
          open={isSnackbarOpen}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          message="Link copied to clipboard"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SharePopup;
