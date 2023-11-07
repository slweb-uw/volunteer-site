import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import firebase from "firebase/app";
import "firebase/firestore";
import { useAuth } from "auth";
import { 
        Button, 
        Grid,
        Tooltip,
        Dialog,
        DialogTitle,
        DialogContent,
        Typography
} from "@material-ui/core";
import AddRounded from "@mui/icons-material/AddRounded";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SettingsIcon from '@mui/icons-material/Settings';
import DownloadIcon from '@mui/icons-material/Download';
import CalendarIcon from '@mui/icons-material/CalendarTodayOutlined';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import ShareIcon from '@mui/icons-material/Share';
import HelpIcon from '@mui/icons-material/HelpOutline';

import VolunteerInfoPopup from 'components/VolunteerInfoPopup';
import SignupEventPopup from 'components/SignupEventPopup';
import VolunteerPopup from 'components/VolunteerSignupPopup';
import { exportToCSV } from 'helpers/csvExport';

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: "Encode Sans Compressed",
    minHeight: "70vh"
  },
  title: {
    fontWeight: 700,
    textAlign: "center",
  },
  header: {
    justifyContent: "center",
    maxWidth: "80%",
    margin: "0 auto",
    marginTop : "2rem",
    marginBottom: theme.spacing(6),
  },
  headerButton: {
    margin: theme.spacing(0, 3),
    textTransform: "none",
    height: 50,
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
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
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
    height: 50,
  },
}));

interface Volunteer {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  studentDiscipline: string;
  comments: string;
}

interface Event {
  id: string;
  date: Date;
  volunteerTypes: string[];
  volunteerQty: string[];
  volunteers: { [key: string]: Volunteer[] } | null;
  leadEmail: string;
  eventInformation: string;
}

