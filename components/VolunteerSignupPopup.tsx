import React, { useState, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
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
  } from '@mui/material';
import { useAuth } from "auth";
import { volunteerTypes } from 'components/AddModifyEventModal';
import { VolunteerData } from 'new-types';

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
        justifyContent: 'flex-start',
        marginTop: "0.5rem"
    },
    selectContainer: {
      display: 'flex',
      alignItems: 'center',
      marginTop: "0.5rem",
      marginBottom: "0.5rem"
    },
});

const VolunteerPopup = ({ open, handleClose, email, name, uid, phone, position, addVolunteer, onDeleteVolunteer, onRemoveVolunteerByEmail, volunteer }) => {
    const classes = useStyles();
    const [displayName, setDisplayName] = useState(name ? name : ''); //TODO Set default state to name
    const [phoneNumber, setPhoneNumber] = useState(phone ? phone : ''); //TODO Set default state to phone number if provided
    const [comments, setComments] = useState('');
    const [studentDiscipline, setStudentDiscipline] = useState('');
    const [certified, setCertified] = useState(true); //TODO Set default state to false, true only for debugging.
    const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');

    const { isAdmin, isLead, isLoading } = useAuth();
    const canManage = !isLoading && (isAdmin || isLead);

    const [enteredEmail, setEnteredEmail] = useState(email || "");
    const [isBusy, setIsBusy] = useState(false);

    const targetEmail = canManage ? enteredEmail.trim() : email || "";
    
    useEffect(() => {
      if (!open) return;
    
      const initialPhone = String(volunteer?.phoneNumber || phone || "");
    
      setEnteredEmail(email || "");
      setDisplayName(volunteer?.name || name || "");
      setPhoneNumber(initialPhone);
      setFormattedPhoneNumber(formatPhoneNumber(initialPhone));
      setComments(volunteer?.comments || "");
      setStudentDiscipline(volunteer?.studentDiscipline || "");
      setCertified(true);
    }, [open, email, name, phone, volunteer]);


    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setEnteredEmail(event.target.value);
    
      // Do not reuse the previous person's details for a different email.
      setDisplayName("");
      setPhoneNumber("");
      setFormattedPhoneNumber("");
      setStudentDiscipline("");
      setComments("");
    };
    
    const runAction = async (action: () => Promise<unknown>) => {
      if (isBusy) return;
    
      setIsBusy(true);
      try {
        await action();
      } finally {
        setIsBusy(false);
      }
    };
    const validatePhoneNumber = (phoneNumber) => {
      const cleaned = String(phoneNumber || "").replace(/\D/g, "");      
      return /^[0-9]{10}$/.test(cleaned);
    };   

    function formatPhoneNumber(phoneNumber) {
      const cleaned = String(phoneNumber || "").replace(/\D/g, "");
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
    const isSubmitDisabled =
    isBusy ||
    isLoading ||
    !(targetEmail && displayName && studentDiscipline && certified);
  
  const handleSubmit = async () => {
    if (isSubmitDisabled) return;
  
    if (!isPhoneNumberValid) {
      alert("Invalid phone number!");
      return;
    }
  
    await runAction(() =>
      addVolunteer({
        email: targetEmail,
        name: displayName,
        phoneNumber,
        studentDiscipline,
        comments,
      }),
    );
  };

  return (
  <Dialog
    open={open}
    onClose={() => {
      if (!isBusy) handleClose();
    }}
  >      
<DialogTitle className={classes.title}>Volunteer Information</DialogTitle>
      <Typography variant="body1" align="center"> Sign up for {position} </Typography>
      <DialogContent>
      <TextField
        label="Email"
        type="email"
        value={canManage ? enteredEmail : email || ""}
        onChange={handleEmailChange}
        className={classes.emailLabel}
        fullWidth
        margin="normal"
        disabled={!canManage || isBusy}
        helperText={
          canManage
            ? "Signup and removal apply to this email for the selected event date."
            : undefined
        }
      />
        <div className={classes.selectContainer}>
          <Typography style={{ marginRight: '15px' }}>
            Student Discipline <span>*</span>
          </Typography>
          <Select
            value={studentDiscipline}
            onChange={(e) => setStudentDiscipline(e.target.value)}
          >
            {volunteerTypes.map((studentType, index) => (
              <MenuItem key={index} value={studentType}>{studentType}</MenuItem>
            ))}
          </Select>
          {!studentDiscipline && (
            <Typography variant="caption" color="error" style={{ marginLeft: '10px' }}>
                Please select your student discipline
            </Typography>
          )}
        </div>
        <TextField
          label="Full Name *"
          value={displayName}
          style={{ margin: "0 auto 0.75rem"}}
          onChange={(e) => setDisplayName(e.target.value)}
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
        <Typography style={{ marginRight: '15px', fontSize: 'small', fontSize: "0.9rem", marginTop: "0.5rem", marginBottom: "0.5rem"}}>
           Click <a href="https://canvas.uw.edu/courses/1693188/modules" target='blank'>here</a> to learn more
           about the service learning training and protocols.
        </Typography>
        <Typography style={{ marginRight: '15px', fontStyle: 'italic', fontSize: "0.7rem" }}>
          (*) Required fields
        </Typography>
        <div className={classes.buttonContainer}>
  <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
    <Button
      variant="contained"
      color="secondary"
      onClick={handleClose}
      disabled={isBusy}
    >
      Cancel
    </Button>

    {!canManage && volunteer && (
      <Button
        variant="outlined"
        color="error"
        onClick={() => runAction(() => onDeleteVolunteer(volunteer))}
        disabled={isBusy || isLoading}
      >
        Withdraw
      </Button>
    )}

    <Button
      variant="contained"
      color="primary"
      onClick={handleSubmit}
      disabled={isSubmitDisabled}
    >
      {volunteer ? "Save" : "Signup"}
    </Button>

    {canManage && (
      <Button
        variant="outlined"
        color="error"
        onClick={() =>
          runAction(() => onRemoveVolunteerByEmail(targetEmail))
        }
        disabled={isBusy || !targetEmail}
      >
        Remove volunteer
      </Button>
    )}
  </div>
</div>
      </DialogContent>
    </Dialog>
  );
};

export default VolunteerPopup;
