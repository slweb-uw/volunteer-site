import React, { useEffect, useState } from "react";
import { firebaseAdmin } from "../../firebaseAdmin";
import { firebaseClient } from "../../firebaseClient";
import { useRouter } from "next/router";

import { GetServerSidePropsContext, NextPage } from "next";
import {
  createStyles,
  CssBaseline,
  Typography,
  withStyles,
} from "@material-ui/core";
import { withSnackbar } from "notistack";

// Get initial set of events for location
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const { location } = ctx.query; // string of current location (ex: "Seattle")
    const events: EventData[] = [];
    // First 10 documents, without any filtering, and set that to events
    const querySnapshot = await firebaseAdmin
      .firestore()
      .collection("/" + location)
      .orderBy("timestamp", "desc")
      .limit(12)
      .get();
    querySnapshot.docs.forEach((document) => {
      events.push(document.data() as EventData);
    });
    const cursor = querySnapshot.docs[querySnapshot.docs.length - 1];
    return { props: { propEvents: events, propsCursor: cursor } };
  } catch (err) {
    console.log(err);
    ctx.res.writeHead(400);
    ctx.res.end();
    return { props: {} as never };
  }
};

interface Props {
  propEvents: EventData[];
  propsCursor: firebaseClient.firestore.QueryDocumentSnapshot;
  classes?: any;
  enqueueSnackbar: (message: string) => void;
}

const Location: NextPage<Props> = ({
  propEvents,
  propsCursor,
  classes,
  enqueueSnackbar,
}) => {
  const router = useRouter();
  const { location } = router.query; // string of current location (ex: "Seattle")
  const [events, setEvents] = useState<EventData[]>(propEvents); // list of loaded events
  const [
    cursor,
    setCursor,
  ] = useState<firebaseClient.firestore.QueryDocumentSnapshot>(propsCursor); // cursor to last document loaded
  const [filter, setFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>("timestamp");

  useEffect(() => {
    firebaseClient.analytics().logEvent("location_page_visit");
  });

  // Append more events from Firestore onto this page from position of cursor
  const loadEvents = async () => {
    const next = filter
      ? await firebaseClient // There is a category filter, apply it
          .firestore()
          .collection("/" + location)
          .where("organization", "==", filter)
          .orderBy(sortField, "desc")
          .startAfter(cursor)
          .limit(10)
          .get()
      : await firebaseClient // There is no filter
          .firestore()
          .collection("/" + location)
          .orderBy(sortField, "desc")
          .startAfter(cursor)
          .limit(10)
          .get();
    const eventsToAdd: EventData[] = [];
    next.docs.forEach((document) => {
      eventsToAdd.push(document.data() as EventData);
    });
    setCursor(next.docs[next.docs.length - 1]);
    setEvents((prevEvents) => {
      eventsToAdd.forEach((event) => {
        prevEvents.push(event);
      });
      return prevEvents;
    });
  };

  // Clear events and replace with 10 events using given filter and sort field
  const reloadEvents = async (curFilter: string | null, curSort: string) => {
    const next = curFilter
      ? await firebaseClient
          .firestore()
          .collection("/" + location)
          .where("organization", "==", curFilter)
          .orderBy(curSort, "desc")
          .limit(10)
          .get()
      : await firebaseClient
          .firestore()
          .collection("/" + location)
          .orderBy(curSort, "desc")
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
  const filterByCategory = async (newFilter: string) => {
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
      <Typography variant="h2">{location}</Typography>
      <div className={classes.page}>
        {events.map(
          (event) => (
            <div>{JSON.stringify(event)}</div>
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
