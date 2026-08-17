import React, { useState, useEffect, useMemo } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { db } from "firebaseClient";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  Timestamp,
  deleteDoc,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { useAuth } from "auth";
import { useRouter } from "next/router";
import {
  Button,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useSnackbar } from "notistack";

// Icons
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ContactPageIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import SignupEventPopup from "components/SignupEventPopup";
import { exportToCSV } from "helpers/csvExport";
import AuthorizationMessage from "pages/AuthorizationMessage";
import { EventData, VolunteerData } from "new-types";

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: "Encode Sans",
    minHeight: "80vh",
    padding: theme.spacing(5, 15),
    backgroundColor: "#fff",
  },
  headerContainer: {
    marginBottom: theme.spacing(3),
  },
  orgTitle: {
    color: "#4C2F83",
    fontWeight: 900,
    fontSize: "2rem",
    lineHeight: 1.2,
  },
  backBtn: {
    color: "#4B2E83",
    fontWeight: 700,
    textTransform: "uppercase",
    fontSize: "0.85rem",
    padding: 0,
    marginBottom: theme.spacing(2),
    minWidth: "auto",
    "&:hover": {
      backgroundColor: "transparent",
      textDecoration: "underline",
    },
    "& .MuiButton-startIcon": {
      marginRight: "4px",
    },
    "& svg": {
      fontSize: "0.8rem !important",
    },
  },
  subHeaderRow: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(3),
    color: "#666",
    marginTop: theme.spacing(1),
    fontSize: "0.9rem",
    "& div": {
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    "& svg": {
      fontSize: "1.1rem",
    },
  },
  sectionTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  eventsTitle: {
    color: "#4C2F83",
    fontWeight: 800,
    fontSize: "1.5rem",
  },
  addButton: {
    backgroundColor: "#85754D",
    color: "white",
    fontWeight: 700,
    padding: "0px 16px",
    textTransform: "uppercase",
    fontSize: "0.8rem",
    borderRadius: "4px",
    "&:hover": {
      backgroundColor: "#6d5635",
    },
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(1),
    flexWrap: "wrap",
    gap: theme.spacing(2),
  },
  searchField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "4px",
      height: "40px",
      backgroundColor: "#fff",
    },
    width: "300px",
  },
  filtersContainer: {
    display: "flex",
    gap: theme.spacing(2),
    alignItems: "center",
  },
  viewToggleContainer: {
    display: "flex",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  viewToggleButton: {
    minWidth: "auto",
    padding: "6px 14px",
    borderRadius: "999px",
    textTransform: "none",
    fontWeight: 700,
  },
  viewToggleButtonActive: {
    backgroundColor: "#4C2F83",
    color: "white",
    "&:hover": {
      backgroundColor: "#3f276d",
    },
  },
  viewToggleButtonInactive: {
    backgroundColor: "#f3f0ea",
    color: "#4C2F83",
  },
  filterLabel: {
    fontWeight: 700,
    marginRight: theme.spacing(1),
    fontSize: "0.9rem",
  },
  filterSelect: {
    height: "35px",
    minWidth: "120px",
    backgroundColor: "#fff",
    fontSize: "0.85rem",
    color: "#666",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ccc",
    },
  },
  // Table Styles
  tableHeader: {
    backgroundColor: "#85754D",
  },
  tableHeaderCell: {
    color: "white",
    fontWeight: 700,
    padding: "10px 16px",
    fontSize: "1rem",
    borderBottom: "1px solid #000",
    borderRight: "1px solid #fff",
    "&:last-child": {
      borderRight: "none",
    },
  },
  tableCell: {
    fontSize: "0.95rem",
    color: "#333",
    borderBottom: "1px solid #eee",
  },
  tableRow: {
    "&:last-child td, &:last-child th": {
      borderBottom: 0,
    },
  },
  emptyStateBox: {
    border: "1px solid #8d7046",
    borderTop: "none",
    padding: theme.spacing(6),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontWeight: 600,
    color: "#333",
    backgroundColor: "#fff",
    borderRadius: "0 0 8px 8px",
  },
  footerNote: {
    marginTop: theme.spacing(2),
    fontSize: "0.9rem",
    color: "#333",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh",
  },
}));

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const TIME_OPTIONS = Array.from({ length: 24 }, (_, hour) => {
  const value = `${String(hour).padStart(2, "0")}:00`;
  const label = new Date(2000, 0, 1, hour).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return { value, label };
});

