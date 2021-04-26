import React, { useState } from 'react';
import { makeStyles, Modal } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
    width: 400,
    position: 'absolute',
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '300px',
    },
    '& .MuiButtonBase-root': {
      margin: theme.spacing(2),
    },
    alignItemsAndJustifyContent: {
        width: 500,
        height: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'pink',
    },
  },
  modal: {
    display: 'flex',
    flexDirection: 'width',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: 400,
    backgroundColor: "#ffffff",
    border: '2px solid #000',
    // boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  }
}));

const EventForm = () => {
  // create state variables for each input
  const [Name, setName] = useState('');
  const [Description, setDescription] = useState('');
  const [Organization, setOrganization] = useState('');
  const [Location, setLocation] = useState('');
  const [StartDate, setStartDate] = useState('');
  const [EndDate, setEndDate] = useState('');
  const [Timezone, setTimezone] = useState('');
  const [Recurrence, setRecurrence] = useState('');
  const [VolunteerType, setVolunteerType] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    console.log(Name, Description);
    




    handleClose();
  };

    const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
//   const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  return (
      <div>
          <button type="button" onClick={handleOpen}>
        Open Modal
      </button>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        >
    
    <form className={classes.root} onSubmit={handleSubmit}>
      <TextField
        label="Name"
        variant="filled"
        required
        value={Name}
        onChange={e => setName(e.target.value)}
      />
      <TextField
        label="Description"
        variant="filled"
        required
        value={Description}
        onChange={e => setDescription(e.target.value)}
      />
      <TextField
        label="Organization"
        variant="filled"
        required
        value={Organization}
        onChange={e => setOrganization(e.target.value)}
      />
      <TextField
        label="Location"
        variant="filled"
        required
        value={Location}
        onChange={e => setLocation(e.target.value)}
      />
      <TextField
        label="StartDate"
        variant="filled"
        required
        value={StartDate}
        onChange={e => setStartDate(e.target.value)}
      />
      <TextField
        label="EndDate"
        variant="filled"
        required
        value={EndDate}
        onChange={e => setEndDate(e.target.value)}
      />      
      <TextField
        label="Timezone"
        variant="filled"
        required
        value={Timezone}
        onChange={e => setTimezone(e.target.value)}
      />
      <TextField
        label="Recurrence"
        variant="filled"
        required
        value={Recurrence}
        onChange={e => setRecurrence(e.target.value)}
      />
      <TextField
        label="VolunteerType"
        variant="filled"
        required
        value={VolunteerType}
        onChange={e => setVolunteerType(e.target.value)}
      />      
      <div>
        <Button variant="contained" onClick={handleClose}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </div>
    </form>
          </Modal>
          </div>
  );
};

export default EventForm;