import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close'; 

const useStyles = makeStyles({
  title: {
    textAlign: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: 8,
    top: 8
  },
  information: {
    marginBottom: "2rem",
    textAlign: "center"
  },
  customDialog: {
    minWidth: 400
  },
  label: {
    fontWeight: "bold",
    display: "block",
  },
  item: {
    marginBottom: "1rem" 
  },
  comments: {
    whiteSpace: 'pre-line',
    textAlign: 'center',
  },
  commentsText: {
    maxWidth: '300px',
    wordBreak: 'break-word',
    margin: '0 auto', 
  },
});

const VolunteerInfoPopup = ({ open, handleClose, volunteer }) => {
  const classes = useStyles();

  return (
    volunteer && (
      <Dialog open={open} onClose={handleClose} classes={{ paper: classes.customDialog }}>
        <DialogTitle className={classes.title}>
          Volunteer Information
          <IconButton className={classes.closeButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.information}>
          <Typography variant="body1" className={classes.item}>
            <span className={classes.label}>Name</span> {volunteer.firstName} {volunteer.lastName}
          </Typography>
          <Typography variant="body1" className={classes.item}>
            <span className={classes.label}>Email</span> {volunteer.email}
          </Typography>
          <Typography variant="body1" className={classes.item}>
            <span className={classes.label}>Phone Number</span> {volunteer.phoneNumber}
          </Typography>
          <Typography variant="body1" className={classes.item}>
            <span className={classes.label}>Student Discipline</span> {volunteer.studentDiscipline}
          </Typography>
          { volunteer.comments && (
            <Typography variant="body1" className={`${classes.item} ${classes.comments}`}>
              <span className={classes.label}>Comments</span> 
              <div className={classes.commentsText}>{volunteer.comments}</div>
            </Typography>
          )}
          
        </DialogContent>
      </Dialog>
    )
  );
};

export default VolunteerInfoPopup;