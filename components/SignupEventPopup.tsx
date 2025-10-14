import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import "react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: "center",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(2),
  },
  button: {
    marginLeft: theme.spacing(2),
  },
}));

const SignupEventPopup = ({ open, close, mode, event, handleEventAction }) => {
  const MAX_ROLE_NAME_LENGTH = 30;
  const classes = useStyles();
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [volunteerData, setVolunteerData] = useState([{ type: "", qty: "" }]);
  const [deletedRoles, setDeletedRoles] = useState([]);
  const [leadEmail, setLeadEmail] = useState("");
  const [eventInformation, setEventInformation] = useState("");
  // const [eventData, setEventData] = useState({});

  const handleClose = () => {
    setEventDate("");
    setLeadEmail("");
    setEventInformation("");
    setVolunteerData([{ type: "", qty: "" }]);
    setStartTime("");
    setEndTime("");
    setDeletedRoles([]);
    close();
  };

  useEffect(() => {
    if (mode === "edit" && event) {
      // Deconstruct date and time from the Firestore Timestamp
      const localDate = event.date.toDate();
      setEventDate(localDate.toISOString().split('T')[0]); 
      setStartTime(event.startTime || "");
      setEndTime(event.endTime || "");
      setLeadEmail(event.leadEmail || "");
      setEventInformation(event.eventInformation || "");

      // Convert the 'openings' map back into an array for the form's state
      if (event.openings && Object.keys(event.openings).length > 0) {
        const volunteerArray = Object.entries(event.openings).map(([type, qty]) => ({
          type,
          qty: String(qty),
        }));
        setVolunteerData(volunteerArray);
      } else {
        setVolunteerData([{ type: "", qty: "" }]);
      }
    } else {
      // Reset all fields for "add" mode
      setEventDate("");
      setStartTime("");
      setEndTime("");
      setLeadEmail("");
      setEventInformation("");
      setVolunteerData([{ type: "", qty: "" }]);
    }
  }, [mode, event, open]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      handleEventAction("delete", {}, event.id); // Pass the ID for deletion
      handleClose();
    }
  };

  const handleEventInformationChange = (value) => {
    setEventInformation(value);
  };

  const handleVolunteerTypeChange = (index, value) => {
    if (value.length <= MAX_ROLE_NAME_LENGTH) {
      const newData = [...volunteerData];
      newData[index].type = value;
      setVolunteerData(newData);
    } else {
      alert(`Role name must be ${MAX_ROLE_NAME_LENGTH} characters or fewer.`);
    }
  };

  const handleVolunteerQtyChange = (index, value) => {
    const newData = [...volunteerData];
    // Allow empty string, otherwise parse and ensure it's a non-negative integer
    newData[index].qty = value === "" ? "" : Math.max(0, parseInt(value) || 0).toString();
    setVolunteerData(newData);
  };

  const handleAddVolunteerField = () => {
    setVolunteerData([...volunteerData, { type: "", qty: "" }]);
  };

  const handleDeleteVolunteerField = (index) => {
    if (volunteerData.length > 1) {
      const deletedRole = volunteerData[index].type;
      if (deletedRole) { // Only track deletion if the role had a name
        setDeletedRoles(prev => [...prev, deletedRole]);
      }
      setVolunteerData(volunteerData.filter((_, i) => i !== index));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // const validateEmail = () => { -- Old, unsure why we tested for lead email. Safe to delete?
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!leadEmail) {
  //     alert("Please enter an email address.");
  //     return false;
  //   }
  //   if (!emailRegex.test(leadEmail)) {
  //     alert("Please enter a valid email address.");
  //     return false;
  //   }
  //   return true;
  // };

  const handleSubmit = () => {
    if (!eventDate || !startTime || !endTime) {
      alert("Please select a date, start time, and end time.");
      return;
    }

    // Combine date and start time to create a full Date object
    const combinedDateTime = new Date(`${eventDate}T${startTime}`);
    const currentDate = new Date();
    if (combinedDateTime <= currentDate) {
      alert("Please select a future date and time for the event.");
      return;
    }
    
    if (volunteerData.some((item) => item.type.trim() === "" || item.qty === "")) {
      alert("Please fill in all Volunteer Role and Quantity fields.");
      return;
    }
    
    if (volunteerData.some((item) => parseInt(item.qty) < 1)) {
      alert("Volunteer Quantity must be at least 1.");
      return;
    }

    if (!leadEmail || !validateEmail(leadEmail)) {
      alert("Please enter a valid lead email address.");
      return;
    }

    const roleNames = volunteerData.map(item => item.type.trim().toLowerCase());
    const hasDuplicateRoles = new Set(roleNames).size !== roleNames.length;
    if (hasDuplicateRoles) {
      alert("Volunteer roles must have unique names.");
      return;
    }

    // Create the openings map from the volunteerData state
    const openings = volunteerData.reduce((acc, item) => {
      if (item.type.trim()) {
        acc[item.type.trim()] = Number(item.qty);
      }
      return acc;
    }, {});
    
    // This is the final data object to be saved to Firestore
    const finalEventData = {
      date: combinedDateTime,
      startTime,
      endTime,
      leadEmail,
      eventInformation,
      openings,
    };
    
    if (mode === "edit") {
      handleEventAction("edit", finalEventData, event.id);
    } else {
      handleEventAction("add", finalEventData);
    }

    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className={classes.title}>
        <Typography variant="h4">
          {mode === "add" ? "Create Event" : "Edit Event"}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6">General Information</Typography>
        <TextField
          label="Event Lead Email* (Receive Event Notifications)"
          value={leadEmail}
          type="email"
          onChange={(e) => setLeadEmail(e.target.value)}
          onBlur={validateEmail}
          fullWidth
          margin="normal"
        />
        <ReactQuill
          theme="snow"
          value={eventInformation}
          onChange={handleEventInformationChange}
          placeholder="Enter event information..."
          style={{ marginBottom: "1rem" }}
        />

        <Typography variant="h6">Event Date</Typography>
        <TextField
          label="Date"
          type="date"
          value={eventDate}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setEventDate(e.target.value)}
          inputProps={{ min: new Date().toISOString().slice(0, 16) }}
          fullWidth
          margin="normal"
        />

        <div style={{ display: "flex", gap: 16 }}>
          <TextField
            label="Star time"
            value={startTime}
            fullWidth
            onChange={(e) => setStartTime(e.target.value)}
            margin="normal"
            type="time"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End time"
            fullWidth
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            margin="normal"
            type="time"
            InputLabelProps={{ shrink: true }}
          />
        </div>

        <Typography variant="h6">Volunteers Needed</Typography>
        {volunteerData.map((volunteer, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyItems: "center",
              alignItems: "center",
            }}
          >
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
                e.target.value = Math.max(0, parseInt(e.target.value) || 0)
                  .toString()
                  .slice(0, 2);
                handleVolunteerQtyChange(index, e.target.value);
              }}
              fullWidth
              type="number"
              margin="normal"
              style={{ marginRight: "0.5rem" }}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            />
            <Button
              variant="outlined"
              onClick={() => handleDeleteVolunteerField(index)}
              disabled={index === 0}
            >
              <DeleteIcon />
            </Button>
          </div>
        ))}
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddVolunteerField}
        >
          Add Volunteer Role
        </Button>
        <div className={classes.buttonContainer}>
          {mode === "edit" && (
            <Button
              variant="outlined"
              style={{ color: "grey" }}
              onClick={handleDelete}
              className={classes.button}
            >
              Delete Event
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            className={classes.button}
          >
            {mode === "add" ? "Add Event" : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignupEventPopup;
