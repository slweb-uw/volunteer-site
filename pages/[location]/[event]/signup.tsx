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
        Typography,
        Link
} from "@material-ui/core";
import AddRounded from "@mui/icons-material/AddRounded";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DownloadIcon from '@mui/icons-material/Download';
import CalendarIcon from '@mui/icons-material/CalendarTodayOutlined';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import HelpIcon from '@mui/icons-material/HelpOutline';

import VolunteerInfoPopup from 'components/VolunteerInfoPopup';
import SignupEventPopup from 'components/SignupEventPopup';
import VolunteerPopup from 'components/VolunteerSignupPopup';
import SharePopup from 'components/SharePopup';
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
    width: 150, 
    flexGrow: 1,
    minHeight: 50,
    borderRadius: "15",
    whiteSpace: 'normal',
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
  const { location, event, selectedEventId } = router.query;
  const classes = useStyles();
  const { user, isAdmin, isAuthorized } = useAuth();
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
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const endIndex = Math.min(startIndex + itemsPerPage, events.length);
  const [volunteerInfo, setVolunteerInfo] = useState(null);
  const [openVolunteerInfoPopup, setOpenVolunteerInfoPopup] = useState(false);
  const [sharePopupOpen, setSharePopupOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');

  useEffect(() => {
    if (selectedEventId && events.length > 0) {
      const selectedEventFromData = events.find((e) => e.id === selectedEventId);
      if (selectedEventFromData) {
        setSelectedEvent(selectedEventFromData);
        const selectedIndex = events.findIndex((e) => e.id === selectedEvent.id);
        if (selectedIndex !== -1) {
          const page = Math.floor(selectedIndex / itemsPerPage);
          setStartIndex(page * itemsPerPage);
        }
      }
    }
  }, [selectedEventId, events]);

  useEffect(() => {
    if (selectedEvent) {
      const link = `${window.location.origin}/${location}/${event}/signup?selectedEventId=${selectedEvent?.id}`;
      window.history.pushState({}, '', link);
    }
  }, [selectedEvent, location, event]);

  useEffect(() => {
    const updateScreenSize = () => {
      let newItemsPerPage: any;
      if (window.innerWidth < 500) {
        newItemsPerPage = 1;
      } else if (window.innerWidth < 655) {
        newItemsPerPage = 2;
      } else if (window.innerWidth < 960) {
        newItemsPerPage = 3;
      } else if (window.innerWidth < 1170) {
        newItemsPerPage = 4;
      } else {
        newItemsPerPage = 5;
      }

      setItemsPerPage((prevItemsPerPage) => {
        if (newItemsPerPage !== prevItemsPerPage) {
          return newItemsPerPage;
        }
        return prevItemsPerPage;
      });
    };
  
    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => {
      window.removeEventListener('resize', updateScreenSize);
    };
  }, []);

   // Loads Title
   useEffect(() => {
    const fetchTitle= async () => {
      const documentSnapshot = await firebase
        .firestore()
        .collection("" + location)
        .doc("" + event)
        .get();

      if (documentSnapshot && documentSnapshot.data()) {
        setTitle(documentSnapshot.data().Title);
      }
    };
    fetchTitle();
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

      const selectedEventFromData = data.find((e) => e.id === selectedEventId);
      if (selectedEventFromData) {
        setSelectedEvent(selectedEventFromData);
      } else {
        setSelectedEvent(data.length > 0 ? data[0] : null);
      }
    });

  return () => unsubscribe();
};
  
  useEffect(() => {
    fetchData();
  }, [location, event]);

  if (!isAdmin && !isAuthorized) {
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
    router.push({
      pathname: router.pathname,
      query: { ...router.query, selectedEventId: selectedEvent?.id },
    });
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
      }).then(() => {
        handleCloseVolunteerPopup();
      });
    }
  };

  const handleDeleteVolunteer = (volunteer, mode: String) => {
    if (selectedRole) {
      let message = "Are you sure you want to withdraw from this role?";

      if(mode === "remove"){
        message = "Are you sure you want to remove this volunteer?";
      }

      const isConfirmed = window.confirm(message);

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
          }).then(() => {
            handleCloseVolunteerPopup();
            handleCloseVolunteerInfoPopup();
          });
      }
    }
  };

  const handleEditVolunteer = (volunteer, type) => {
    setEditedVolunteer(volunteer);
    setSelectedRole(type);
    setOpenVolunteerPopup(true);
  };
  
  const handleOpenEventFormPopup = (mode, event) => {
    setEditedEvent(event);
    if(mode === 'edit'){
      router.push({
        pathname: router.pathname,
        query: { ...router.query, selectedEventId: event.id },
      });
    }
    setOpenEventFormPopup(true);
  };

  const handleEventAction = (action, eventData) => {
    if (action === 'add') {
      eventData.date = firebase.firestore.Timestamp.fromDate(eventData.date);
      firebase.firestore().collection("" + location)
      .doc("" + event)
      .collection("signup")
      .doc(eventData.id)
      .set(eventData).then(() => {
        setSelectedEvent(eventData); 
      });
    } else if (action === 'edit') {
      firebase.firestore().collection("" + location)
      .doc("" + event)
      .collection("signup")
      .doc(eventData.id)
      .set(eventData);
      setSelectedEvent(eventData);
    } else if (action === 'delete') {
      firebase.firestore().collection("" + location)
      .doc("" + event)
      .collection("signup")
      .doc(eventData.id)
      .delete();
      setSelectedEvent(null); 
    }
  };

  const handleOpenVolunteerInfoPopup = (user, type) => {
    setVolunteerInfo(user);
    setSelectedRole(type);
    setOpenVolunteerInfoPopup(true);
  };

  const handleCloseVolunteerInfoPopup = () => {
    setVolunteerInfo(null);
    setOpenVolunteerInfoPopup(false);
  };

  const generateShareLink = () => {
    const link = `${window.location.origin}/${location}/${event}/signup?selectedEventId=${selectedEvent?.id}`;
    setShareLink(link);
    setSharePopupOpen(true);
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
                onClick={() => setStartIndex(Math.max(startIndex - itemsPerPage, 0))}>
                <ArrowBackIosNewIcon style={{color: '#333333', height: "20px"}}/>
              </Button>
          )}
          {events.slice(startIndex, endIndex).map(event => (
            <Button
              key={event.id}
              className={classes.headerButton}
              variant={selectedEvent && selectedEvent.id === event.id ? "contained" : "outlined"}
              color="primary"
              onClick={() => setSelectedEvent(event)}
            >
              {new Date(event.date.seconds * 1000).toLocaleDateString('en-US')}
              <br/>  
              {new Intl.DateTimeFormat('en-US', {hour: '2-digit', minute: '2-digit', timeZoneName: 'short'}).format(new Date(event.date.seconds * 1000))}
            </Button>
          ))}
          {endIndex < events.length && (
              <Button 
                className={classes.arrowButton} 
                variant={"outlined"} 
                onClick={() => setStartIndex(startIndex + itemsPerPage)}
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
                    ADD
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
                        EDIT
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
            <>
              <Tooltip title="Share link" arrow>
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={generateShareLink}
                >
                  Share
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
            </>
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
                        onClick={() => handleOpenVolunteerInfoPopup(volunteer, type)}
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
              {selectedEvent.volunteers && (!selectedEvent.volunteers[type] || Object.keys(selectedEvent.volunteers[type]).length < Number(selectedEvent.volunteerQty[index])) ? (
                <div key={index} color="#d5d5d5">
                  <Button
                    className={classes.roleButton}
                    variant={"outlined"}
                    style={{ marginBottom: "0.5rem", marginTop: "0.5rem", color: "gray"}}
                    onClick={() => handleOpenVolunteerPopup(type)}
                  >
                    <AddRounded /> Signup
                  </Button>
                </div>
              ):(
                <div key={index} color="#d5d5d5">
                  <Button
                    className={classes.roleButton}
                    variant={"outlined"}
                    style={{ marginBottom: "0.5rem", marginTop: "0.5rem", color: "gray"}}
                    disabled
                  >
                    FULL
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
        handleClose={handleCloseVolunteerInfoPopup}
        volunteer={volunteerInfo}
        handleDelete={handleDeleteVolunteer}
      />
      {selectedEvent && (
        <Dialog open={informationPopupOpen} onClose={() => setInformationPopupOpen(false)}>
          <DialogTitle style={{ textAlign: 'center' }}>Event Information</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: '1rem', maxWidth: '600px', minWidth: '400px', wordWrap: 'break-word' }}>
              <Typography>
                {selectedEvent.eventInformation}
              </Typography>
              <br />
              <Typography>
                <b>Contact:</b> {selectedEvent.leadEmail}
              </Typography>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5em' }}>
                <Link href={event ? "/" + location + "/" + event : "/"} style={{ textDecoration: "none" }} target="_blank">
                  <Button
                    color="secondary"
                    variant="contained"
                  >
                    More Information
                  </Button>
                </Link>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {sharePopupOpen && (
        <SharePopup onClose={() => setSharePopupOpen(false)} link={shareLink} />
      )}
    </div>
  );
};

export default Signup;