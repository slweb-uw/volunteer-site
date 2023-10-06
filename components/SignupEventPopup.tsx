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

const SignupEventPopup = ({ open, handleClose, mode, event, handleEventAction }) => {
    const classes = useStyles();
    const [date, setDate] = useState('');
    const [volunteerTypes, setVolunteerTypes] = useState('');
    const [volunteerQty, setVolunteerQty] = useState('');

    useEffect(() => {
        if (mode === 'edit' && event) {
        setDate(event.date.toISOString().slice(0, 10));
        setVolunteerTypes(event.volunteerTypes.join(', '));
        setVolunteerQty(event.volunteerQty.join(', '));
        }
    }, [mode, event]);

    const handleDateChange = (event) => setDate(event.target.value);
    const handleVolunteerTypesChange = (event) => setVolunteerTypes(event.target.value);
    const handleVolunteerQtyChange = (event) => setVolunteerQty(event.target.value);

    const generateUniqueId = () => {
        const timestamp = new Date().getTime();
        const random = Math.random().toString(36).substring(2, 15);
        return `${timestamp}${random}`;
    };

    const handleDelete = () => {
        const confirmed = window.confirm("Are you sure you want to delete this event?");
        if (confirmed) {
        handleEventAction('delete');
        }
        handleClose();
    };

    const handleSubmit = () => {
        const localDate = new Date(`${date}T00:00`);
        const utcDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);

        const eventData = {
        date: utcDate,
        volunteerTypes: volunteerTypes.split(',').map(item => item.trim()),
        volunteerQty: volunteerQty.split(',').map(item => item.trim()),
        volunteers: null
        };

        if (mode === 'edit') {
        eventData.id = event.id;
        eventData.volunteers = event.volunteers;
        handleEventAction('edit', eventData);
        } else if (mode === 'add') {
            eventData.id = generateUniqueId();
        handleEventAction('add', eventData);
        }

        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle className={classes.title}>
            {mode === 'add' ? 'Add New Event' : 'Edit Event'}
        </DialogTitle>
        <DialogContent>
            <TextField
            label="Date"
            type="date"
            value={date}
            InputLabelProps={{ shrink: true }} 
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
            {mode === 'edit' && (
                <Button variant="outlined" style={{color: 'grey'}} onClick={handleDelete} className={classes.button}>
                Delete Event
                </Button>
            )}
            <Button variant="contained" color="primary" onClick={handleSubmit} className={classes.button}>
                {mode === 'add' ? 'Add Event' : 'Save Changes'}
            </Button>
            </div>
        </DialogContent>
        </Dialog>
    );
};

export default SignupEventPopup;
