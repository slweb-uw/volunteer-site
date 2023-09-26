import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  dateField: {
    marginTop: theme.spacing(2),
  },
}));

const generateUniqueId = () => {
    const timestamp = new Date().getTime();
    const random = Math.random().toString(36).substring(2, 15);
    return `${timestamp}${random}`;
  };

const AddEventPopup = ({ open, handleClose, addEvent }) => {
  const classes = useStyles();
  const [date, setDate] = useState('');
  const [volunteerTypes, setVolunteerTypes] = useState('');
  const [volunteerQty, setVolunteerQty] = useState('');

  const handleDateChange = (event) => setDate(event.target.value);
  const handleVolunteerTypesChange = (event) => setVolunteerTypes(event.target.value);
  const handleVolunteerQtyChange = (event) => setVolunteerQty(event.target.value);

  const handleSubmit = () => {
    const localDate = new Date(`${date}T00:00`);
    const utcDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);

    const newEvent = {
      id: generateUniqueId(),
      date: utcDate,
      volunteerTypes: volunteerTypes.split(',').map(item => item.trim()),
      volunteerQty: volunteerQty.split(',').map(item => item.trim()),
      volunteers: null,
    };
    console.log(newEvent);
    addEvent(newEvent);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className={classes.title}>Add New Event</DialogTitle>
      <DialogContent>
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={handleDateChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          className={classes.dateField} 
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
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Add Event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventPopup;