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

interface Props {
  classes?: any;
  enqueueSnackbar: (message: string) => void;
}

const Location: NextPage<Props> = ({ classes, enqueueSnackbar }) => {
  const router = useRouter();
  const { location } = router.query; // string of current location (ex: "Seattle")
  const [events, setEvents] = useState<EventData[]>([]); // list of loaded events
  const [
    cursor,
    setCursor,
  ] = useState<firebaseClient.firestore.QueryDocumentSnapshot>(); // cursor to last document loaded
  const [filter, setFilter] = useState<string | undefined>();
  const [showLoadButton, setShowLoadButton] = useState<boolean>(true);
  const [sortField, setSortField] = useState<string>("timestamp");

  useEffect(() => {
    firebaseClient.analytics().logEvent("location_page_visit");
  }, []);

  useEffect(() => {
    // Load initial events
    if (location) {
      reloadEvents(undefined, "timestamp");
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
      eventsToAdd.push(document.data() as EventData);
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
      newEvents.push(document.data() as EventData);
    });
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
      <Typography variant="h3">Opportunities in {location}</Typography>

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
            <MenuItem value={"Clinical"}>Clinical</MenuItem>
            <MenuItem value={"Advocacy"}>Advocacy</MenuItem>
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
      </div>

      <Typography
        variant="h6"
        style={{ textAlign: "center", marginBottom: "3em", color: "#85754D" }}
      >
        <b>
          Make sure you have read and reviewed the{" "}
          <i>
            <Link href={"/onboarding/" + location}>
              <a style={{ color: "#85754D" }}>Onboarding Instructions</a>
            </Link>
          </i>{" "}
          before signing up for an opportunity!
        </b>
      </Typography>

      <div style={{ paddingBottom: "4em" }}>
        <Grid container spacing={6}>
          {events.map((event) => (
            <Grid item xs={6}>
              <EventCard event={event} />
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
    maxWidth: 1500,
    width: "95%",
    paddingTop: "2em",
    paddingBottom: "5em",
  },
});

//@ts-ignore
export default withStyles(styles)(withSnackbar(Location));
