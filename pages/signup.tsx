import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import firebase from "firebase/app";
import "firebase/firestore";
import { useAuth } from "auth";
import { 
        Button, 
        Grid,
} from "@material-ui/core";
import AddRounded from "@mui/icons-material/AddRounded";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SettingsIcon from '@mui/icons-material/Settings';
import DownloadIcon from '@mui/icons-material/Download';

import AddEventPopup from 'components/AddEventPopup';
import EditEventPopup from 'components/EditEventPopup';
import VolunteerPopup from 'components/VolunteerSignupPopup';
import { exportToCSV } from 'helpers/csvExport';

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: "Encode Sans Compressed",
    minHeight: "65vh"
  },
  title: {
    fontWeight: 700,
    textAlign: "center",
  },
  header: {
    justifyContent: "center",
    maxWidth: "90%",
    margin: "0 auto",
    marginTop : "2rem",
    marginBottom: theme.spacing(6),
  },
  headerButton: {
    margin: theme.spacing(0, 3),
    textTransform: "none",
    height: 35,
  },
  roleButton : {
    margin: theme.spacing(0, 3),
    minWidth: 150, 
    flexGrow: 1,
    height: 50,
    borderRadius: "15",
    "&.Mui-disabled": {
      color: "#333333",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  buttonScroll : {
    width: "100%",
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  gridContainer: {
    width: "90%",
    margin: "0 auto",
    marginBottom: "2rem",
    justifyContent: "center",
  },
  message: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 600,
    height: '80vh',
  },
  arrowButton: {
    display: "flex",
    alignItems: "center",
    height: 35,
  },
}));

interface Volunteer {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  studentDiscipline: string;
}

interface Event {
  id: string;
  date: Date;
  volunteerTypes: string[];
  volunteerQty: string[];
  volunteers: { [key: string]: Volunteer[] } | null;
}

