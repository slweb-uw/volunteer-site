import React, { useState, useEffect, useMemo } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { db } from "firebaseClient";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  Timestamp,
  deleteDoc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { useAuth } from "auth";
import { useRouter } from "next/router";
import {
  Button,
  Grid,
  Tooltip,
  Switch,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CalendarIcon from "@mui/icons-material/CalendarTodayOutlined";

import SignupEventPopup from "components/SignupEventPopup";
import { exportToCSV } from "helpers/csvExport";
import AuthorizationMessage from "pages/AuthorizationMessage";
import { EventData } from "new-types";

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: "Encode Sans Compressed",
    minHeight: "70vh",
    padding: theme.spacing(2),
  },
  title: {
    fontWeight: 700,
    textAlign: "center",
    marginBottom: theme.spacing(4),
  },
  controlsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: theme.spacing(2),
    marginBottom: theme.spacing(4),
    flexWrap: "wrap",
  },
  eventListContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(1.5),
  },
  eventButton: {
    textTransform: "none",
    width: "100%",
    maxWidth: "500px",
    lineHeight: 1.2,
  },
  message: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 600,
    height: "50vh",
    gap: theme.spacing(1),
  },
}));


const EventAdmin = () => {
  const classes = useStyles();
  const router = useRouter();
  const { location, project } = router.query;
  const { user, isAdmin, isLead } = useAuth();

  const [allEvents, setAllEvents] = useState<EventData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [editedEvent, setEditedEvent] = useState<EventData | null>(null);
  const [openEventFormPopup, setOpenEventFormPopup] = useState(false);
  const [title, setTitle] = useState("");
  const [showPastEvents, setShowPastEvents] = useState(false);

  // Effect to fetch the project title
  useEffect(() => {
    if (!router.isReady || !location || !project) return;
    const fetchTitle = async () => {
      try {
        const docRef = doc(db, location as string, project as string);
        const documentSnapshot = await getDoc(docRef);
        if (documentSnapshot.exists()) {
          setTitle(documentSnapshot.data().Title);
        }
      } catch (error) {
        console.error("Error fetching title:", error);
      }
    };
    fetchTitle();
  }, [router.isReady, location, project]);

  // Effect to listen for real-time event updates from Firestore
  useEffect(() => {
    if (!router.isReady || !location || !project) return;
    const eventsRef = collection(db, `${location}/${project}/signup`);
    const q = query(eventsRef, orderBy("date"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as EventData),
        );
        setAllEvents(data);
      },
      (error) => console.error("Error fetching events:", error),
    );

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [router.isReady, location, project]);

  // Memoized hook to filter events based on the 'showPastEvents' switch
  const filteredEvents = useMemo(() => {
    if (showPastEvents) {
      return allEvents;
    }
    const now = new Date();
    return allEvents.filter((e) => e.date.toDate() >= now);
  }, [allEvents, showPastEvents]);
  
  // Manage the selected event state when the filtered list changes
  useEffect(() => {
    if (selectedEvent && !filteredEvents.some(e => e.id === selectedEvent.id)) {
      setSelectedEvent(null);
    }
  }, [filteredEvents, selectedEvent]);

  const handleOpenEventFormPopup = (mode: "add" | "edit", eventToEdit: EventData | null) => {
    setEditedEvent(eventToEdit);
    setOpenEventFormPopup(true);
  };

  // Main logic for Creating, Updating, and Deleting events in Firestore
  const handleEventAction = async (
    mode: "add" | "edit" | "delete",
    eventData: Partial<EventData>, // Use Partial<EventData> for flexibility with form data
    eventId?: string,
  ) => {
    if (!location || !project) return;
    const collectionPath = `${location}/${project}/signup`;

    try {
      if (mode === "add") {
        await addDoc(collection(db, collectionPath), {
          ...eventData,
          // Ensure date from form is converted to Firestore Timestamp
          date: Timestamp.fromDate(eventData.date as any),
        });
        alert("Event added successfully!");
      } else if (mode === "edit" && eventId) {
        const eventRef = doc(db, collectionPath, eventId);
        const dataToUpdate = {
            ...eventData,
            date: Timestamp.fromDate(eventData.date as any),
        };
        await setDoc(eventRef, dataToUpdate, { merge: true });
        alert("Event updated successfully!");
      } else if (mode === "delete" && eventId) {
        if (window.confirm("Are you sure you want to delete this event?")) {
          const eventRef = doc(db, collectionPath, eventId);
          await deleteDoc(eventRef);
          setSelectedEvent(null);
          alert("Event deleted successfully!");
        }
      }
      setOpenEventFormPopup(false);
    } catch (error) {
      console.error(`Error ${mode}ing event:`, error);
      alert(`Failed to ${mode} event. Please try again.`);
    }
  };

  if (!router.isReady) {
    return <div className={classes.message}>Loading...</div>;
  }

  // Authorization Check: Only admins and leads can see this page
  if (!isAdmin && !isLead) {
    return <AuthorizationMessage user={user} />;
  }

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.title}>
        {title || "Event Management"}
      </Typography>

      <div className={classes.controlsContainer}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleOpenEventFormPopup("add", null)}
        >
          Add New Event
        </Button>
        <Tooltip title="Toggle past events" arrow>
            <Button variant="outlined">
                <Switch
                    checked={showPastEvents}
                    onChange={() => setShowPastEvents(!showPastEvents)}
                    color="primary"
                />
                Show Past Events
            </Button>
        </Tooltip>
        {selectedEvent && (
            <Tooltip title="Download Event Information" arrow>
                <Button
                    variant="contained"
                    onClick={() => exportToCSV(selectedEvent)}
                    startIcon={<DownloadIcon />}
                >
                    Export Selected
                </Button>
            </Tooltip>
        )}
      </div>

      {filteredEvents.length === 0 ? (
        <div className={classes.message}>
          <CalendarIcon />
          <Typography>No events to display.</Typography>
        </div>
      ) : (
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={8} lg={6} className={classes.eventListContainer}>
                {filteredEvents.map((ev) => (
                    <Button
                        key={ev.id}
                        className={classes.eventButton}
                        variant={selectedEvent?.id === ev.id ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => {
                            setSelectedEvent(ev);
                            handleOpenEventFormPopup("edit", ev)
                        }}
                    >
                    {/* ev.date is a Firestore Timestamp */}
                    {ev.date.toDate().toLocaleDateString("en-US", {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                    })}
                    </Button>
                ))}
            </Grid>
        </Grid>
      )}

      <SignupEventPopup
        open={openEventFormPopup}
        close={() => setOpenEventFormPopup(false)}
        mode={editedEvent ? "edit" : "add"}
        event={editedEvent}
        handleEventAction={handleEventAction}
      />
    </div>
  );
};

export default EventAdmin;