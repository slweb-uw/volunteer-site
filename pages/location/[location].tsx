import React, { useEffect, useState } from "react";
import { firebaseClient } from "../../firebaseClient";
import { useRouter } from "next/router";
import { NextPage } from "next";
import {
  createStyles,
  CssBaseline,
  Typography,
  Select,
  MenuItem,
  withStyles,
  Grid,
  Button,
} from "@material-ui/core";
import { withSnackbar } from "notistack";
import EventCard from "../../components/eventCard";
import BootstrapInput from "components/bootstrapInput";
import Link from "next/link";
import EventModal from "components/eventModal";
import EventForm from "components/eventForm";
import { useAuth } from "auth";

interface Props {
  classes?: any;
  enqueueSnackbar: (message: string) => void;
}

const Location: NextPage<Props> = ({ classes, enqueueSnackbar }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { location } = router.query; // string of current location (ex: "Seattle")
  const [organizations, setOrganizations] = useState<string[]>([]); // organizations at this location
  const [events, setEvents] = useState<EventData[]>([]); // list of loaded events
  const [cursor, setCursor] = useState<
    firebaseClient.firestore.QueryDocumentSnapshot
  >(); // cursor to last document loaded
  const [filter, setFilter] = useState<string | undefined>();
  const [showLoadButton, setShowLoadButton] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<EventData>();
  const [sortField, setSortField] = useState<string>("timestamp");

  useEffect(() => {
    firebaseClient.analytics().logEvent("location_page_visit");
  }, []);

  useEffect(() => {
    // Load initial events
    if (location) {
      reloadEvents(undefined, "timestamp");
      if (typeof location === "string") {
        // pull organizations for this location from the metadata cache
        firebaseClient
          .firestore()
          .collection("cache")
          .doc(location)
          .get()
          .then((doc) => setOrganizations(Object.keys(doc.data())));
      }
    }
  }, [router]);

  const getOrder = (curSort: string) => {
    return curSort === "timestamp" ? "desc" : "asc";
  };

  // Append more events from Firestore onto this page from position of cursor
  const loadEvents = async () => {
    if (cursor === null) {
      return;
    }
    const order = getOrder(sortField);
    const next = filter
      ? await firebaseClient // There is a category filter, apply it
          .firestore()
          .collection("/" + location)
          .where("organization", "==", filter)
          .orderBy(sortField, order)
          .startAfter(cursor)
          .limit(10)
          .get()
      : await firebaseClient // There is no filter
          .firestore()
          .collection("/" + location)
          .orderBy(sortField, order)
          .startAfter(cursor)
          .limit(10)
          .get();
    const eventsToAdd: EventData[] = [];
    next.docs.forEach((document) => {
      let eventDoc = document.data() as EventData;
      eventDoc.id = document.id; // adds event id to the EventData object

      eventsToAdd.push(eventDoc);
      // eventsToAdd.push(document.data() as EventData);
    });
    setCursor(next.docs[next.docs.length - 1]);
    setEvents((prevEvents) => [...prevEvents, ...eventsToAdd]);
    setShowLoadButton(eventsToAdd.length === 10);
  };

  // Clear events and replace with 10 events using given filter and sort field
  const reloadEvents = async (
    curFilter: string | undefined,
    curSort: string
  ) => {
    const order = getOrder(curSort);
    const next = curFilter
      ? await firebaseClient
          .firestore()
          .collection("/" + location)
          .where("organization", "==", curFilter)
          .orderBy(curSort, order)
          .limit(10)
          .get()
      : await firebaseClient
          .firestore()
          .collection("/" + location)
          .orderBy(curSort, order)
          .limit(10)
          .get();
    const newEvents: EventData[] = [];
    next.docs.forEach((document) => {
      let eventDoc = document.data() as EventData;
      eventDoc.id = document.id; // adds event id to the EventData object

      // newEvents.push(document.data() as EventData);
      newEvents.push(eventDoc);
    });
    newEvents.sort((a, b) => a.Title.localeCompare(b.Title))
    setCursor(next.docs[next.docs.length - 1]);
    setEvents(newEvents);
    setShowLoadButton(newEvents.length === 10);
  };

  // Filter events by given category, updates events
  const filterByCategory = async (newFilter: string | undefined) => {
    setFilter(newFilter);
    reloadEvents(newFilter, sortField);
  };

  // Change field we're sorting by, updates events
  const changeSortField = async (newSortField: string) => {
    setSortField(newSortField);
    reloadEvents(filter, newSortField);
  };

  return (
    <div className={classes.page}>
      <CssBaseline />
      <Typography variant="h3" gutterBottom>
        Opportunities in {location}
      </Typography>
      <EventModal
        open={modalOpen}
        event={selectedEvent}
        handleClose={() => setModalOpen(false)}
      />

      <div style={{ marginTop: "2em", marginBottom: "2em" }}>
        <Typography display="inline">
          <b>Filters</b>{" "}
        </Typography>
        <span style={{ marginLeft: "1em" }}>
          <Typography display="inline">Category: </Typography>
          <Select
            value={filter}
            onChange={(e) => {
              filterByCategory(e.target.value as string | undefined);
            }}
            style={{ width: 200 }}
            displayEmpty
            input={<BootstrapInput />}
          >
            <MenuItem>Show All</MenuItem>
            {organizations.map((organization) => (
              <MenuItem value={organization}>{organization}</MenuItem>
            ))}
          </Select>
        </span>
        <span style={{ marginLeft: "1em" }}>
          <Typography display="inline">Sort By: </Typography>
          <Select
            value={sortField}
            onChange={(e) => {
              changeSortField(e.target.value as string);
            }}
            style={{ width: 200 }}
            input={<BootstrapInput />}
          >
            <MenuItem value={"timestamp"}>Date Added</MenuItem>
            <MenuItem value={"Title"}>Title</MenuItem>
          </Select>
        </span>
        <div style={{ textAlign: "right" }}>
          <Button
            variant="contained"
            color="primary"
            style={{
              marginTop: "2em",
            }}
          >
            <Typography variant="h6">
              <Link href="/calendar">
                <div style={{ color: "white" }}>See Calendar</div>
              </Link>
            </Typography>
          </Button>
        </div>
      </div>

      <Typography
        variant="h6"
        style={{ textAlign: "center", marginBottom: "3em", color: "#85754D" }}
      >
        <b>
          Please review our{" "}
          <i>
            <Link href={"/onboarding/"}>
              <u>
                <a style={{ color: "#85754D" }}>Onboarding Instructions</a>
              </u>
            </Link>
          </i>{" "}
          before signing up for an opportunity!
        </b>
      </Typography>

      {/* Button-Modal Module for adding new events */}
      {/* TODO: custom claims for admin access, currently hardcoded here and on backend check */}
      {user &&
        (user.email === "slweb@uw.edu" ||
          user.email === "slwebuw@gmail.com") && (
          <div style={{ paddingBottom: "2em" }}>
            <EventForm />
          </div>
        )}

      <div style={{ paddingBottom: "4em" }}>
        <Grid container spacing={6}>
          {events.map((event) => (
            <Grid item xs={12} lg={6}>
              <EventCard
                event={event}
                handleClick={() => {
                  setModalOpen(true);
                  setSelectedEvent(event);
                }}
              />
            </Grid>
          ))}
        </Grid>
        {showLoadButton && (
          <div style={{ textAlign: "center" }}>
            <Button
              variant="outlined"
              onClick={loadEvents}
              style={{
                marginTop: "2em",
              }}
            >
              <Typography variant="h6">
                <b>Load more</b>
              </Typography>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = createStyles({
  page: {
    marginLeft: "auto",
    marginRight: "auto",
    minHeight: 1000,
    maxWidth: 1500,
    width: "95%",
    paddingTop: "2em",
    paddingBottom: "5em",
  },
});

//@ts-ignore
export default withStyles(styles)(withSnackbar(Location));
