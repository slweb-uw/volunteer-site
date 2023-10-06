import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    Typography,
    Select,
    MenuItem
  } from '@material-ui/core';
import { volunteerTypes } from "../components/addModifyEventModal";

const useStyles = makeStyles({
    title: {
        textAlign: 'center',
    },
    emailLabel: {
        '& .MuiInput-underline:before': {
          borderBottomStyle: 'solid',
        },
        '& .MuiInput-underline:hover:before': {
          borderBottomStyle: 'solid',
        },
        '& .MuiInput-underline:after': {
          borderBottomStyle: 'solid',
        },
        '& .Mui-disabled .MuiInput-underline:before': {
          borderBottomStyle: 'solid',
        },
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: "0.5rem"
    },
    selectContainer: {
      display: 'flex',
      alignItems: 'center',
      marginTop: "0.5rem",
      marginBottom: "0"
    },
});

const VolunteerPopup = ({ open, handleClose, email, addVolunteer, onDeleteVolunteer, volunteer }) => {
    const classes = useStyles();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [comments, setComments] = useState('');
    const [studentDiscipline, setStudentDiscipline] = useState('');
    const [certified, setCertified] = useState(false);
    const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');

    const validatePhoneNumber = (phoneNumber) => {
      const cleaned = phoneNumber.replace(/\D/g, '');
      return /^[0-9]{10}$/.test(cleaned);
    };   

    function formatPhoneNumber(phoneNumber) {
      const cleaned = phoneNumber.replace(/\D/g, '');
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
          return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
      return phoneNumber;
    }

    const handlePhoneNumberChange = (e) => {
      const rawPhoneNumber = e.target.value;
      const cleanedPhoneNumber = rawPhoneNumber.replace(/\D/g, '');
      const formattedPhoneNumber = formatPhoneNumber(cleanedPhoneNumber);
      setFormattedPhoneNumber(formattedPhoneNumber);
      setPhoneNumber(cleanedPhoneNumber);
    };

    const isPhoneNumberValid = validatePhoneNumber(phoneNumber);
    const isSubmitDisabled = !(email && firstName && lastName && studentDiscipline && certified);

    const handleSubmit = () => {
      if (isPhoneNumberValid) {
        const volunteerData = {
            email,
            firstName,
            lastName,
            phoneNumber,
            studentDiscipline,
            comments
        };

        addVolunteer(volunteerData);
        handleClose();
      } else {
          alert('Invalid phone number!');
      }
    };

    const handleDeleteVolunteer = () => {
      onDeleteVolunteer(volunteer);
      handleClose();
    };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className={classes.title}>Signup</DialogTitle>
      <DialogContent>
        <TextField
        label="Email"
        value={email}
        className={classes.emailLabel}
        fullWidth
        margin="normal"
        disabled
        />
        <div className={classes.selectContainer}>
          <Typography style={{ marginRight: '15px' }}>
            Student Discipline <span style={{color: "red"}}>*</span>
          </Typography>
          <Select
            value={studentDiscipline}
            onChange={(e) => setStudentDiscipline(e.target.value)}
          >
            {volunteerTypes.map((studentType, index) => (
              <MenuItem key={index} value={studentType}>{studentType}</MenuItem>
            ))}
          </Select>
        </div>
        <TextField
          label="First Name *"
          value={firstName}
          style={{ margin: "0 auto 0.75rem"}}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Last Name *"
          value={lastName}
          style={{ margin: "0 auto 0.75rem"}}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label={(
            <span>
            Phone Number * (Only viewable by project lead)
            </span>
          )}
          style={{ margin: "0 auto 0.75rem"}}
          value={formattedPhoneNumber}
          onChange={handlePhoneNumberChange}
          fullWidth
          margin="normal"
          onKeyDown={(e) => {
            const key = e.key;
            const isValidInput = /\d/.test(key) || key === 'Backspace' || key === 'Delete';
            const isMaxLengthReached = formattedPhoneNumber.length >= 10;
        
            if (!isValidInput || (isMaxLengthReached && key !== 'Backspace' && key !== 'Delete')) {
                e.preventDefault();
            }
          }}
        />
        <TextField
          label="Comments "
          value={comments}
          style={{ margin: "0 auto 0.75rem"}}
          onChange={(e) => setComments(e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControlLabel
          style={{marginTop: "0.75rem", marginBottom: "1.5rem", display: 'flex', alignItems: 'flex-start'}}
          control={<Checkbox color="primary" checked={certified} onChange={(e) => setCertified(e.target.checked)} style={{transform: 'scale(0.8)', marginTop: "0rem", paddingTop: "0", verticalAlign: "top"}}/>}
          label={
            <span style={{ fontSize: 'small', transform: 'scale(0.8)'}}>
                I certify that I will complete the required <a href="https://canvas.uw.edu/courses/1693188/pages/training-modules?module_item_id=18595279" target='blank'>Trainings</a> and
                the review appropriate <a href="https://canvas.uw.edu/courses/1693188/pages/protocols?module_item_id=18595280" target='blank'>Protocols</a> (see project details page for specifics).
                <span style={{color: "red"}}>*</span>
            </span>
          }
        />
        <div className={classes.buttonContainer}>
            {volunteer ? ( 
            <>
              <Button variant="outlined" onClick={handleDeleteVolunteer} style={{marginRight: "1rem", color: "gray"}}>
                Withdraw
              </Button>
              <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isSubmitDisabled}>
              Submit
              </Button>
            </>
            ):(
              <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isSubmitDisabled}>
                Submit
              </Button>
            )} 
        </div>
        
      </DialogContent>
    </Dialog>
  );
};

export default VolunteerPopup;
