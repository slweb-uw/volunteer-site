import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';

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
    const [volunteerData, setVolunteerData] = useState([]);
    const [deletedRoles, setDeletedRoles] = useState([]);
    const [leadEmail, setLeadEmail] = useState('');
    const [eventInformation, setEventInformation] = useState('');
    const handleDateChange = (event) => setDate(event.target.value);

    useEffect(() => {
        if (mode === 'edit' && event) {
            const utcDate = new Date(event.date);
            const localDate = new Date(utcDate.getTime() - (utcDate.getTimezoneOffset() * 60000));
            setDate(localDate.toISOString().slice(0, 16));
            setVolunteerData(event.volunteerTypes.map((type, index) => ({
                type,
                qty: event.volunteerQty[index]
            })));
        } else {
            setVolunteerData([{ type: '', qty: '' }]);
        }
    }, [mode, event]);

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

    const handleVolunteerTypeChange = (index, value) => {
        setVolunteerData(prevData => {
            const newData = [...prevData];
            newData[index].type = value;
            return newData;
        });
    };

    const handleVolunteerQtyChange = (index, value) => {
        value = Math.max(1, parseInt(value) || 1).toString();
        setVolunteerData(prevData => {
            const newData = [...prevData];
            newData[index].qty = value;
            return newData;
        });
    };

    const handleAddVolunteerField = () => {
        setVolunteerData(prevData => [...prevData, { type: '', qty: '' }]);
    };

    const handleDeleteVolunteerField = (index) => {
        if (volunteerData.length > 1) {
            setVolunteerData(prevData => prevData.filter((_, i) => i !== index));
        
            const deletedRole = volunteerData[index].type;
            setDeletedRoles(prevRoles => [...prevRoles, deletedRole]);
          }
    };

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!leadEmail) {
          alert('Please enter an email address.');
          return false;
        }
        if (!emailRegex.test(leadEmail)) {
          alert('Please enter a valid email address.');
          return false;
        }
        return true;
      };

    const handleSubmit = () => {
        if (!date) {
            alert('Please select a date.');
            return;
        }
        const hasEmptyFields = volunteerData.some(item => item.type === '' || item.qty === '');

        if (hasEmptyFields) {
            alert('Please fill in all Volunteer Role and Quantity fields.');
            return;
        }

        if (!validateEmail()) {
            return;
        }

        const hasDuplicateRoles = volunteerData.some((role, index) => 
            volunteerData.findIndex(item => item.type === role.type) !== index
        );

        if (hasDuplicateRoles) {
            alert('Volunteer roles must have unique names.');
            return;
        }
        const localDate = new Date(date);
        const eventData = {
            date: localDate,
            volunteerTypes: volunteerData.map(item => item.type),
            volunteerQty: volunteerData.map(item => item.qty),
            volunteers: null,
            leadEmail,
            eventInformation
        };

        if (mode === 'edit') {
            eventData.id = event.id;
            eventData.volunteers = event.volunteers;

            deletedRoles.forEach(deletedRole => {
                if (eventData.volunteers && deletedRole in eventData.volunteers) {
                  delete eventData.volunteers[deletedRole];
                }
            });

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
            {mode === 'add' ? 'Create Event' : 'Edit Event'}
        </DialogTitle>
        <DialogContent>
            <TextField
            label="Date"
            type="datetime-local"
            value={date}
            InputLabelProps={{ shrink: true }} 
            onChange={handleDateChange}
            fullWidth
            margin="normal"
            />
            {volunteerData.map((volunteer, index) => (
                <div key={index} style={{ display: 'flex', marginBottom: "0.5rem", marginTop: "0.5rem"}}>
                    <TextField
                        label={`Volunteer Role`}
                        value={volunteer.type}
                        onChange={(e) => handleVolunteerTypeChange(index, e.target.value)}
                        fullWidth
                        margin="normal"
                        style={{ marginRight: "0.5rem" }}
                    />
                    <TextField
                        label={`Quantity`}
                        value={volunteer.qty}
                        onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value) || 0).toString().slice(0, 2);
                            handleVolunteerQtyChange(index, e.target.value);
                        }}
                        fullWidth
                        margin="normal"
                        style={{ marginRight: "0.5rem" }} 
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    />
                    <Button 
                        variant="outlined" 
                        onClick={() => handleDeleteVolunteerField(index)}
                        style={{ alignSelf: 'flex-end'}}
                    >
                        <DeleteIcon />
                    </Button>
                </div>
            ))}
            <Button variant="contained" color="secondary" onClick={handleAddVolunteerField}>
                Add Volunteer Role
            </Button>
            <TextField
                label="Event Lead Email* (Receive Event Notifications)"
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                onBlur={validateEmail}
                fullWidth
                margin="normal"
            />

            <TextField
                label="Event Information"
                value={eventInformation}
                onChange={(e) => setEventInformation(e.target.value)}
                fullWidth
                multiline
                rows={4}
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