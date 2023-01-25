import React, { useEffect, useState } from "react";
import { firebaseClient } from "../firebaseClient";
import { 
  Button, 
  Grid, 
  MenuItem, 
  Select, 
  Typography, 
  createStyles, 
  withStyles, 
  FormControlLabel, 
  Switch, 
  FormGroup } from "@material-ui/core";
import EventModal from "./eventModal";
import BootstrapInput from "./bootstrapInput";
import Link from "next/link";
import AddModifyEventModal from "./addModifyEventModal";
import EventCard from "./eventCard";
import { useAuth } from "../auth";
import { Location } from "../helpers/locations"
import { volunteerTypes } from "./addModifyEventModal";
import { CollectionReference, Query } from "@firebase/firestore-types";
import {useRouter} from "next/router";

type EventsProps = {
  location: Location;
  classes?: any,
}

const Events: React.FC<EventsProps> = ({
  location, classes
}) => {
  const { user } = useAuth();
  const router = useRouter();

  const [organizations, setOrganizations] = useState<string[]>([]); // organizations at this location
  const [events, setEvents] = useState<EventData[]>([]); // list of loaded events
  const [cursor, setCursor] = useState<
    firebaseClient.firestore.QueryDocumentSnapshot
  >(); // cursor to last document loaded

  const ORGANIZATION_FILTER_QUERY_KEY = "org";
  const STUDENT_TYPE_FILTER_QUERY_KEY = "type";

  const setQueryVar = (key: string, value: string) => {
    if (!router.isReady) {
      return;
    }
    const query = {...router.query}
    if (value) {
      query[key] = value;
    } else {
      delete query[key];
    }
    router.replace(
      {
        pathname: router.pathname,
        query: query
      },
      undefined,
      {
        scroll: false
      });
  }

  const organizationFilter = router.query[ORGANIZATION_FILTER_QUERY_KEY] ?? "";
  const setOrganizationFilter = (value: string) => {
    setQueryVar(ORGANIZATION_FILTER_QUERY_KEY, value);
  }
  const studentTypeFilter = router.query[STUDENT_TYPE_FILTER_QUERY_KEY] ?? "";
  const setStudentTypeFilter = (value: string) => {
    setQueryVar(STUDENT_TYPE_FILTER_QUERY_KEY, value);
  }

  const [showLoadButton, setShowLoadButton] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<EventData>();
  const [sortField, setSortField] = useState<string>("Title");
  const [topMessage, setTopMessage] = useState<any>();

  const isProviderView = studentTypeFilter === "Providers";
  const setProviderView = (enabled: boolean) => {
    if (enabled) {
      setStudentTypeFilter("Providers");
    } else if (isProviderView) {
      setStudentTypeFilter("");
    }
  }

  useEffect(() => {
    // Load events
    loadEvents(false);
    // pull organizations for this location from the metadata cache
    firebaseClient
      .firestore()
      .collection("cache")
      .doc(location.toString())
      .get()
      .then((doc) => setOrganizations(Object.keys(doc.data() as string[]).sort()));
  }, [location]);

    // Adjusts state depending on whether provider view is on
    useEffect(() => {
      if (isProviderView) {
        setTopMessage(
          <span>
           &nbsp;our&nbsp; 
           <i>
            <a style={{ color: "#85754D" }} href="/onboarding/">
              Onboarding Instructions
            </a>
          </i>
          &nbsp;before signing up for an opportunity.
          </span>
        )
      } else {
        setTopMessage(
            <span> project specific training requirements before signing up for an opportunity.</span>
        )
      }
    }, [isProviderView])

  const getOrder = (curSort: string) => {
    return curSort === "timestamp" ? "desc" : "asc";
  };

  // Append more events from Firestore onto this page from position of cursor
  const loadEvents = async (keepPrev: boolean) => {
    const order = getOrder(sortField);
    let query : CollectionReference | Query = firebaseClient.firestore().collection("/" + location);
    if (organizationFilter) {
      query = query.where("Organization", "==", organizationFilter);
    }
    if (studentTypeFilter) {
      query = query.where("Types of Volunteers Needed", "array-contains", studentTypeFilter);
    }

    query = query.orderBy(sortField, order);
    if (keepPrev && cursor) {
      query = query.startAfter(cursor)
    }
    const next = await query.limit(10)
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
    if (keepPrev) {
      setEvents((prevEvents) => [...prevEvents, ...eventsToAdd]);
    } else {
      setEvents(eventsToAdd);
    }
    setShowLoadButton(eventsToAdd.length === 10);
  };

  useEffect(() => {
    loadEvents(false)
      /*.catch((err) => {
        console.error("Error loading events: " + err);
      });*/
  }, [organizationFilter, studentTypeFilter])

  return (
    <div>
      <div
        style={{
          marginTop: "2em",
          marginBottom: "2em",
          width: "100%",
        }}
      >
        <EventModal
          open={modalOpen}
          event={selectedEvent}
          location={location}
          handleClose={() => setModalOpen(false)}
        />
        <Grid container>
          <Grid item xs={12} sm={10}>
            <Grid container>
              {!isProviderView && <Grid item style={{ marginBottom: "1em" }}>
                <Typography
                  id="student-type-filter"
                  className={classes.filterField}>
                  Student Discipline{" "}
                </Typography>
                <Select
                  aria-labelledby="student-type-filter"
                  value={studentTypeFilter}
                  className={classes.studentFilter}
                  onChange={(e) => {
                    setStudentTypeFilter(e.target.value as string);
                  }}
                  style={{ width: 200 }}
                  displayEmpty
                  input={<BootstrapInput />}
                  disabled={ isProviderView }
                >
                  <MenuItem value="">Show All</MenuItem>
                  {volunteerTypes
                    .filter((studentType) => studentType !== "Providers")
                    .map((studentType) => (
                      <MenuItem value={studentType}>{studentType}</MenuItem>
                    ))}
                </Select>
              </Grid>}
              <Grid item style={{ marginBottom: "1em" }}>
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
                  style={{ width: 200}}
                  displayEmpty
                  input={<BootstrapInput />}
                >
                  <MenuItem value="">Show All</MenuItem>
                  {organizations.map((organization) => (
                    <MenuItem value={organization}>{organization}</MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={2} style={{ textAlign: "right", maxWidth: "100%"}}>
            <FormGroup>
              <FormControlLabel 
                control={
                  <Switch color="primary"
                          classes={{
                            root: classes.root,
                            switchBase: classes.switchBase,
                            thumb: classes.thumb,
                            track: classes.track,
                            checked: classes.checked
                          }}
                          checked={isProviderView}
                          onChange={(e) => setProviderView(e.target.checked)}
                  />
                }
                label={<Typography style= {{textAlign: "center"}}><b>Provider View</b></Typography>}
                labelPlacement="start"
                 />
            </FormGroup>
            {location === "Seattle" &&(
            <Button
              variant="contained"
              color="primary"
              style={{
                float: "right",
                minWidth: "150px",
                borderRadius: 10,

              }}
            >
              <Typography>
                <Link href="/calendar">
                  <div style={{ color: "white" }}>See Calendar</div>
                </Link>
              </Typography>
            </Button>
            )}
          </Grid>
        </Grid>
      </div>

      <Typography variant="h6" style={{ textAlign: "center", marginBottom: "3em", color: "#85754D" }}>
        <b>Note:</b> Please review  
        {topMessage}
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

      {location ? (
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
                onClick={() => { loadEvents(true);/*.catch((err) => { console.error("Error loading more events: " + err)*/ } }
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
      ) : (
        <div style={{ textAlign: "center" }}>
          <Typography variant="h6">
            <b>Please select a location.</b>
          </Typography>
        </div>
      )}
    </div>
  );
}

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
    fontFamily: "Uni Sans Book", 
    fontSize: "1rem",
    display: "inline",
    fontWeight: 600,
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
    background: 'gray',
    opacity: '1 !important',
    borderRadius: 20,
    position: 'relative',
    '&:before, &:after': {
      display: 'inline-block',
      position: 'absolute',
      top: '50%',
      width: '50%',
      transform: 'translateY(-50%)',
      color: '#fff',
      textAlign: 'center',
    },
    '&:before': {
      content: '"On"',
      left: 4,
      opacity: 0,
    },
    '&:after': {
      content: '"Off"',
      right: 4,
    },
  },
  checked: {
    '&$switchBase': {
      color: '#185a9d',
      transform: 'translateX(32px)',
      '&:hover': {
        backgroundColor: 'rgba(24,90,257,0.08)',
      },
    },
    '& $thumb': {
      backgroundColor: '#fff',
    },
    '& + $track': {
      background: '#4B2E83',
      '&:before': {
        opacity: 1,
      },
      '&:after': {
        opacity: 0,
      }
    },
  },
  studentFilter: {
    marginRight: "1em",
  }
});

//@ts-ignore
export default withStyles(styles)(Events);
