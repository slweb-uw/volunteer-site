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
} from "@material-ui/core";
import { withSnackbar } from "notistack";

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
    <div>
      <CssBaseline />
      <Typography variant="h3">Opportunities in {location}</Typography>

      <Typography display="inline">View: </Typography>
      <Select
        value={filter}
        onChange={(e) => {
          filterByCategory(e.target.value as string | undefined);
        }}
        displayEmpty
      >
        <MenuItem>All</MenuItem>
        <MenuItem value={"Clinical"}>Clinical</MenuItem>
        <MenuItem value={"Advocacy"}>Advocacy</MenuItem>
      </Select>

      <Typography display="inline">Sort By:</Typography>
      <Select
        value={sortField}
        onChange={(e) => {
          changeSortField(e.target.value as string);
        }}
        displayEmpty
      >
        <MenuItem value={"timestamp"}>Date Added</MenuItem>
        <MenuItem value={"Title"}>Title</MenuItem>
      </Select>

      <div className={classes.page}>
        {events.map(
          (event) => (
            <div>{event["Title"]}</div>
          ) // TODO: event modal using event
        )}

        <button onClick={loadEvents}>Load more</button>
      </div>
    </div>
  );
};

const styles = createStyles({
  page: {
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 1000,
    width: "95%",
    paddingTop: "2em",
  },
});

//@ts-ignore
export default withStyles(styles)(withSnackbar(Location));
