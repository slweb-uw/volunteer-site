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
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [volunteerData, setVolunteerData] = useState([]);
  const [deletedRoles, setDeletedRoles] = useState([]);
  const [leadEmail, setLeadEmail] = useState("");
  const [eventInformation, setEventInformation] = useState("");
  const [eventData, setEventData] = useState({});
  const handleDateChange = (event) => setDate(event.target.value);

  const handleClose = () => {
    setDate("");
    setLeadEmail("");
    setEventInformation("");
    setVolunteerData([{ type: "", qty: "" }]);
    setEventData(null);
    setStartTime("");
    setEndTime("");
    close();
  };

  useEffect(() => {
    if (mode === "edit" && event) {
      const utcDate = new Date(event.date.seconds * 1000);
      const localDate = new Date(
        utcDate.getTime() - utcDate.getTimezoneOffset() * 60000,
      );
      setDate(localDate.toISOString().slice(0, 16));
      setLeadEmail(event.leadEmail);
      setEventInformation(event.eventInformation);
      setVolunteerData(
        event.volunteerTypes.map((type, index) => ({
          type,
          qty: event.volunteerQty[index],
        })),
      );
    } else {
      setDate("");
      setLeadEmail("");
      setEventInformation("");
      setVolunteerData([{ type: "", qty: "" }]);
    }
  }, [mode, event]);

  useEffect(() => {
    if (volunteerData.length > 0) {
      const localDate = new Date(date);
      const newEventData = {
        date: localDate,
        volunteerTypes: volunteerData.map((item) => item.type),
        volunteerQty: volunteerData.map((item) => item.qty),
        leadEmail,
        volunteers: {},
        eventInformation,
      };
      setEventData(newEventData);
    }
  }, [date, volunteerData, leadEmail, eventInformation, event]);

  const generateUniqueId = () => {
    const timestamp = new Date().getTime();
    const random = Math.random().toString(36).substring(2, 15);
    return `${timestamp}${random}`;
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?",
    );
    if (confirmed) {
      const idToDelete = event.id;
      const eventDataToDelete = { id: idToDelete };
      handleEventAction("delete", eventDataToDelete);
    }
    handleClose();
  };

  const handleEventInformationChange = (value) => {
    setEventInformation(value);
  };

  const handleVolunteerTypeChange = (index, value) => {
    if (value.length <= MAX_ROLE_NAME_LENGTH) {
      setVolunteerData((prevData) => {
        const newData = [...prevData];
        newData[index].type = value;
        return newData;
      });
    } else {
      alert(`Role name must be ${MAX_ROLE_NAME_LENGTH} characters or fewer.`);
    }
  };

  const handleVolunteerQtyChange = (index, value) => {
    value = value === "" ? "" : Math.max(0, parseInt(value) || 0).toString();
    setVolunteerData((prevData) => {
      const newData = [...prevData];
      newData[index].qty = value;
      return newData;
    });
  };

  const handleAddVolunteerField = () => {
    setVolunteerData((prevData) => [...prevData, { type: "", qty: "" }]);
  };

  const handleDeleteVolunteerField = (index) => {
    if (volunteerData.length > 1) {
      setVolunteerData((prevData) => prevData.filter((_, i) => i !== index));

      const deletedRole = volunteerData[index].type;
      setDeletedRoles((prevRoles) => [...prevRoles, deletedRole]);
    }
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!leadEmail) {
      alert("Please enter an email address.");
      return false;
    }
    if (!emailRegex.test(leadEmail)) {
      alert("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    console.log(date)
    if (!date) {
      alert("Please select a date.");
      return;
    }
    const hasEmptyFields = volunteerData.some(
      (item) => item.type === "" || item.qty === "",
    );

    const selectedDate = new Date(date);
    const currentDate = new Date();

    if (selectedDate <= currentDate) {
      alert("Please select a future date for the event.");
      return;
    }

    if (hasEmptyFields) {
      alert("Please fill in all Volunteer Role and Quantity fields.");
      return;
    }

    const hasInvalidQty = volunteerData.some((item) => parseInt(item.qty) < 1);

    if (hasInvalidQty) {
      alert("Volunteer Quantity must be at least 1.");
      return;
    }

    if (!validateEmail()) {
      return;
    }

    const hasDuplicateRoles = volunteerData.some(
      (role, index) =>
        volunteerData.findIndex((item) => item.type === role.type) !== index,
    );

    if (hasDuplicateRoles) {
      alert("Volunteer roles must have unique names.");
      return;
    }

    if (mode === "edit") {
      eventData.id = event.id;
      eventData.volunteers = event.volunteers;

      deletedRoles.forEach((deletedRole) => {
        if (eventData.volunteers && deletedRole in eventData.volunteers) {
          delete eventData.volunteers[deletedRole];
        }
      });

      handleEventAction("edit", eventData);
    } else if (mode === "add") {
      const localDate = new Date(`${date}T${startTime}Z`)
      console.log(date, startTime, localDate)
      const newEventData = {
        date: localDate,
        volunteerTypes: volunteerData.map((item) => item.type),
        volunteerQty: volunteerData.map((item) => item.qty),
        leadEmail,
        volunteers: {},
        eventInformation,
        startTime: startTime,
        endTime: endTime
      };
      handleEventAction("add", newEventData)
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
          value={date}
          InputLabelProps={{ shrink: true }}
          onChange={handleDateChange}
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
