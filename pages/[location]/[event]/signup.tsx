import React, { useState, useEffect } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { db } from "firebaseClient";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteField,
  setDoc,
  Timestamp,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
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
  Link,
  Switch,
} from "@mui/material";
import AddRounded from "@mui/icons-material/AddRounded";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DownloadIcon from "@mui/icons-material/Download";
import CalendarIcon from "@mui/icons-material/CalendarTodayOutlined";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import HelpIcon from "@mui/icons-material/HelpOutline";

import VolunteerInfoPopup from "components/VolunteerInfoPopup";
import SignupEventPopup from "components/SignupEventPopup";
import VolunteerPopup from "components/VolunteerSignupPopup";
import SharePopup from "components/SharePopup";
import { exportToCSV } from "helpers/csvExport";
import AuthorizationMessage from "pages/AuthorizationMessage";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { handleHelpButtonClick } from "helpers/navigation";

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: "Encode Sans Compressed",
    minHeight: "70vh",
  },
  title: {
    fontWeight: 700,
    textAlign: "center",
  },
  header: {
    justifyContent: "center",
    maxWidth: "80%",
    margin: "0 auto",
    marginTop: "2rem",
    marginBottom: theme.spacing(6),
    "@media only screen and (max-width: 900px)": {
      width: "100%",
    },
  },
  headerButton: {
    margin: theme.spacing(0, 3),
    textTransform: "none",
    height: 50,
    lineHeight: 1.1,
  },
  roleButton: {
    margin: theme.spacing(0, 2),
    width: 150,
    flexGrow: 1,
    minHeight: 50,
    borderRadius: "15",
    whiteSpace: "normal",
    fontSize: "12px",
    "&.Mui-disabled": {
      color: "#333333",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  buttonScroll: {
    width: "100%",
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  gridContainer: {
    width: "80%",
    margin: "0 auto",
    padding: "0 0 0 0",
    marginBottom: "2rem",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "10px",
    justifyContent: "center",
    "@media only screen and (max-width: 900px)": {
      width: "100%",
      display: "flex",
      flexWrap: "wrap",
    },
  },
  message: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 600,
    height: "80vh",
  },
  arrowButton: {
    display: "flex",
    alignItems: "center",
    height: 50,
  },
}));

