import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  button: {
    marginLeft: theme.spacing(2),
  },
}));

const EditEventPopup = ({ open, handleClose, editedEvent, handleEditEvent, handleDeleteEvent  }) => {
  const classes = useStyles();
  const [date, setDate] = useState(editedEvent ? editedEvent.date.toISOString().slice(0, 10) : '');
  const [volunteerTypes, setVolunteerTypes] = useState(editedEvent ? editedEvent.volunteerTypes.join(', ') : '');
  const [volunteerQty, setVolunteerQty] = useState(editedEvent ? editedEvent.volunteerQty.join(', ') : '');

  useEffect(() => {
    if (editedEvent) {
      setDate(editedEvent.date.toISOString().slice(0, 10));
      setVolunteerTypes(editedEvent.volunteerTypes.join(', '));
      setVolunteerQty(editedEvent.volunteerQty.join(', '));
    }
  }, [editedEvent]);

  const handleDateChange = (event) => setDate(event.target.value);
  const handleVolunteerTypesChange = (event) => setVolunteerTypes(event.target.value);
  const handleVolunteerQtyChange = (event) => setVolunteerQty(event.target.value);

  const handleDelete = () => {
    const confirmed = window.confirm("Are you sure you want to delete this event?");
    if (confirmed) {
      handleDeleteEvent();
    }
    handleClose();
  };

  const handleSubmit = () => {
    const editedEventData = {
      ...editedEvent,
      date: new Date(date),
      volunteerTypes: volunteerTypes.split(',').map(item => item.trim()),
      volunteerQty: volunteerQty.split(',').map(item => item.trim()),
    };

    handleEditEvent(editedEventData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className={classes.title}>Edit Event</DialogTitle>
      <DialogContent>
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={handleDateChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Volunteer Types (comma separated)"
          value={volunteerTypes}
          onChange={handleVolunteerTypesChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Volunteer Quantities (comma separated)"
          value={volunteerQty}
          onChange={handleVolunteerQtyChange}
          fullWidth
          margin="normal"
        />
        <div className={classes.buttonContainer}>
          <Button variant="outlined" style={{color: 'grey'}} onClick={handleDelete} className={classes.button}>
            Delete Event
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit} className={classes.button}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventPopup;
