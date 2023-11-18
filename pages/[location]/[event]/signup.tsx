import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import firebase from "firebase/app";
import "firebase/firestore";
import { useAuth } from "auth";
import { useRouter } from "next/router";
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

const Signup = () => {
  const router = useRouter();
  const { location, event } = router.query;
  const classes = useStyles();
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [authorizedUsers, setAuthorizedUsers] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [authComplete, setAuthComplete] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editedEvent, setEditedEvent] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [openVolunteerPopup, setOpenVolunteerPopup] = useState(false);
  const [openEventFormPopup, setOpenEventFormPopup] = useState(false); 
  const [informationPopupOpen, setInformationPopupOpen] = useState(false);
  const [editedVolunteer, setEditedVolunteer] = useState(null);
  const [title, setTitle] = useState('');

  const [startIndex, setStartIndex] = useState(0);
  const endIndex = startIndex + 5;
  const [volunteerInfo, setVolunteerInfo] = useState(null);
  const [openVolunteerInfoPopup, setOpenVolunteerInfoPopup] = useState(false);

   // Loads Title
   useEffect(() => {
    const fetchData = async () => {
      const documentSnapshot = await firebase
        .firestore()
        .collection("" + location)
        .doc("" + event)
        .get();

      if (documentSnapshot && documentSnapshot.data()) {
        setTitle(documentSnapshot.data().Title);
      }
    };

    fetchData();
  }, [location, event]);

  // Retrieves the events
 const fetchData = () => {
  const unsubscribe = firebase
    .firestore()
    .collection("" + location)
    .doc("" + event)
    .collection("signup")
    .onSnapshot((snapshot) => {
      const data = [];

      snapshot.forEach((doc) => {
        const eventData = { id: doc.id, ...doc.data()};
        data.push(eventData);
      });

      data.sort((a, b) => a.date - b.date);
      setEvents(data);
      setSelectedEvent(data.length > 0 ? data[0] : null);
    });

  return () => unsubscribe();
};
  
  useEffect(() => {
    fetchData();
  }, [location, event]);

  // Authentication
  const isAdmin = admins.find((admin) => admin.email === user?.email);
  useEffect(() => {
    const adminsUnsubscribe  = firebase.
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

    const volunteersUnsubscribe = firebase
    .firestore()
    .collection("Volunteers")
    .onSnapshot((snapshot) => {
      const userData = [];
      snapshot.forEach((doc) => {
        userData.push({ id: doc.id, ...doc.data() });
      });
      setAuthorizedUsers(userData);
    });

    return () => {
      adminsUnsubscribe();
      volunteersUnsubscribe();
    };
  }, []);

  useEffect(() => {
    setIsAuthorized(true);
    if (!user || (!user.email.endsWith("@uw.edu") && !authorizedUsers.some(u => u.email === user.email) && !isAdmin)) {
      setIsAuthorized(false);
    }

    setAuthComplete(true);
  }, [user, authorizedUsers]);

  if (!authComplete) {
    return <div>Loading...</div>;
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
  
  const handleOpenVolunteerPopup = (type) => {
    setSelectedRole(type);
    setOpenVolunteerPopup(true);
  };

  const handleCloseVolunteerPopup = () => {
    setSelectedRole('');
    setOpenVolunteerPopup(false);
    setEditedVolunteer(null);
  };

  const handleAddVolunteer = (volunteerData) => {
    if (selectedRole) {
      const volunteerRef = firebase.firestore()
      .collection("" + location)
      .doc("" + event)
      .collection("signup")
      .doc("" + selectedEvent?.id)
      .update({
        [`volunteers.${selectedRole}.${volunteerData.uid}`]: volunteerData
      })
      .then(() => {
        fetchData();
      });

      handleCloseVolunteerPopup();
    }
  };

  const handleDeleteVolunteer = (volunteer) => {
    if (selectedRole) {
      const isConfirmed = window.confirm("Are you sure you want to withdraw from this role?");

      if (isConfirmed) {
        const eventId = selectedEvent?.id;
        const uid = volunteer.uid;

        const volunteerRef = firebase.firestore()
          .collection(location)
          .doc(event)
          .collection('signup')
          .doc(eventId)
          .update({
            [`volunteers.${selectedRole}.${uid}`]: firebase.firestore.FieldValue.delete()
          })
          .then(() => {
            fetchData();
          });
      }
    }
    handleCloseVolunteerPopup();
  };

  const handleEditVolunteer = (volunteer, type) => {
    setEditedVolunteer(volunteer);
    setSelectedRole(type);
    setOpenVolunteerPopup(true);
  };
  
  const handleOpenEventFormPopup = (mode, event) => {
    setEditedEvent(event);
    setOpenEventFormPopup(true);
  };

  const handleEventAction = (action, eventData) => {
    if (action === 'add') {
      const firebaseTimestamp = firebase.firestore.Timestamp.fromDate(eventData.date);

      const eventDataWithTimestamp = { ...eventData, date: firebaseTimestamp };
      firebase.firestore().collection("" + location)
      .doc("" + event)
      .collection("signup")
      .doc(eventData.id)
      .set(eventData).then(() => {
        fetchData();
      });
      setSelectedEvent(eventData);
    } else if (action === 'edit') {
// Add date validation
      firebase.firestore().collection("" + location)
      .doc("" + event)
      .collection("signup")
      .doc(eventData.id)
      .set(eventData).then(() => {
        fetchData();
      });
      setSelectedEvent(events.find((e) => e.id === eventData.id));
    } else if (action === 'delete') {
      firebase.firestore().collection("" + location)
      .doc("" + event)
      .collection("signup")
      .doc(eventData.id)
      .delete().then(() => {
        fetchData();
      });
      setSelectedEvent(null); 
    }
  };

  const handleOpenVolunteerInfoPopup = (user) => {
    setVolunteerInfo(user);
    setOpenVolunteerInfoPopup(true);
  };

  return (
    <div className={classes.root}>
      <h1 className={classes.title}>{title ? title : "Loading title..."}</h1>
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
              variant={selectedEvent && selectedEvent.id === event.id ? "contained" : "outlined"}
              color="primary"
              onClick={() => setSelectedEvent(event)}
            >
              {new Date(event.date.seconds * 1000).toLocaleDateString('en-US')}
              <br/>  
              {new Date(event.date.seconds * 1000).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}
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
          {selectedEvent && (
            <div>
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
            </div>
          )}
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
                 [...Object.entries(selectedEvent.volunteers[type])].map(([key, volunteer]) => (
                  <div>
                    {user && user.email === volunteer.email ? (
                      <Button
                        className={classes.roleButton}
                        variant={"outlined"}
                        color = "primary"
                        style={{ marginBottom: "0.5rem", marginTop: "0.5rem"}}
                        onClick={() => handleEditVolunteer(volunteer, type)}
                      >
                        {volunteer.firstName} {volunteer.lastName.charAt(0)}.
                      </Button>
                    ) : (
                      isAdmin ? (
                        <Button
                        className={classes.roleButton}
                        variant={"outlined"}
                        color = "secondary"
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
              {selectedEvent.volunteers && (!selectedEvent.volunteers[type] || Object.keys(selectedEvent.volunteers[type]).length < Number(selectedEvent.volunteerQty[index])) && (
                <div key={index} color="#d5d5d5">
                  <Button
                    className={classes.roleButton}
                    variant={"outlined"}
                    style={{ marginBottom: "0.5rem", marginTop: "0.5rem"}}
                    onClick={() => handleOpenVolunteerPopup(type)}
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
        uid={user?.uid}
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