const Signup = () => {
  const classes = useStyles();
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [authorizedUsers, setAuthorizedUsers] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [authComplete, setAuthComplete] = useState(false);
  const [openAddEventPopup, setOpenAddEventPopup] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openEditEventPopup, setOpenEditEventPopup] = useState(false);
  const [editedEvent, setEditedEvent] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [openVolunteerPopup, setOpenVolunteerPopup] = useState(false);

  const [startIndex, setStartIndex] = useState(0);
  const endIndex = startIndex + 5;

  function checkEmail(email, authorizedUsers) {
    for (let i = 0; i < authorizedUsers.length; i++) {
      if (authorizedUsers[i].email === email) {
        return true;
      }
    }
    return false;
  }

  useEffect(() => {
    const unsubscribe = firebase.
      firestore()
      .collection("Admins")
      .onSnapshot((snapshot) => {
        const adminsData = [];
        snapshot.forEach((doc) => {
          adminsData.push({id: doc.id, ...doc.data() });
        });
        adminsData.sort((a, b) => (a.email > b.email ? 1 : -1));
        setAdmins(adminsData);
      });
      return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("Volunteers")
      .onSnapshot((snapshot) => {
        const userData = [];
        snapshot.forEach((doc) => {
          userData.push({ id: doc.id, ...doc.data() });
        });
        setAuthorizedUsers(userData);
    });
  
    return unsubscribe;
  }, []);
  
  useEffect(() => {
    setIsAuthorized(true);

    if (!user || (!user.email.endsWith("@uw.edu") && !checkEmail(user.email, authorizedUsers))) {
      setIsAuthorized(false);
    }

    setAuthComplete(true);
  }, [user, authorizedUsers]);

  if (!authComplete) {
    return null;
  }

  if (!isAuthorized) {
    return (
      <div className={classes.root}>
        <div className={classes.message}>
          You are not authorized to access this page. &nbsp;
          {!user && <span style={{ color: "red" }}>Please login.</span>}
        </div>
      </div>
    );
  }

  const handleDateChange = (date) => {
    setCurrentDate(date);
    const selectedEvent = events.find(event => event.date === date);
    setSelectedEvent(selectedEvent);
  };

  const addEvent = (newEvent) => {
    const existingEvent = events.find(event => {
      const existingEventDate = new Date(event.date);
      existingEventDate.setHours(0, 0, 0, 0);
  
      const newEventDate = new Date(newEvent.date);
      newEventDate.setHours(0, 0, 0, 0);
  
      return existingEventDate.getTime() === newEventDate.getTime();
    });
  
    if (existingEvent) {
      alert('An event already exists for this date. Please choose a different date.');
      return;
    }
  
    newEvent.volunteers = {};
  
    setEvents(prevEvents => [...prevEvents, newEvent]);
    setSelectedEvent(newEvent); 
    setCurrentDate(newEvent.date);
  };

  const handleOpenEditEventPopup = (event) => {
    if (event) {
      setEditedEvent(event);
  
      if (!selectedEvent) {
        setSelectedEvent(event);
        setCurrentDate(event.date);
      }
  
      setOpenEditEventPopup(true);
    }
  };
  
  const handleCloseEditEventPopup = () => {
    setOpenEditEventPopup(false);
  };

  const handleEditEvent = (editedEventData) => {
    const updatedEvents = events.map(event => {
      if (event.id === editedEventData.id) {
        return editedEventData;
      }
      return event;
    });
  
    setEvents(updatedEvents);
    setSelectedEvent(editedEventData); 
    setCurrentDate(editedEventData.date);
  
    handleCloseEditEventPopup();
  };

  const deleteEvent = () => {
    const updatedEvents = events.filter(event => event.id !== editedEvent.id);
    setEvents(updatedEvents);
    setSelectedEvent(null); 
    setCurrentDate(null);
  }

  const handleOpenVolunteerPopup = (type, index) => {
    setSelectedRole({ type, index });
    setOpenVolunteerPopup(true);
  };

  const handleCloseVolunteerPopup = () => {
    setOpenVolunteerPopup(false);
  };

  const handleAddVolunteer = (volunteerData) => {
    if (selectedRole) {
    const { type, index } = selectedRole;
    const updatedEvent = { ...selectedEvent };

    if (!updatedEvent.volunteers) {
      updatedEvent.volunteers = {};
    }

    if (!updatedEvent.volunteers[type]) {
      updatedEvent.volunteers[type] = [];
    }

    updatedEvent.volunteers[type][index] = volunteerData;

    const updatedEvents = events.map(event =>
      event.id === selectedEvent.id ? updatedEvent : event
    );

    setEvents(updatedEvents);
    setSelectedEvent(updatedEvent);
  }

  handleCloseVolunteerPopup();
  };

  const isAdmin = admins.find((admin) => admin.email === user?.email);

  return (
    <div className={classes.root}>
      <h1 className={classes.title}>[Event title]</h1>
      <div className={classes.header}>
        <div className={classes.buttonScroll}>
          {startIndex > 0 && (
              <Button  
                className={classes.arrowButton} 
                variant={"outlined"}
                onClick={() => setStartIndex(Math.max(startIndex - 1, 0))}>
                <ArrowBackIosNewIcon style={{color: '#333333', height: "20px"}}/>
              </Button>
          )}
          {events.slice(startIndex, endIndex).map(event => (
            <Button
              key={event.date}
              className={classes.headerButton}
              variant={currentDate === event.date ? "contained" : "outlined"}
              color="primary"
              onClick={() => handleDateChange(event.date)}
            >
              {new Date(event.date).toLocaleDateString('en-US')}
            </Button>
          ))}
          {endIndex < events.length && (
              <Button 
                className={classes.arrowButton} 
                variant={"outlined"} 
                onClick={() => setStartIndex(Math.min(startIndex + 1, events.length - 5))}
              >
                <ArrowForwardIosIcon style={{color: '#333333', height: "20px"}}/>
              </Button>
          )}
        </div>
      </div>

      {isAdmin && (
        <div style={{ marginLeft: '15%', display: 'flex', gap: '15px', marginBottom: "1.5rem" }}>
          <Button
            variant='contained'
            color='secondary'
            onClick={() => setOpenAddEventPopup(true)} 
          >
            ADD
          </Button>
          <Button
            variant='contained'
            color='secondary'
            onClick={() => handleOpenEditEventPopup(selectedEvent)}
          >
            <SettingsIcon />
          </Button>
          <Button
            variant='contained'
            color='secondary'
            onClick={() => exportToCSV(selectedEvent)}
          >
            <DownloadIcon />
          </Button>
        </div>
      )}
      
      <Grid container className={classes.gridContainer}>
        {selectedEvent && selectedEvent.volunteerTypes.map((type, index) => (
          <Grid item key={index}>
            <Button
              className={classes.roleButton}
              variant={"contained"}
              color="primary"
              disabled
            >
              {type}
            </Button>

            {selectedEvent.volunteers && selectedEvent.volunteers[type] && (
              selectedEvent.volunteers[type].map((volunteer, rowIndex) => (
                <Button
                  key={rowIndex}
                  className={classes.roleButton}
                  variant={"outlined"}
                  style={{ marginBottom: "0.5rem", marginTop: "0.5rem" }}
                  disabled
                >
                  {volunteer.firstName} {volunteer.lastName.charAt(0)}.
                </Button>
              ))
            )}

            {(!selectedEvent.volunteers[type] || selectedEvent.volunteers[type].length < Number(selectedEvent.volunteerQty[index])) && (
              <div key={index} color="#d5d5d5">
                <Button
                  className={classes.roleButton}
                  variant={"outlined"}
                  style={{ marginBottom: "0.5rem", marginTop: "0.5rem" }}
                  onClick={() => handleOpenVolunteerPopup(type, selectedEvent.volunteers[type]?.length || 0)}
                >
                  <AddRounded />
                </Button>
              </div>
            )}
          </Grid>
        ))}
      </Grid>
      <AddEventPopup
        open={openAddEventPopup}
        handleClose={() => setOpenAddEventPopup(false)}
        addEvent={addEvent}
      />
      <EditEventPopup
        open={openEditEventPopup}
        handleClose={handleCloseEditEventPopup}
        editedEvent={editedEvent}
        handleEditEvent={handleEditEvent}
        handleDeleteEvent={deleteEvent}
      />
      <VolunteerPopup
        open={openVolunteerPopup}
        handleClose={handleCloseVolunteerPopup}
        email={user?.email}
        addVolunteer={handleAddVolunteer}
        selectedRole={selectedRole}
      />
    </div>
  );
};

export default Signup;
