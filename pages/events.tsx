import React, { useEffect, useState } from "react";
import { firebaseClient } from "../firebaseClient";
import { Button, MenuItem, Select, Typography, Switch } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import EventModal from "../components/eventModal";
import BootstrapInput from "../components/bootstrapInput";
import Link from "next/link";
import AddModifyEventModal from "../components/addModifyEventModal";
import EventCard from "../components/eventCard";
import { useAuth } from "../auth";
import { Location } from "../helpers/locations";
import { volunteerTypes } from "../components/addModifyEventModal";
import { CollectionReference, Query } from "@firebase/firestore-types";
import { useRouter } from "next/router";
import { useMediaQuery } from "@mui/material";
import { useInView } from "react-intersection-observer";

type EventsProps = {
  location: Location;
  classes?: any;
};

const Events: React.FC<EventsProps> = ({ location, classes }) => {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const { ref, inView } = useInView();

  const [organizations, setOrganizations] = useState<string[]>([]); // organizations at this location
  const [events, setEvents] = useState<EventData[]>([]); // list of loaded events
  const [cursor, setCursor] =
    useState<firebaseClient.firestore.QueryDocumentSnapshot>(); // cursor to last document loaded

  const ORGANIZATION_FILTER_QUERY_KEY = "org";
  const STUDENT_TYPE_FILTER_QUERY_KEY = "type";

  const setQueryVar = (key: string, value: string) => {
    if (!router.isReady) {
      return;
    }
    const query = { ...router.query };
    if (value) {
      query[key] = value;
    } else {
      delete query[key];
    }
    router.replace(
      {
        pathname: router.pathname,
        query: query,
      },
      undefined,
      {
        scroll: false,
      },
    );
  };

  const organizationFilter = router.query[ORGANIZATION_FILTER_QUERY_KEY] ?? "";
  const setOrganizationFilter = (value: string) => {
    setQueryVar(ORGANIZATION_FILTER_QUERY_KEY, value);
  };
  const studentTypeFilter = router.query[STUDENT_TYPE_FILTER_QUERY_KEY] ?? "";
  const setStudentTypeFilter = (value: string) => {
    setQueryVar(STUDENT_TYPE_FILTER_QUERY_KEY, value);
  };

  const [showLoadButton, setShowLoadButton] = useState<boolean>(true);
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const [sortField, setSortField] = useState<string>("Title");
  const [topMessage, setTopMessage] = useState<any>();
  const [signUpAvailableFilter, setSignUpAvailableFilter] =
    useState<boolean>(false);

  const isProviderView = studentTypeFilter === "Providers";
  const setProviderView = (enabled: boolean) => {
    if (enabled) {
      setStudentTypeFilter("Providers");
    } else if (isProviderView) {
      setStudentTypeFilter("");
    }
  };

  const hndlSignUpAvailableFilter = (enabled: boolean) => {
    console.log("Sign Up Available Switch Toggled", enabled);
    setSignUpAvailableFilter(enabled);
  };

  useEffect(() => {
    // Load events
    console.log("Component mounted or location changed. Loading events...");
    loadEvents(false);
    // pull organizations for this location from the metadata cache
    firebaseClient
      .firestore()
      .collection("cache")
      .doc(location.toString())
      .get()
      .then((doc) =>
        setOrganizations(Object.keys(doc.data() as string[]).sort()),
      );
  }, [location]);

  // load the events as the load more button is in view
  useEffect(() => {
    if (inView) {
      loadEvents(true);
    }
  }, [inView]);
  // Adjusts state depending on whether provider view is on
  useEffect(() => {
    const message = isProviderView ? (
      <span>
        &nbsp;our&nbsp;
        <i>
          <a style={{ color: "#85754D" }} href="/onboarding/">
            Onboarding Instructions
          </a>
        </i>
        &nbsp;before signing up for an opportunity.
      </span>
    ) : (
      <span>
        {" "}
        project specific training requirements before signing up for an
        opportunity.
      </span>
    );

    setTopMessage(message);
  }, [isProviderView]);

  const getOrder = (curSort: string) => {
    return curSort === "timestamp" ? "desc" : "asc";
  };

  // Append more events from Firestore onto this page from position of cursor
  const loadEvents = async (keepPrev: boolean) => {
    console.log("Loading events...", signUpAvailableFilter);
    const order = getOrder(sortField);
    let query: CollectionReference | Query = firebaseClient
      .firestore()
      .collection("/" + location);
    if (organizationFilter) {
      query = query.where("Organization", "==", organizationFilter);
    }
    if (studentTypeFilter) {
      query = query.where(
        "Types of Volunteers Needed",
        "array-contains",
        studentTypeFilter,
      );
    }
    if (signUpAvailableFilter) {
      query = query.where("SignupActive", "==", true);
    }

    query = query.orderBy(sortField, order);
    console.log("Firestore Query:", query);
    if (keepPrev && cursor) {
      query = query.startAfter(cursor);
    }
    const next = await query.limit(11).get();

    const eventsToAdd: EventData[] = [];
    next.docs.slice(0, 10).forEach((document) => {
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
    setCursor(next.docs[next.docs.length - 2]);
    if (keepPrev) {
      setEvents((prevEvents) => [...prevEvents, ...eventsToAdd]);
    } else {
      setEvents(eventsToAdd);
    }
    setShowLoadButton(next.docs.length > 10);
  };

  useEffect(() => {
    loadEvents(false);
    console.log("here");
    /*.catch((err) => {
        console.error("Error loading events: " + err);
      });*/
  }, [organizationFilter, studentTypeFilter, signUpAvailableFilter]);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <div>
      <div
        style={{
          marginTop: "2em",
          marginBottom: "2em",
          width: "100%",
        }}
      >
        <Grid container columns={16} spacing={2}>
          <Grid item xs={12} md={5}>
            <Typography
              id="opportunity-type-filter"
              className={classes.filterField}
            >
              Opportunity Type{" "}
            </Typography>
            <Select
              aria-labelledby="opportunity-type-filter"
              value={organizationFilter}
              onChange={(e) => {
                setOrganizationFilter(e.target.value as string);
              }}
              displayEmpty
              className={classes.studentFilter}
              input={<BootstrapInput />}
            >
              <MenuItem value="">Show All</MenuItem>
              {organizations.map((organization, index) => (
                <MenuItem key={index} value={organization}>
                  {organization}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} md={5}>
            {!isProviderView && (
              <>
                <Typography
                  id="student-type-filter"
                  className={classes.filterField}
                >
                  Student Discipline{" "}
                </Typography>
                <Select
                  aria-labelledby="student-type-filter"
                  value={studentTypeFilter}
                  className={classes.studentFilter}
                  onChange={(e) => {
                    setStudentTypeFilter(e.target.value as string);
                  }}
                  displayEmpty
                  input={<BootstrapInput />}
                  disabled={isProviderView}
                >
                  <MenuItem value="">Show All</MenuItem>
                  {volunteerTypes
                    .filter((studentType) => studentType !== "Providers")
                    .map((studentType, index) => (
                      <MenuItem key={index} value={studentType}>
                        {studentType}
                      </MenuItem>
                    ))}
                </Select>
              </>
            )}
          </Grid>
          {/* Move the calendar button grid item up by one line */}
          {location === "Seattle" && (
            <Grid item xs={12} md={2}>
              <Link href="/calendar">
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    minWidth: "130px",
                    borderRadius: 10,
                    fontFamily: "Encode Sans",
                    fontWeight: 800,
                    textAlign: "center",
                    marginTop: "0.5rem",
                    //marginLeft: "5rem"
                  }}
                >
                  Calendar
                </Button>
              </Link>
            </Grid>
          )}
          <Grid container item xs={12} md={6} alignItems="center" spacing={2}>
            <Grid container item xs={12} md={6} spacing={1} alignItems="center">
              <Grid item>
                <Typography variant="body1" style={{ fontWeight: "bold" }}>
                  Provider View
                </Typography>
              </Grid>
              <Grid item>
                <Tooltip
                  title={
                    <Typography>
                      Providers are clinicians who supervise our students in
                      providing medical care to underserved patients.
                    </Typography>
                  }
                >
                  <InfoOutlinedIcon
                    style={{ fontSize: "1.5rem", color: "#808080" }}
                  />
                </Tooltip>
              </Grid>
              <Grid item>
                <Switch
                  color="primary"
                  classes={{
                    root: classes.root,
                    switchBase: classes.switchBase,
                    thumb: classes.thumb,
                    track: classes.track,
                    checked: classes.checked,
                  }}
                  checked={isProviderView}
                  onChange={(e) => setProviderView(e.target.checked)}
                />
              </Grid>
            </Grid>
            <Grid container item xs={12} md={6} spacing={1} alignItems="center">
              <Grid item>
                <Typography variant="body1" style={{ fontWeight: "bold" }}>
                  Sign-up available
                </Typography>
              </Grid>
              <Grid item>
                <Tooltip
                  title={
                    <Typography>
                      Allows filtering events where sign-up is available.
                    </Typography>
                  }
                >
                  <InfoOutlinedIcon
                    style={{ fontSize: "1.5rem", color: "#808080" }}
                  />
                </Tooltip>
              </Grid>
              <Grid item>
                <Switch
                  color="primary"
                  classes={{
                    root: classes.root,
                    switchBase: classes.switchBase,
                    thumb: classes.thumb,
                    track: classes.track,
                    checked: classes.checked,
                  }}
                  checked={signUpAvailableFilter}
                  onChange={(e) => hndlSignUpAvailableFilter(e.target.checked)}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <Typography
        variant="h6"
        style={{ textAlign: "center", marginBottom: "3em", color: "#85754D" }}
      >
        <b>Note:</b> Please review
        {topMessage}
      </Typography>

      {/* Button-Modal Module for adding new events */}
      {isAdmin && (
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

      {location ? (
        <div style={{ paddingBottom: "4em" }}>
          {events.length > 0 ? (
            <Grid container spacing={isMobile ? 2 : 6}>
              {events.map((event, index) => (
                <Grid key={event.id + index} item xs={12} lg={6}>
                  <EventCard
                    event={event}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <div style={{ textAlign: "center" }}>
              <Typography className={classes.filterField}>
                <b>No results found.</b>
              </Typography>
            </div>
          )}
          {/*when this is in view it loads more projects*/}
          {showLoadButton && (
            <div ref={ref} />
          )}
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <Typography className={classes.filterField}>
            <b>Please select a location.</b>
          </Typography>
        </div>
      )}
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
  root: {
    width: 80,
    height: 48,
    padding: 8,
  },
  filterField: {
    fontFamily: "Encode Sans",
    fontSize: "1rem",
    display: "inline",
    fontWeight: 700,
    marginRight: "0.5rem",
  },
  // Styles for the switch component
  switchBase: {
    padding: 11,
  },
  thumb: {
    width: 26,
    height: 26,
  },
  track: {
    background: "gray",
    opacity: "1 !important",
    borderRadius: 20,
    position: "relative",
    "&:before, &:after": {
      display: "inline-block",
      position: "absolute",
      top: "50%",
      width: "50%",
      transform: "translateY(-50%)",
      color: "#fff",
      textAlign: "center",
    },
    "&:before": {
      content: '"On"',
      left: 4,
      opacity: 0,
    },
    "&:after": {
      content: '"Off"',
      right: 4,
    },
  },
  checked: {
    "&$switchBase": {
      color: "#185a9d",
      transform: "translateX(32px)",
      "&:hover": {
        backgroundColor: "rgba(24,90,257,0.08)",
      },
    },
    "& $thumb": {
      backgroundColor: "#fff",
    },
    "& + $track": {
      background: "#4B2E83",
      "&:before": {
        opacity: 1,
      },
      "&:after": {
        opacity: 0,
      },
    },
  },
  studentFilter: {
    marginRight: "1em",
    width: "205px",
  },
});

//@ts-ignore
export default withStyles(styles)(Events);