const EventAdmin = () => {
  const classes = useStyles();
  const router = useRouter();
  const { location, project } = router.query;
  const { user, isAdmin, isLead } = useAuth();

  const [allEvents, setAllEvents] = useState<EventData[]>([]);
  const [editedEvent, setEditedEvent] = useState<EventData | null>(null);
  const [openEventFormPopup, setOpenEventFormPopup] = useState(false);
  const [popupMode, setPopupMode] = useState<"add" | "edit">("add");
  const [title, setTitle] = useState("");

  // Search/Filter UI placeholders
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("Any Month");
  const [filterStartTime, setFilterStartTime] = useState("");
  const [filterEndTime, setFilterEndTime] = useState("");
  const [eventView, setEventView] = useState<"active" | "past">("active");

  // Snackbar notification
  const { enqueueSnackbar } = useSnackbar();

  const getEventEndDate = (event: EventData) => {
    const eventDates =
      Array.isArray(event.dates) && event.dates.length > 0
        ? event.dates.map((timestamp: Timestamp) => timestamp.toDate())
        : event.date
          ? [event.date.toDate()]
          : [];

    if (eventDates.length === 0) return null;

    return eventDates.reduce((latest, date) =>
      date.getTime() > latest.getTime() ? date : latest,
    );
  };

  const isPastEvent = (event: EventData) => {
    const endDate = getEventEndDate(event);
    if (!endDate) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDay = new Date(endDate);
    eventDay.setHours(0, 0, 0, 0);

    return eventDay < today;
  };

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
    if (!router.isReady || !project) return;

    const eventsRef = collection(db, "events");
    const q = query(
      eventsRef,
      where("projectId", "==", project),
      orderBy("date"),
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as EventData,
        );
        setAllEvents(data);
      },
      (error) => console.error("Error fetching events:", error),
    );

    return () => unsubscribe();
  }, [router.isReady, project]);

  // Filter logic
  const filteredEvents = useMemo(() => {
    let events = allEvents.filter((event) =>
      eventView === "past" ? isPastEvent(event) : !isPastEvent(event),
    );

    // Apply simple search filter
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      events = events.filter(
        (e) =>
          e.name?.toLowerCase().includes(lowerTerm) ||
          e.projectName?.toLowerCase().includes(lowerTerm) ||
          title.toLowerCase().includes(lowerTerm),
      );
    }

    // Apply month filter
    if (filterMonth !== "Any Month") {
      const monthIndex = MONTH_NAMES.indexOf(filterMonth);
      events = events.filter((e) => {
        const matchesPrimary = e.date.toDate().getMonth() === monthIndex;
        const matchesAny =
          Array.isArray(e.dates) &&
          e.dates.some((d) => d.toDate().getMonth() === monthIndex);
        return matchesPrimary || matchesAny;
      });
    }

    // Apply start/end time filters
    if (filterStartTime) {
      events = events.filter((e) => e.startTime >= filterStartTime);
    }
    if (filterEndTime) {
      events = events.filter((e) => e.endTime <= filterEndTime);
    }

    return events;
  }, [
    allEvents,
    eventView,
    searchTerm,
    title,
    filterMonth,
    filterStartTime,
    filterEndTime,
  ]);

  const handleFilterStartTimeChange = (value: string) => {
    setFilterStartTime(value);
    if (value && filterEndTime && filterEndTime <= value) {
      setFilterEndTime("");
    }
  };

  const handleFilterEndTimeChange = (value: string) => {
    setFilterEndTime(value);
    if (value && filterStartTime && filterStartTime >= value) {
      setFilterStartTime("");
    }
  };

  const fetchVolunteerData = async (eventToExport: EventData) => {
    if (!eventToExport) return;
    try {
      const volunteerRef = collection(
        db,
        `events/${eventToExport.id}/volunteers`,
      );
      const volunteersSnapshot = await getDocs(volunteerRef);
      const volunteerData = volunteersSnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));

      return volunteerData as VolunteerData[];
    } catch (error) {
      console.error("Error fetching volunteer data:", error);
      return undefined;
    }
  };

  const handleExportCSV = async (eventToExport: EventData) => {
    const volunteers = await fetchVolunteerData(eventToExport);
    exportToCSV(volunteers ? volunteers : []);
  };

  const handleOpenEventFormPopup = (
    mode: "add" | "edit",
    eventToEdit: EventData | null,
  ) => {
    setPopupMode(mode);
    setEditedEvent(eventToEdit);
    setOpenEventFormPopup(true);
  };

  const handleDuplicateEvent = (eventToDuplicate: EventData) => {
    setPopupMode("add");
    setEditedEvent(eventToDuplicate);
    setOpenEventFormPopup(true);
  };

  const handleEventAction = async (
    mode: "add" | "edit" | "delete",
    eventData: Partial<EventData>,
    eventId?: string,
  ) => {
    if (!project || !location) return;
    const collectionPath = "events";

    try {
      if (mode === "delete" && eventId) {
        const eventRef = doc(db, collectionPath, eventId);
        await deleteDoc(eventRef);
        enqueueSnackbar("Event successfully deleted", {
          variant: "success",
          autoHideDuration: 3000,
        });
        return;
      }

      let allEventDates: Date[] = [];
      if (
        eventData.dates &&
        Array.isArray(eventData.dates) &&
        eventData.dates.length > 0
      ) {
        // Ensure they are Date objects
        allEventDates = eventData.dates.map((d: any) =>
          d.toDate ? d.toDate() : new Date(d),
        );
      } else if (eventData.date) {
        // Fallback for single date creation
        const d =
          eventData.date instanceof Date
            ? eventData.date
            : (eventData.date as any).toDate();
        allEventDates = [d];
      } else {
        enqueueSnackbar("Failed to save: No dates selected", {
          variant: "error",
          autoHideDuration: 3000,
        });
        return;
      }
      allEventDates.sort((a, b) => a.getTime() - b.getTime());
      const primaryDate = allEventDates[0];
      let calendarArr: String[] = [];
      const flatOpenings = eventData.openings || {};
      const nestedOpenings: Record<string, any> = {};

      allEventDates.forEach((dateObj) => {
        // add all months of the event to our calendar array
        const calendarString = `${dateObj.getFullYear()}-${dateObj.getMonth()}`;
        if (calendarArr.indexOf(calendarString) == -1) {
          calendarArr.push(calendarString);
        }

        const dateKey = dateObj.toISOString().split("T")[0];
        const firstKey = Object.keys(flatOpenings)[0];
        if (firstKey && firstKey.startsWith("20")) {
          nestedOpenings[dateKey] = flatOpenings[dateKey] || {};
        } else {
          nestedOpenings[dateKey] = { ...flatOpenings };
        }
      });

      const dataToSave = {
        ...eventData,
        // Save the array of Timestamps
        dates: allEventDates.map((d) => Timestamp.fromDate(d)),
        // Save primary date for compatibility
        date: Timestamp.fromDate(primaryDate),
        // Save the nested openings structure
        openings: nestedOpenings,
        projectId: project,
        projectName: title,
        location: location as string,
        calendar: calendarArr,
      };

      if (mode === "add") {
        await addDoc(collection(db, collectionPath), dataToSave);
        enqueueSnackbar("Event successfully created", {
          variant: "success",
          autoHideDuration: 3000,
        });
      } else if (mode === "edit" && eventId) {
        const eventRef = doc(db, collectionPath, eventId);
        await setDoc(eventRef, dataToSave, { merge: true });
        enqueueSnackbar("Event successfully updated", {
          variant: "success",
          autoHideDuration: 3000,
        });
      }
      setOpenEventFormPopup(false);
    } catch (error) {
      console.error(`Error ${mode}ing event:`, error);
      enqueueSnackbar("Error handling event", {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };

  // Helper to format Time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const parseTimeStr = (baseDate: Date, timeString?: string) => {
    if (!timeString) return baseDate;

    const dateCopy = new Date(baseDate);
    const [hours, minutes] = timeString.split(":").map(Number);

    dateCopy.setHours(hours);
    dateCopy.setMinutes(minutes);

    return dateCopy;
  };

  // Helper to format Date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!router.isReady) {
    return <div className={classes.loadingContainer}>Loading...</div>;
  }

  if (!isAdmin && !isLead) {
    return <AuthorizationMessage user={user} />;
  }

  return (
    <div className={classes.root}>
      <Button
        className={classes.backBtn}
        startIcon={<ArrowBackIosNewIcon />}
        onClick={() => router.back()}
      >
        BACK
      </Button>
      {/* HEADER SECTION */}
      <div className={classes.headerContainer}>
        <Typography className={classes.orgTitle}>
          {title} - Add Events
        </Typography>
        <div className={classes.subHeaderRow}>
          <div>
            <LocationOnIcon /> {location}
          </div>
          <div>
            <ContactPageIcon /> Contact
          </div>
        </div>
      </div>

      {/* EVENTS TITLE & ADD BUTTON */}
      <div className={classes.sectionTitleRow}>
        <Typography className={classes.eventsTitle}>Events</Typography>
        <Button
          className={classes.addButton}
          onClick={() => handleOpenEventFormPopup("add", null)}
          startIcon={<span>+</span>}
        >
          Add New Event
        </Button>
      </div>

      <div className={classes.viewToggleContainer}>
        <Button
          className={`${classes.viewToggleButton} ${eventView === "active" ? classes.viewToggleButtonActive : classes.viewToggleButtonInactive}`}
          onClick={() => setEventView("active")}
        >
          Active Events
        </Button>
        <Button
          className={`${classes.viewToggleButton} ${eventView === "past" ? classes.viewToggleButtonActive : classes.viewToggleButtonInactive}`}
          onClick={() => setEventView("past")}
        >
          Past Events
        </Button>
      </div>

      {/* SEARCH & FILTERS TOOLBAR */}
      <div className={classes.toolbar}>
        <TextField
          placeholder="Search..."
          variant="outlined"
          size="small"
          className={classes.searchField}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon style={{ color: "#ccc" }} />
              </InputAdornment>
            ),
          }}
        />

        <div className={classes.filtersContainer}>
          <span className={classes.filterLabel}>Filters:</span>

          <Select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value as string)}
            displayEmpty
            className={classes.filterSelect}
            variant="outlined"
          >
            <MenuItem value="Any Month">Any Month</MenuItem>
            {MONTH_NAMES.map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </Select>

          <Select
            value={filterStartTime}
            onChange={(e) => handleFilterStartTimeChange(e.target.value as string)}
            displayEmpty
            className={classes.filterSelect}
            variant="outlined"
          >
            <MenuItem value="">Any Start Time</MenuItem>
            {TIME_OPTIONS.map((opt) => (
              <MenuItem
                key={opt.value}
                value={opt.value}
                disabled={!!filterEndTime && opt.value >= filterEndTime}
              >
                {opt.label}
              </MenuItem>
            ))}
          </Select>

          <Select
            value={filterEndTime}
            onChange={(e) => handleFilterEndTimeChange(e.target.value as string)}
            displayEmpty
            className={classes.filterSelect}
            variant="outlined"
          >
            <MenuItem value="">Any End Time</MenuItem>
            {TIME_OPTIONS.map((opt) => (
              <MenuItem
                key={opt.value}
                value={opt.value}
                disabled={!!filterStartTime && opt.value <= filterStartTime}
              >
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>

      {/* DATA TABLE */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid #85754D",
          borderRadius: filteredEvents.length > 0 ? "8px" : "8px 8px 0 0",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow className={classes.tableHeader}>
              <TableCell className={classes.tableHeaderCell}>
                Event Name
              </TableCell>
              <TableCell className={classes.tableHeaderCell}>
                Start Date
              </TableCell>
              <TableCell className={classes.tableHeaderCell}>
                Start Time
              </TableCell>
              <TableCell className={classes.tableHeaderCell}>
                End Time
              </TableCell>
              <TableCell className={classes.tableHeaderCell} align="right">
                Options
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEvents.map((ev) => {
              const eventDate = ev.date.toDate();

              const startTime = parseTimeStr(eventDate, ev.startTime);
              const endTime = parseTimeStr(eventDate, ev.endTime);

              return (
                <TableRow key={ev.id} hover className={classes.tableRow}>
                  <TableCell
                    className={classes.tableCell}
                    style={{ fontWeight: 600 }}
                  >
                    {ev.name || title || "Event Name"}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {formatDate(eventDate)}
                    {ev.dates?.length > 1 && (
                      <Tooltip
                        title={ev.dates
                          .map((t) => formatDate(t.toDate()))
                          .join(", ")}
                      >
                        <span
                          style={{
                            color: "#666",
                            cursor: "help",
                            display: "flex",
                            marginLeft: 10,
                          }}
                        >
                          +{ev.dates.length - 1} more
                        </span>
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {formatTime(startTime)}
                  </TableCell>

                  <TableCell className={classes.tableCell}>
                    {formatTime(endTime)}
                  </TableCell>
                  <TableCell className={classes.tableCell} align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleExportCSV(ev)}
                      title="Export"
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenEventFormPopup("edit", ev)}
                      title="Edit"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDuplicateEvent(ev)}
                      title="Duplicate"
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this event?",
                          )
                        ) {
                          handleEventAction("delete", {}, ev.id);
                        }
                      }}
                      title="Delete"
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* EMPTY STATE */}
      {filteredEvents.length === 0 && (
        <div className={classes.emptyStateBox}>
          No events have been created yet. Click on “Add New Event” to create an
          event.
        </div>
      )}

      {/* FOOTER NOTE (This is currently not accurate information, but was in figma design doc) */}
      <Typography className={classes.footerNote}>
        Note: All sign-ups are closed 2 days before the event.
      </Typography>

      <SignupEventPopup
        open={openEventFormPopup}
        close={() => setOpenEventFormPopup(false)}
        mode={popupMode}
        event={editedEvent}
        handleEventAction={handleEventAction}
      />
    </div>
  );
};

export default EventAdmin;