const Signup = () => {
  const classes = useStyles();
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [authorizedUsers, setAuthorizedUsers] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [authComplete, setAuthComplete] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editedEvent, setEditedEvent] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [openVolunteerPopup, setOpenVolunteerPopup] = useState(false);
  const [openEventFormPopup, setOpenEventFormPopup] = useState(false); 
  const [informationPopupOpen, setInformationPopupOpen] = useState(false);
  const [editedVolunteer, setEditedVolunteer] = useState(null);

  const [startIndex, setStartIndex] = useState(0);
  const endIndex = startIndex + 5;
  const [volunteerInfo, setVolunteerInfo] = useState(null);
  const [openVolunteerInfoPopup, setOpenVolunteerInfoPopup] = useState(false);

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
    const sortedEvents = [...events].sort((a: Event, b: Event) => a.date - b.date);
    setEvents(sortedEvents);
  }, [events]);
  
  // Authentication
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
  
      const newEventDate = new Date(newEvent.date);
  
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

  const handleEditEvent = (editedEventData) => {
    const dateAlreadyExists = events.some(event => {
      if (event.id !== editedEventData.id) {
        const existingEventDate = new Date(event.date);
  
        const editedEventDate = new Date(editedEventData.date);
  
        return existingEventDate.getTime() === editedEventDate.getTime();
      }
      return false;
    });
  
    if (dateAlreadyExists) {
      alert('An event already exists for this date. Please choose a different date.');
      return;
    }
  
    const updatedEvents = events.map(event => {
      if (event.id === editedEventData.id) {
        return editedEventData;
      }
      return event;
    });
  
    setEvents(updatedEvents);
    setEditedEvent(editedEventData)
    setSelectedEvent(updatedEvents.find(event => event.id === editedEventData.id));
    setCurrentDate(editedEventData.date);
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
    setSelectedRole(null);
    setOpenVolunteerPopup(false);
    setEditedVolunteer(null);
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

  const handleDeleteVolunteer = (volunteer) => {
    if (selectedRole) {
      const { type, index } = selectedRole;
      const updatedEvent = { ...selectedEvent };
  
      if (updatedEvent.volunteers && updatedEvent.volunteers[type]) {
        const updatedVolunteers = updatedEvent.volunteers[type].filter((_, i) => i !== index);
        updatedEvent.volunteers[type] = updatedVolunteers;
      }
  
      const updatedEvents = events.map(event =>
        event.id === selectedEvent.id ? updatedEvent : event
      );
  
      setEvents(updatedEvents);
      setSelectedEvent(updatedEvent);
    }
  };

  const handleEditVolunteer = (volunteer, type, index) => {
    setEditedVolunteer(volunteer);
    setSelectedRole({ type, index });
    setOpenVolunteerPopup(true);
  };
  
  const handleOpenEventFormPopup = (mode, event) => {
    setEditedEvent(event);
    setOpenEventFormPopup(true);
  };

  const handleEventAction = (action, eventData) => {
    if (action === 'add') {
      addEvent(eventData);
    } else if (action === 'edit') {
      handleEditEvent(eventData);
    } else if (action === 'delete') {
      deleteEvent();
    }
  };

  const handleOpenVolunteerInfoPopup = (user) => {
    setVolunteerInfo(user);
    setOpenVolunteerInfoPopup(true);
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
              {event.date.toLocaleDateString('en-US')} <br/>  {event.date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 15%', marginBottom: "2.5rem"}}>
        <div style={{ display: 'flex', gap: '15px' }}>
          {isAdmin && (
            <>
                <Tooltip title="Add Event" arrow>
                  <Button
                    variant='contained'
                    color='secondary'
                    onClick={() => handleOpenEventFormPopup('add', null)}
                  >
                    <AddRounded />
                  </Button>
                </Tooltip>
                {selectedEvent && (
                  <>
                    <Tooltip title="Modify Event" arrow>
                      <Button
                        variant='contained'
                        color='secondary'
                        onClick={() => handleOpenEventFormPopup('edit', selectedEvent)}
                      >
                        <SettingsIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Download Event Information" arrow>
                      <Button
                        variant='contained'
                        color='secondary'
                        onClick={() => exportToCSV(selectedEvent)}
                      >
                        <DownloadIcon />
                      </Button>
                    </Tooltip>
                  </>
                )}
            </>
          )}
        </div>
        <div style={{display: 'flex', gap: '15px' }}>
          <Tooltip title="share" arrow>
            <Button
              variant='outlined'
              color='secondary'
            >
              <ShareIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Event Information" arrow>
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => setInformationPopupOpen(true)}
            >
              <InfoIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Help" arrow>
            <Button
              variant='outlined'
              color='secondary'
            >
              <HelpIcon />
            </Button>
          </Tooltip>
        </div>
      </div>

      {events.length == 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh', fontFamily: 'Encode Sans Compressed'}}>
          <CalendarIcon /> <b style={{marginLeft: '5px'}}>No events to load.</b>
          </div>
      ) : (
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
                  <div key={rowIndex}>
                    {user && user.email === volunteer.email ? (
                      <Button
                        className={classes.roleButton}
                        variant={"outlined"}
                        color = "primary"
                        style={{ marginBottom: "0.5rem", marginTop: "0.5rem"}}
                        onClick={() => handleEditVolunteer(volunteer, type, rowIndex)}
                      >
                        {volunteer.firstName} {volunteer.lastName.charAt(0)}.
                      </Button>
                    ) : (
                      isAdmin ? (
                        <Button
                        className={classes.roleButton}
                        variant={"outlined"}
                        style={{ marginBottom: "0.5rem", marginTop: "0.5rem" }}
                        onClick={() => handleOpenVolunteerInfoPopup(volunteer)}
                        >
                          {volunteer.firstName} {volunteer.lastName.charAt(0)}.
                        </Button>
                      ) : (
                        <Button
                        className={classes.roleButton}
                        variant={"outlined"}
                        style={{ marginBottom: "0.5rem", marginTop: "0.5rem" }}
                        disabled
                        >
                          {volunteer.firstName} {volunteer.lastName.charAt(0)}.
                        </Button>
                      )
                    )}
                  </div>
                ))
              )}
              {selectedEvent.volunteers && (!selectedEvent.volunteers[type] || selectedEvent.volunteers[type].length < Number(selectedEvent.volunteerQty[index])) && (
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
      )}
      <SignupEventPopup
        open={openEventFormPopup}
        handleClose={() => setOpenEventFormPopup(false)}
        mode={editedEvent ? 'edit' : 'add'}
        event={editedEvent}
        handleEventAction={handleEventAction}
      />
      <VolunteerPopup
        open={openVolunteerPopup}
        handleClose={handleCloseVolunteerPopup}
        email={user?.email}
        addVolunteer={handleAddVolunteer}
        volunteer={editedVolunteer} 
        onDeleteVolunteer={handleDeleteVolunteer}
      />
      <VolunteerInfoPopup
        open={openVolunteerInfoPopup}
        handleClose={() => {
          setVolunteerInfo(null);
          setOpenVolunteerInfoPopup(false);
        }}
        volunteer={volunteerInfo}
      />
      {selectedEvent && (
        <Dialog open={informationPopupOpen} onClose={() => setInformationPopupOpen(false)}>
          <DialogTitle>Event Information</DialogTitle>
          <DialogContent>
            <div style={{marginBottom: '1rem', maxWidth: '600px', minWidth: '400px', wordWrap: 'break-word'}}>
              <Typography>
                {selectedEvent.eventInformation}
              </Typography>
              <br/>
              <Typography>
                <b>Contact:</b> {selectedEvent.leadEmail}
              </Typography>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Signup;