const Signup = () => {
  const handleHelpButtonClickLocation = () => {
    handleHelpButtonClick(router, "fromSignUpPage");
    close();
  };
  const router = useRouter();
  const { location, event, selectedEventId } = router.query;
  const classes = useStyles();
  const { user, isAdmin, isAuthorized, isLead } = useAuth();
  const [unfilteredEvents, setUnfilteredEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editedEvent, setEditedEvent] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [openVolunteerPopup, setOpenVolunteerPopup] = useState(false);
  const [openEventFormPopup, setOpenEventFormPopup] = useState(false);
  const [informationPopupOpen, setInformationPopupOpen] = useState(false);
  const [editedVolunteer, setEditedVolunteer] = useState(null);
  const [title, setTitle] = useState("");
  const [showPastEvents, setShowPastEvents] = useState(false);

  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const endIndex = Math.min(startIndex + itemsPerPage, events.length);
  const [volunteerInfo, setVolunteerInfo] = useState(null);
  const [openVolunteerInfoPopup, setOpenVolunteerInfoPopup] = useState(false);
  const [sharePopupOpen, setSharePopupOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (selectedEventId && events.length > 0) {
      const selectedEventFromData = events.find(
        (e) => e.id === selectedEventId,
      );
      if (selectedEventFromData) {
        setSelectedEvent(selectedEventFromData);
        const selectedIndex = events.findIndex((e) => e.id === selectedEventId);
        if (selectedIndex !== -1) {
          const page = Math.floor(selectedIndex / itemsPerPage);
          setStartIndex(page * itemsPerPage);
        }
      }
    }
  }, [selectedEventId, events, itemsPerPage]);

  useEffect(() => {
    if (selectedEvent) {
      const link = `${window.location.origin}/${location}/${event}/signup?selectedEventId=${selectedEvent?.id}`;
      window.history.pushState({}, "", link);
    }
  }, [selectedEvent, location, event]);

  // Filter events
  useEffect(() => {
    let filteredEvents = [];
    if (showPastEvents) {
      // Show all events if showPastEvents is true
      filteredEvents = unfilteredEvents;
    } else {
      // Filter out past events if showPastEvents is false
      const now = new Date();
      filteredEvents = unfilteredEvents.filter((event) => {
        const eventDate = new Date(event.date.seconds * 1000);
        return eventDate >= now;
      });
    }

    setEvents(filteredEvents);

    // Reset selected event if it becomes filtered out
    if (!filteredEvents.some((event) => event.id === selectedEventId)) {
      setSelectedEvent(filteredEvents[0] || null);
    }
  }, [unfilteredEvents, showPastEvents, selectedEventId]);

  useEffect(() => {
    const updateScreenSize = () => {
      let newItemsPerPage: any;
      if (window.innerWidth < 520) {
        newItemsPerPage = 1;
      } else if (window.innerWidth < 818) {
        newItemsPerPage = 2;
      } else if (window.innerWidth < 1030) {
        newItemsPerPage = 3;
      } else if (window.innerWidth < 1172) {
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
    window.addEventListener("resize", updateScreenSize);
    return () => {
      window.removeEventListener("resize", updateScreenSize);
    };
  }, []);

  // Loads Title
  useEffect(() => {
    const fetchTitle = async () => {
      const documentSnapshot = await getDoc(doc(db, location + "", event + ""));
      if (documentSnapshot && documentSnapshot.data()) {
        setTitle(documentSnapshot.data().Title);
      }
    };
    fetchTitle();
  }, [location, event]);

  // Retrieves the events

  useEffect(() => {
    const fetchData = () => {
      const eventsRef = collection(db, `${location}/${event}/signup`);
      const data = [];
      getDocs(eventsRef).then((docs) => {
        docs.forEach((doc) => {
          const eventData = { id: doc.id, ...doc.data() };
          data.push(eventData);
        });

        data.sort((a, b) => a.date - b.date);
        setUnfilteredEvents(data);
      });
    };
    fetchData();
  }, [location, event]);

  if (!isAdmin && !isAuthorized && !isLead) {
    return <AuthorizationMessage user={user} />;
  }

  const handleOpenVolunteerPopup = (type) => {
    setSelectedRole(type);
    setOpenVolunteerPopup(true);
  };

  const handleCloseVolunteerPopup = () => {
    setSelectedRole("");
    setOpenVolunteerPopup(false);
    setEditedVolunteer(null);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, selectedEventId: selectedEvent?.id },
    });
  };

  const handleAddVolunteer = (volunteerData) => {
    if (selectedRole) {
      const existingRolesOnEvent = selectedEvent.volunteers || {};
      const hasSignedUpForEvent = Object.keys(existingRolesOnEvent).some(
        (role) =>
          role !== selectedRole &&
          Object.keys(existingRolesOnEvent[role]).some(
            (uid) =>
              existingRolesOnEvent[role][uid].date === volunteerData.date,
          ),
      );

      if (hasSignedUpForEvent) {
        alert("You have already signed up for another role on this event.");
      } else {
        const eventRef = doc(
          db,
          `${location}/${event}/signup/${selectedEvent?.id}`,
        );
        updateDoc(eventRef, {
          [`volunteers.${selectedRole}.${volunteerData.uid}`]: volunteerData,
        }).then(() => {
          handleCloseVolunteerPopup();
        });
      }
    }
  };

  const handleDeleteVolunteer = (volunteer, mode: String) => {
    if (selectedRole) {
      let message = "Are you sure you want to withdraw from this role?";

      if (mode === "remove") {
        message = "Are you sure you want to remove this volunteer?";
      }

      const isConfirmed = window.confirm(message);

      if (isConfirmed) {
        const eventId = selectedEvent?.id;
        const uid = volunteer.uid;
        const eventRef = doc(
          db,
          `${location}/${event}/signup/${selectedEvent?.id}`,
        );
        updateDoc(eventRef, {
          [`volunteers.${selectedRole}.${uid}`]: deleteField(),
        }).then(() => {
          handleCloseVolunteerPopup();
          handleCloseVolunteerInfoPopup();
        });
      }
    }
  };

  const handleEditVolunteer = (volunteer: any, type: any) => {
    setEditedVolunteer(volunteer);
    setSelectedRole(type);
    setOpenVolunteerPopup(true);
  };

  const handleOpenEventFormPopup = (mode: string, event: any) => {
    setEditedEvent(event);
    if (mode === "edit") {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, selectedEventId: event.id },
      });
    }
    setOpenEventFormPopup(true);
  };

  const handleEventAction = (action: string, eventData: any) => {
    // TODO: lets handle edit and delete this would not work any more
    // because we are not using the generate unique id
    if (action === "add") {
      addDoc(collection(db, "events"), {
        ...eventData,
        projectName: title,
        projectId: event,
        // this is for caledar query
        calendar: `${eventData.date.getFullYear()}-${eventData.date.getMonth()}`,
        date: Timestamp.fromDate(eventData.date),
        location: location,
      }).then(() => setSelectedEvent(eventData));
    } else if (action === "edit") {
      setDoc(eventRef, eventData).then(() => {
        setSelectedEvent(eventData);
      });
    } else if (action === "delete") {
      deleteDoc(eventRef);
    }
  };

  const handleOpenVolunteerInfoPopup = (user: any, type: any) => {
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
      {isMobile ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "15px", marginBottom: "1rem" }}>
            {(isAdmin || isLead) && (
              <>
                <Tooltip title="Add Event" arrow>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenEventFormPopup("add", null)}
                  >
                    ADD
                  </Button>
                </Tooltip>
                {selectedEvent && (
                  <>
                    <Tooltip title="Modify Event" arrow>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() =>
                          handleOpenEventFormPopup("edit", selectedEvent)
                        }
                      >
                        EDIT
                      </Button>
                    </Tooltip>
                    <Tooltip title="Download Event Information" arrow>
                      <Button
                        variant="contained"
                        color="secondary"
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
          <div style={{ display: "flex", gap: "15px", marginBottom: "1rem" }}>
            {selectedEvent && (
              <>
                <Tooltip title="Share link" arrow>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={generateShareLink}
                  >
                    Share
                  </Button>
                </Tooltip>
                <Tooltip title="Event Information" arrow>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<InfoIcon />}
                    onClick={() => setInformationPopupOpen(true)}
                  >
                    Info
                  </Button>
                </Tooltip>
              </>
            )}
            <Tooltip title="Help" arrow>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<HelpIcon />}
                onClick={handleHelpButtonClickLocation}
              >
                Help
              </Button>
            </Tooltip>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "0 15%",
            marginBottom: "0.5rem",
          }}
        >
          <div style={{ display: "flex", gap: "15px" }}>
            {(isAdmin || isLead) && (
              <>
                <Tooltip title="Add Event" arrow>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenEventFormPopup("add", null)}
                  >
                    ADD
                  </Button>
                </Tooltip>
                {selectedEvent && (
                  <>
                    <Tooltip title="Modify Event" arrow>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() =>
                          handleOpenEventFormPopup("edit", selectedEvent)
                        }
                      >
                        EDIT
                      </Button>
                    </Tooltip>
                    <Tooltip title="Download Event Information" arrow>
                      <Button
                        variant="contained"
                        color="secondary"
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
          <div style={{ display: "flex", gap: "15px" }}>
            {selectedEvent && (
              <>
                <Tooltip title="Share link" arrow>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={generateShareLink}
                  >
                    Share
                  </Button>
                </Tooltip>
                <Tooltip title="Event Information" arrow>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<InfoIcon />}
                    onClick={() => setInformationPopupOpen(true)}
                  >
                    Info
                  </Button>
                </Tooltip>
              </>
            )}
            <Tooltip title="Help" arrow>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<HelpIcon />}
              >
                Help
              </Button>
            </Tooltip>
          </div>
        </div>
      )}

      {(isAdmin || isLead) && (
        <div style={{ marginBottom: "1rem", marginLeft: "14.85%" }}>
          <Button variant="outlined">
            <Switch
              onClick={() => setShowPastEvents(!showPastEvents)}
              checked={showPastEvents}
              color="secondary"
            />
            Show Past Events
          </Button>
        </div>
      )}

      <div className={classes.header}>
        <div className={classes.buttonScroll}>
          {startIndex > 0 && (
            <Button
              className={classes.arrowButton}
              variant={"outlined"}
              onClick={() =>
                setStartIndex(Math.max(startIndex - itemsPerPage, 0))
              }
            >
              <ArrowBackIosNewIcon
                style={{ color: "#333333", height: "20px" }}
              />
            </Button>
          )}
          {events.slice(startIndex, endIndex).map((event) => (
            <Button
              key={event.id}
              className={classes.headerButton}
              variant={
                selectedEvent && selectedEvent.id === event.id
                  ? "contained"
                  : "outlined"
              }
              color="primary"
              onClick={() => setSelectedEvent(event)}
            >
              {new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
                new Date(event.date.seconds * 1000),
              )}
              <br />
              {new Date(event.date.seconds * 1000).toLocaleDateString("en-US")}
              <br />
              {new Intl.DateTimeFormat("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                timeZoneName: "short",
              }).format(new Date(event.date.seconds * 1000))}
            </Button>
          ))}
          {endIndex < events.length && (
            <Button
              className={classes.arrowButton}
              variant={"outlined"}
              onClick={() => setStartIndex(startIndex + itemsPerPage)}
            >
              <ArrowForwardIosIcon
                style={{ color: "#333333", height: "20px" }}
              />
            </Button>
          )}
        </div>
      </div>

      {events.length == 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "40vh",
            fontFamily: "Encode Sans Compressed",
          }}
        >
          <CalendarIcon />{" "}
          <b style={{ marginLeft: "5px" }}>No events to load.</b>
        </div>
      ) : (
        <Grid container className={classes.gridContainer}>
          {selectedEvent &&
            selectedEvent.volunteerTypes.map((type, index) => (
              <Grid item key={index}>
                <Button
                  className={classes.roleButton}
                  variant={"contained"}
                  color="primary"
                  disabled
                >
                  {type} [
                  {Object.keys(selectedEvent.volunteers[type] || {}).length}/
                  {selectedEvent.volunteerQty[index]}]
                </Button>
                {selectedEvent.volunteers &&
                  selectedEvent.volunteers[type] &&
                  [...Object.entries(selectedEvent.volunteers[type])].map(
                    ([key, volunteer]) => (
                      <div key={key}>
                        {user && user.email === volunteer.email ? (
                          <Button
                            className={classes.roleButton}
                            variant={"outlined"}
                            color="primary"
                            style={{
                              marginBottom: "0.5rem",
                              marginTop: "0.5rem",
                            }}
                            onClick={() => handleEditVolunteer(volunteer, type)}
                          >
                            {volunteer.firstName} {volunteer.lastName.charAt(0)}
                            .
                          </Button>
                        ) : isAdmin || isLead ? (
                          <Button
                            className={classes.roleButton}
                            variant={"outlined"}
                            color="secondary"
                            style={{
                              marginBottom: "0.5rem",
                              marginTop: "0.5rem",
                            }}
                            onClick={() =>
                              handleOpenVolunteerInfoPopup(volunteer, type)
                            }
                          >
                            {volunteer.firstName} {volunteer.lastName.charAt(0)}
                            .
                          </Button>
                        ) : (
                          <Button
                            className={classes.roleButton}
                            variant={"outlined"}
                            style={{
                              marginBottom: "0.5rem",
                              marginTop: "0.5rem",
                            }}
                            disabled
                          >
                            {volunteer.firstName} {volunteer.lastName.charAt(0)}
                            .
                          </Button>
                        )}
                      </div>
                    ),
                  )}
                {selectedEvent.volunteers &&
                (!selectedEvent.volunteers[type] ||
                  Object.keys(selectedEvent.volunteers[type]).length <
                    Number(selectedEvent.volunteerQty[index])) ? (
                  <div key={index}>
                    <Button
                      className={classes.roleButton}
                      variant={"outlined"}
                      style={{
                        marginBottom: "0.5rem",
                        marginTop: "0.5rem",
                        color: "gray",
                      }}
                      onClick={() => handleOpenVolunteerPopup(type)}
                      startIcon={<AddRounded />}
                    >
                      Signup
                    </Button>
                  </div>
                ) : (
                  <div key={index} color="#d5d5d5">
                    <Button
                      className={classes.roleButton}
                      variant={"outlined"}
                      style={{
                        marginBottom: "0.5rem",
                        marginTop: "0.5rem",
                        color: "gray",
                      }}
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
        close={() => setOpenEventFormPopup(false)}
        mode={editedEvent ? "edit" : "add"}
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
        <Dialog
          open={informationPopupOpen}
          onClose={() => setInformationPopupOpen(false)}
        >
          <DialogTitle style={{ textAlign: "center" }}>
            Event Information
          </DialogTitle>
          <DialogContent>
            <div
              style={{
                marginBottom: "1rem",
                maxWidth: "600px",
                minWidth: "400px",
                wordWrap: "break-word",
              }}
            >
              <Typography component="div" style={{ fontSize: "1rem" }}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: selectedEvent.eventInformation,
                  }}
                />
              </Typography>
              <br />
              <Typography style={{ fontSize: "0.9rem" }}>
                <b>Event Lead Contact:</b>{" "}
                <Link href={`mailto:${selectedEvent.leadEmail}`}>
                  {selectedEvent.leadEmail}
                </Link>
              </Typography>
              <Typography
                style={{
                  fontSize: "0.9rem",
                  color: "gray",
                  fontStyle: "italic",
                }}
              >
                For technical issues please contact{" "}
                <Link href="mailto:somserve@gmail.com">somserve@uw.edu</Link>
              </Typography>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "1.5em",
                }}
              >
                <Link
                  href={event ? "/" + location + "/" + event : "/"}
                  style={{ textDecoration: "none" }}
                  target="_blank"
                >
                  <Button color="secondary" variant="contained">
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
