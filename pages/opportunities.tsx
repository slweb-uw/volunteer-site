import React, { useEffect, useState } from "react";
import { firebaseClient } from "../firebaseClient";
//import { useRouter } from "next/router";
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
import EventCard from "../components/eventCard";
import BootstrapInput from "components/bootstrapInput";
import Link from "next/link";
import EventModal from "components/eventModal";
import AddModifyEventModal from "components/addModifyEventModal";
import { useAuth } from "auth";
import IconBreadcrumbs from "components/breadcrumbs";

interface Props {
  classes?: any;
  enqueueSnackbar: (message: string) => void;
}

const Location: NextPage<Props> = ({ classes, enqueueSnackbar }) => {
  // const router = useRouter();
  const { user } = useAuth();
  // const { location } = router.query; // string of current location (ex: "Seattle")
  const [location, setLocation] = useState<string | undefined>();
  const locations  = ["Alaska", "Idaho", "Montana", "Seattle", "Spokane",  "Wyoming"];
  const [organizations, setOrganizations] = useState<string[]>([]); // organizations at this location
  const [events, setEvents] = useState<EventData[]>([]); // list of loaded events
  const [cursor, setCursor] = useState<
    firebaseClient.firestore.QueryDocumentSnapshot
  >(); // cursor to last document loaded
  const [filter, setFilter] = useState<string | undefined>(); 
  const [showLoadButton, setShowLoadButton] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
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
          .then((doc) => setOrganizations(Object.keys(doc.data() as string[])));
      }
    }
  }, [location]); // location selected instead of router

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
      const volunteersNeeded: string | string[] | undefined =
        eventDoc["Types of Volunteers Needed"];
      if (volunteersNeeded && typeof volunteersNeeded === "string") {
        // If string, then obsolete. Remove data
        eventDoc["Types of Volunteers Needed"] = [];
      }
      eventsToAdd.push(eventDoc);
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
      const volunteersNeeded: string | string[] | undefined =
        eventDoc["Types of Volunteers Needed"];
      if (volunteersNeeded && typeof volunteersNeeded === "string") {
        // If string, then obsolete. Remove data
        eventDoc["Types of Volunteers Needed"] = [];
      }
      newEvents.push(eventDoc);
    });
    newEvents.sort((a, b) => a.Title.localeCompare(b.Title));
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
      <IconBreadcrumbs
        crumbs={["Opportunities"]}
        parentURL={undefined}
      />
      <Typography variant="h3" gutterBottom>
        Opportunities
      </Typography>
      <EventModal
        open={modalOpen}
        event={selectedEvent}
        location={location}
        handleClose={() => setModalOpen(false)}
      />

      <div
        style={{
          marginTop: "2em",
          marginBottom: "2em",
          width: "100%",
        }}
      >
        <Grid container>
          <Grid item xs={12} sm={10}>
            <Grid container>

            <Grid item xs={12}>
                <Typography
                  gutterBottom
                  display="inline"
                  style={{ marginRight: "1em", verticalAlign: "50%" }}
                >
                  <b>Select a Location</b>{" "}
                </Typography>
                <Select
                  value={filter}
                  onChange={(e) => {
                    setLocation(e.target.value as string | undefined);
                  }}
                  style={{ width: 104 }}
                  displayEmpty
                  input={<BootstrapInput />}
                >
                  <MenuItem>Location</MenuItem>
                  {locations.map((location) => (
                    <MenuItem value={location}>{location}</MenuItem>
                  ))}
                </Select>
              </Grid>



              <Grid item xs={12}>
                <Typography
                  gutterBottom
                  display="inline"
                  style={{ marginRight: "1em" }}
                >
                  <b>Filters</b>{" "}
                </Typography>
              </Grid>
              <Grid item style={{ marginBottom: "1em" }}>
                <Typography
                  display="inline"
                  style={{ marginLeft: "1em", marginRight: "0.5rem", verticalAlign: "50%" }}
                >
                  Category{" "}
                </Typography>
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
              </Grid>
              <Grid item style={{ marginBottom: "1em" }}>
                <Typography
                  display="inline"
                  style={{ marginLeft: "1em", marginRight: "0.5rem", verticalAlign: "50%" }}
                >
                  Sort By{" "}
                </Typography>
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
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={2} style={{ textAlign: "right" }}>
            <Button
              variant="contained"
              color="primary"
              style={{
                float: "right",
              }}
            >
              <Typography>
                <Link href="/calendar">
                  <div style={{ color: "white" }}>See Calendar</div>
                </Link>
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </div>

      <Typography
        variant="h6"
        style={{ textAlign: "center", marginBottom: "3em", color: "#85754D" }}
      >
        <b>Providers: </b> Please review our{" "}
        <i>
          <Link href={"/onboarding/"}>
            <u>
              <a style={{ color: "#85754D", cursor: "pointer" }}>
                Onboarding Instructions
              </a>
            </u>
          </Link>
        </i>{" "}
        before signing up for an opportunity!
      </Typography>

      {/* Button-Modal Module for adding new events */}
      {/* TODO: custom claims for admin access, currently hardcoded here and on backend check */}
      {user &&
        (user.email === "slweb@uw.edu" ||
          user.email === "slwebuw@gmail.com") && (
          <div style={{ paddingBottom: "2em" }}>
            <AddModifyEventModal
              open={adminModalOpen}
              location={location}
              handleClose={() => {
                setAdminModalOpen(false);
              }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setAdminModalOpen(true);
              }}
            >
              Add Project
            </Button>
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
