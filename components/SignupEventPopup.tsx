import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Typography,
  IconButton,
  Grid,
  Box
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircleOutline";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import "react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    maxWidth: "1200px",
    width: "100%",
    padding: 0,
    borderRadius: "8px",
  },
  header: {
    backgroundColor: "#85754D",
    color: "white",
    padding: theme.spacing(2, 3),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontWeight: 700,
    fontSize: "1.2rem",
  },
  closeBtn: {
    color: "white",
  },
  content: {
    padding: theme.spacing(4),
  },
  sectionLabel: {
    fontWeight: 600,
    marginBottom: theme.spacing(1),
    fontSize: "1rem",
  },
  quillContainer: {
    height: "150px",
    marginBottom: theme.spacing(4),
    "& .ql-container": {
      height: "110px",
    },
  },
  calendarContainer: {
    border: "1px solid #e0e0e0",
    borderRadius: "4px",
    padding: theme.spacing(1),
    width: "100%",
    maxWidth: "300px",
  },
  calendarHeader: {
    display: "flex",
    justifyContent: "space-between",
    color: "#00839B",
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "4px",
    textAlign: "center",
    minHeight: "240px", 
    alignContent: "start",
  },
  dayLabel: {
    fontSize: "0.8rem",
    color: "#00839B",
    fontWeight: 600,
  },
  dateBtn: {
    fontSize: "0.85rem",
    padding: "6px 0",
    cursor: "pointer",
    borderRadius: "4px",
    "&:hover": {
      backgroundColor: "#f0f0f0",
    },
  },
  selectedDateBtn: {
    backgroundColor: "#007892 !important",
    color: "white",
  },
  selectedListContainer: {
    maxHeight: "300px",
    overflowY: "auto",
  },
  selectedDateItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#85754D",
    padding: theme.spacing(0.5, 0),
    borderBottom: "1px solid #f0f0f0",
  },
  volunteerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(1.5),
  },
  counterContainer: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "white",
  },
  counterBtn: {
    padding: "2px 8px",
    minWidth: "30px",
    color: "#666",
  },
  counterValue: {
    padding: "0 8px",
    fontWeight: 600,
  },
  createBtn: {
    backgroundColor: "#aed51e",
    color: "white",
    fontWeight: 700,
    padding: "10px 30px",
    float: "right",
    marginTop: theme.spacing(4),
    "&:hover": {
      backgroundColor: "#9cc218",
    },
  },
}));

// Calendar Logic
const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

const SignupEventPopup = ({ open, close, mode, event, handleEventAction }) => {
  const classes = useStyles();

  const [eventName, setEventName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [location, setLocation] = useState("");
  const [eventInformation, setEventInformation] = useState("");
  const [requiredTraining, setRequiredTraining] = useState("");
  
  // Date & Time
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedDates, setSelectedDates] = useState([]); // Array of date strings "YYYY-MM-DD"
  
  // Calendar Navigation State
  const [currentDateView, setCurrentDateView] = useState(new Date());

  // Volunteers
  const [volunteerData, setVolunteerData] = useState([]);
  const [newRoleName, setNewRoleName] = useState("");

  useEffect(() => {
    if (event && (mode === "edit" || mode === "add")) {
      setEventName(event.name || "");
      setLeadEmail(event.leadEmail || "");
      setLocation(event.address || "");
      setEventInformation(event.eventInformation || "");
      setRequiredTraining(event.requiredTraining || "");
      setStartTime(event.startTime || "");
      setEndTime(event.endTime || "");

      // Handling Date(s)
      if (event.dates && Array.isArray(event.dates)) {
         // Convert timestamps to YYYY-MM-DD strings
         const formattedDates = event.dates.map((d: { toDate: () => { (): any; new(): any; toISOString: { (): string; new(): any; }; }; }) => d.toDate().toISOString().split('T')[0]);
         setSelectedDates(formattedDates);
        if (formattedDates[0]) {
          setCurrentDateView(new Date(`${formattedDates[0]}T12:00:00`));
        }
      } else if (event.date) {
         const singleDate = event.date.toDate().toISOString().split('T')[0];
         setSelectedDates([singleDate]);
        setCurrentDateView(new Date(`${singleDate}T12:00:00`));
      }

      // Handling Volunteers
      if (event.openings && Object.keys(event.openings).length > 0) {
        let rolesSource = event.openings;
        const keys = Object.keys(event.openings);
        
        if (typeof event.openings[keys[0]] === 'object' && event.openings[keys[0]] !== null) {
            rolesSource = event.openings[keys[0]];
        }

        const vArray = Object.entries(rolesSource).map(([type, qty]) => ({
          type,
          qty: Number(qty),
        }));
        setVolunteerData(vArray);
      } else {
        setVolunteerData([]);
      }

      setNewRoleName("");

    } else {
      // RESET for Add Mode
      setEventName("");
      setLeadEmail("");
      setLocation("");
      setEventInformation("");
      setRequiredTraining("");
      setStartTime("");
      setEndTime("");
      setSelectedDates([]);
      setVolunteerData([]);
      setNewRoleName("");
      setCurrentDateView(new Date());
    }
  }, [mode, event, open]);

  // Calendar Handlers
  const handleMonthChange = (direction: number) => {
    const newDate = new Date(currentDateView);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDateView(newDate);
  };

  const toggleDateSelection = (day: number) => {
    const year = currentDateView.getFullYear();
    const month = String(currentDateView.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const dateString = `${year}-${month}-${d}`;

    if (selectedDates.includes(dateString)) {
      setSelectedDates(selectedDates.filter(date => date !== dateString));
    } else {
      setSelectedDates([...selectedDates, dateString].sort());
    }
  };

  const removeDate = (dateToRemove: never) => {
    setSelectedDates(selectedDates.filter(date => date !== dateToRemove));
  };

  // Volunteer Handlers
  const handleAddRole = () => {
    if (!newRoleName.trim()) return;
    // Check duplicates
    if (volunteerData.some(v => v.type.toLowerCase() === newRoleName.toLowerCase())) {
        alert("Role already exists");
        return;
    }
    setVolunteerData([...volunteerData, { type: newRoleName, qty: 1 }]);
    setNewRoleName("");
  };

  const updateVolunteerQty = (index: number, delta: number) => {
    const newData = [...volunteerData];
    const newQty = newData[index].qty + delta;

    if (newQty <= 0) {
        newData.splice(index, 1);
    } else {
        newData[index].qty = newQty;
    }

    setVolunteerData(newData);
  };

  // Submit Handler
 const handleSubmit = () => {
    if (!eventName) { alert("Please enter an Event Name"); return; }
    if (selectedDates.length === 0) { alert("Please select at least one date"); return; }
    if (!startTime || !endTime) { alert("Please enter Start and End times"); return; }
    if (!leadEmail) { alert("Please enter a Lead Contact Email"); return; }
    if (volunteerData.length === 0) {
        alert("Please add at least one volunteer type.");
        return;
    }

    // Prepare Openings Map
    const openings = volunteerData.reduce((acc, item) => {
        acc[item.type] = item.qty;
        return acc;
    }, {});
    
    const dateObjects = selectedDates.map(ds => {
        const [y, m, d] = ds.split('-').map(Number);
        return new Date(y, m - 1, d, 12, 0, 0); 
    });

    const finalEventData = {
      name: eventName,
      leadEmail,
      address: location,
      eventInformation,
      requiredTraining,
      startTime,
      endTime,
      openings,
      dates: dateObjects,
      date: dateObjects[0], // Legacy, some lookups still use singular date.
    };

    if (mode === "edit") {
      handleEventAction("edit", finalEventData, event.id);
    } else {
      handleEventAction("add", finalEventData);
    }
    close();
  };


  // Calendar Render
  const year = currentDateView.getFullYear();
  const month = currentDateView.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthName = currentDateView.toLocaleString('default', { month: 'long' });

  const renderCalendar = () => {
    const blanks = Array.from({ length: firstDay }, (_, i) => <div key={`blank-${i}`} />);
    const days = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const currentMonthStr = String(month + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const fullDate = `${year}-${currentMonthStr}-${dayStr}`;
        const isSelected = selectedDates.includes(fullDate);

        return (
            <div 
                key={day} 
                className={`${classes.dateBtn} ${isSelected ? classes.selectedDateBtn : ''}`}
                onClick={() => toggleDateSelection(day)}
            >
                {day}
            </div>
        );
    });
    return [...blanks, ...days];
  };

  return (
    <Dialog 
        open={open} 
        onClose={close} 
        classes={{ paper: classes.dialogPaper }}
        maxWidth="lg"
    >
      {/* Header */}
      <div className={classes.header}>
        <Typography className={classes.headerTitle}>
            {mode === "add" ? "Add Event" : "Edit Event"}
        </Typography>
        <IconButton onClick={close} className={classes.closeBtn} size="small">
          <CloseIcon />
        </IconButton>
      </div>

      <DialogContent className={classes.content}>
        {/* Name */}
        <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
                <Typography className={classes.sectionLabel}>Event Name</Typography>
                <TextField 
                    fullWidth 
                    variant="outlined" 
                    size="small"
                    placeholder="Event Name" 
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                />
            </Grid>
            <Grid item xs={12} md={7} />

            {/* Email & Location */}
            <Grid item xs={12} md={5}>
                <Typography className={classes.sectionLabel}>Lead Contact Email</Typography>
                <TextField 
                    fullWidth 
                    variant="outlined" 
                    size="small"
                    placeholder="user@gmail.com"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                />
            </Grid>
            <Grid item xs={12} md={7}>
                <Typography className={classes.sectionLabel}>Location / Address of Event</Typography>
                <TextField 
                    fullWidth 
                    variant="outlined" 
                    size="small"
                    placeholder="Address"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
            </Grid>

            {/* Description & Training */}
            <Grid item xs={12} md={5}>
                <Typography className={classes.sectionLabel}>Event Description</Typography>
                <Box className={classes.quillContainer}>
                    <ReactQuill
                        theme="snow"
                        value={eventInformation}
                        onChange={setEventInformation}
                        style={{ height: '100%' }}
                    />
                </Box>
            </Grid>
            <Grid item xs={12} md={7}>
                <Typography className={classes.sectionLabel}>Required Training / Other Info</Typography>
                <TextField 
                    fullWidth 
                    multiline
                    rows={4}
                    variant="outlined" 
                    placeholder="Please wear closed-toe shoes."
                    value={requiredTraining}
                    onChange={(e) => setRequiredTraining(e.target.value)}
                    style={{ height: '150px' }} // Visual match
                    InputProps={{ style: { height: '100%', alignItems: 'flex-start' } }}
                />
            </Grid>
        </Grid>

        {/* Complex Section */}
        <Grid container spacing={4} style={{ marginTop: '16px' }}>
            
            {/* Time & Calendar */}
            <Grid item xs={12} md={4}>
                <Grid container spacing={1} alignItems="center" style={{ marginBottom: '20px' }}>
                    <Grid item xs={12}><Typography className={classes.sectionLabel}>Start Time &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; End Time</Typography></Grid>
                    <Grid item xs={5}>
                        <TextField 
                            type="time" 
                            variant="outlined" 
                            size="small" 
                            fullWidth 
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={2} style={{ textAlign: 'center' }}>to</Grid>
                    <Grid item xs={5}>
                        <TextField 
                            type="time" 
                            variant="outlined" 
                            size="small" 
                            fullWidth 
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                </Grid>

                {/* Custom Calendar UI */}
                <div className={classes.calendarContainer}>
                    <div className={classes.calendarHeader}>
                        <span>{monthName} {year}</span>
                        <div>
                            <IconButton size="small" onClick={() => handleMonthChange(-1)} style={{ color: '#00839B', padding: 2 }}>
                                <ChevronLeftIcon />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleMonthChange(1)} style={{ color: '#00839B', padding: 2 }}>
                                <ChevronRightIcon />
                            </IconButton>
                        </div>
                    </div>
                    <div className={classes.calendarGrid}>
                        {daysOfWeek.map(d => <div key={d} className={classes.dayLabel}>{d}</div>)}
                        {renderCalendar()}
                    </div>
                </div>
            </Grid>

            {/* Selected Dates List */}
            <Grid item xs={12} md={3}>
                <Typography className={classes.sectionLabel} style={{ display: 'flex', alignItems: 'center' }}>
                    Selected Date(s) &nbsp; <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>on</span>
                </Typography>
                <div className={classes.selectedListContainer}>
                    {selectedDates.map((dateStr) => {
                        // Formatting: "Mon, 08/18/25"
                        const [y, m, d] = dateStr.split('-');
                        const dateObj = new Date(Number(y), Number(m)-1, Number(d));
                        const displayStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: '2-digit', day: '2-digit', year: '2-digit' });
                        
                        return (
                            <div key={dateStr} className={classes.selectedDateItem}>
                                <span>{displayStr}</span>
                                <IconButton size="small" onClick={() => removeDate(dateStr)} style={{ color: '#d32f2f' }}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </div>
                        );
                    })}
                    {selectedDates.length === 0 && (
                        <Typography variant="body2" color="textSecondary" style={{ fontStyle: 'italic', marginTop: 8 }}>
                            No dates selected
                        </Typography>
                    )}
                </div>
            </Grid>

            {/* Volunteer Types */}
            <Grid item xs={12} md={5}>
                <Grid container>
                    <Grid item xs={8}><Typography className={classes.sectionLabel}>Volunteer Types</Typography></Grid>
                    <Grid item xs={4} style={{ textAlign: 'right' }}><Typography className={classes.sectionLabel}>Available Slots</Typography></Grid>
                </Grid>

                <div style={{ marginTop: '8px' }}>
                    {volunteerData.map((role, idx) => (
                        <div key={idx} className={classes.volunteerRow}>
                            <Typography style={{ fontSize: '0.95rem' }}>{role.type}</Typography>
                            <div className={classes.counterContainer}>
                                <Button 
                                    className={classes.counterBtn} 
                                    onClick={() => updateVolunteerQty(idx, -1)}
                                    disabled={role.qty <= 0}
                                >-</Button>
                                <span className={classes.counterValue}>{role.qty}</span>
                                <Button 
                                    className={classes.counterBtn} 
                                    onClick={() => updateVolunteerQty(idx, 1)}
                                >+</Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add New Volunteer Type Input */}
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '16px' }}>
                    <TextField 
                        placeholder="Add Volunteer Type"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        style={{ backgroundColor: '#f9f9f9' }}
                    />
                    <IconButton 
                        onClick={handleAddRole} 
                        style={{ color: '#4C2F83', marginLeft: '8px' }}
                    >
                        <AddCircleIcon />
                    </IconButton>
                </div>
            </Grid>
        </Grid>

        {/* Footer Button */}
        <Button 
            className={classes.createBtn}
            onClick={handleSubmit}
        >
            {mode === "add" ? "Create Event" : "Save Changes"}
        </Button>

      </DialogContent>
    </Dialog>
  );
};

export default SignupEventPopup;