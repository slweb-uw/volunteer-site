import React, { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "firebaseClient";
import { Button, MenuItem, Select, Typography, Switch } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Grid from "@mui/material/Grid";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import BootstrapInput from "../components/bootstrapInput";
import Link from "next/link";
import ProjectCard from "../components/projectCard";
import { Location } from "../helpers/locations";
import { volunteerTypes } from "components/AddModifyEventModal";
import { useRouter } from "next/router";
import { useMediaQuery } from "@mui/material";
import { ProjectData } from "new-types";
import { useAuth } from "auth";
import DownloadIcon from "@mui/icons-material/Download";
import Papa from "papaparse";

type EventsProps = {
  location: Location;
  classes?: any;
};

const Events: React.FC<EventsProps> = ({ location, classes }) => {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<string[]>([]); // organizations at this location
  const [events, setEvents] = useState<ProjectData[]>([]); // list of loaded events

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
    router.push({
      pathname: router.pathname,
      query: query,
    });
  };

  const organizationFilter = router.query[ORGANIZATION_FILTER_QUERY_KEY] ?? "";
  const setOrganizationFilter = (value: string) => {
    setQueryVar(ORGANIZATION_FILTER_QUERY_KEY, value);
  };
  const studentTypeFilter = router.query[STUDENT_TYPE_FILTER_QUERY_KEY] ?? "";
  const setStudentTypeFilter = (value: string) => {
    setQueryVar(STUDENT_TYPE_FILTER_QUERY_KEY, value);
  };

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
    loadEvents();
    const cacheRef = doc(db, "cache", location.toString());
    getDoc(cacheRef).then((doc) => {
      if (doc.exists()) {
        setOrganizations(Object.keys(doc.data()).sort());
      }
    });

    // pull organizations for this location from the metadata cache
  }, [location]);

  // Adjusts state depending on whether provider view is on
  useEffect(() => {
    const message = isProviderView ? (
      <span>
        &nbsp;our&nbsp;
        <i>
          <Link style={{ color: "#85754D" }} href="/onboarding/">
            Onboarding Instructions
          </Link>
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
  async function loadEvents() {
    const order = getOrder(sortField);

    // initialize query
    let q: any = collection(db, "/" + location);

    // build up query
    if (organizationFilter) {
      q = query(q, where("Organization", "==", organizationFilter));
    }
    if (studentTypeFilter) {
      q = query(
        q,
        where(
          "Types of Volunteers Needed",
          "array-contains",
          studentTypeFilter,
        ),
      );
    }
    if (signUpAvailableFilter) {
      q = query(q, where("SignupActive", "==", true));
    }

    q = query(q, orderBy(sortField, order));

    // if we have a cursor, and we want to keep prev then fetch by cursor
    const next = await getDocs(q);
    const eventsToAdd: ProjectData[] = [];
    next.docs.forEach((document) => {
      let eventDoc = document.data() as ProjectData;
      eventDoc.id = document.id; // adds event id to the EventData object
      const volunteersNeeded: string | string[] | undefined =
        eventDoc["Types of Volunteers Needed"];
      if (volunteersNeeded && typeof volunteersNeeded === "string") {
        // If string, then obsolete. Remove data
        eventDoc["Types of Volunteers Needed"] = [];
      }
      eventsToAdd.push(eventDoc);
    });

    setEvents(eventsToAdd);
  }

  useEffect(() => {
    loadEvents();
  }, [organizationFilter, studentTypeFilter, signUpAvailableFilter]);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const { user, isAdmin, isLead, isLoading } = useAuth();
const canExport = !isLoading && Boolean(user) && (isAdmin || isLead);

const [exporting, setExporting] = useState(false);
const [exportMessage, setExportMessage] = useState("");

const downloadVolunteers = async () => {
  if (!canExport || exporting || !router.isReady) return;

  setExporting(true);
  setExportMessage("");

  try {
    // Query using the filters selected when Download was clicked.
    // This avoids exporting stale results while the page is refreshing.
    let projectsQuery = query(collection(db, location));

    if (organizationFilter) {
      projectsQuery = query(
        projectsQuery,
        where("Organization", "==", organizationFilter),
      );
    }

    if (studentTypeFilter) {
      projectsQuery = query(
        projectsQuery,
        where(
          "Types of Volunteers Needed",
          "array-contains",
          studentTypeFilter,
        ),
      );
    }

    if (signUpAvailableFilter) {
      projectsQuery = query(
        projectsQuery,
        where("SignupActive", "==", true),
      );
    }

    // Match the page's ordering query, including its field-existence behavior.
    projectsQuery = query(
      projectsQuery,
      orderBy(sortField, getOrder(sortField)),
    );

    const projectsSnapshot = await getDocs(projectsQuery);
    const projectNames = new Map<string, string>();

    projectsSnapshot.docs.forEach((project) => {
      projectNames.set(project.id, project.data().Title ?? "");
    });

    if (projectNames.size === 0) {
      setExportMessage("No projects match the selected filters.");
      return;
    }

    const eventsSnapshot = await getDocs(
      query(
        collection(db, "events"),
        where("location", "==", location),
      ),
    );

    const matchingEvents = eventsSnapshot.docs.filter((event) =>
      projectNames.has(event.data().projectId),
    );

    type ExportRow = {
      Month: string;
      Date: string;
      Location: string;
      Project: string;
      Event: string;
      Role: string;
      Name: string;
      Email: string;
      Phone: string;
      Discipline: string;
      Comments: string;
    };

    const rows: ExportRow[] = [];

    // Read sequentially to avoid a burst of requests for large exports.
    for (const event of matchingEvents) {
      const eventData = event.data();
      const volunteersSnapshot = await getDocs(
        collection(db, "events", event.id, "volunteers"),
      );

      for (const volunteer of volunteersSnapshot.docs) {
        const data = volunteer.data();

        const rawDate =
          typeof data.date === "string"
            ? data.date
            : data.date?.toDate?.().toISOString() ?? "";

        const validDate =
          rawDate !== "" && Number.isFinite(Date.parse(rawDate));

        // Use the signup's occurrence date, matching the attendee table.
        const date = validDate ? rawDate.split("T")[0] : "";

        rows.push({
          Month: date ? date.slice(0, 7) : "Unknown",
          Date: date,
          Location: location,
          Project: projectNames.get(eventData.projectId) ?? "",
          Event: String(eventData.name ?? ""),
          Role: String(data.role ?? ""),
          Name: String(data.name ?? ""),
          Email: String(data.email ?? ""),
          Phone: String(data.phoneNumber ?? ""),
          Discipline: String(data.studentDiscipline ?? ""),
          Comments: String(data.comments ?? ""),
        });
      }
    }

    if (rows.length === 0) {
      setExportMessage("No volunteer signups match the selected filters.");
      return;
    }

    // YYYY-MM-DD sorts chronologically and keeps each month together.
    // Missing dates appear last.
    rows.sort(
      (a, b) =>
        (a.Date || "9999-99-99").localeCompare(b.Date || "9999-99-99") ||
        a.Project.localeCompare(b.Project) ||
        a.Event.localeCompare(b.Event) ||
        a.Name.localeCompare(b.Name),
    );

    const csv = Papa.unparse(rows, {
      escapeFormulae: true,
    });

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `volunteers-${location}-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    // Allow the browser time to start the download.
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);

    setExportMessage(`Downloaded ${rows.length} volunteer signups.`);
  } catch (error) {
    console.error("Could not export volunteers:", error);
    setExportMessage(
      "Could not download volunteers. Please try again.",
    );
  } finally {
    setExporting(false);
  }
};
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
              Opportunity Type
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
          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              color="secondary"
              LinkComponent={Link}
              fullWidth
              href={`/${location}/calendar`}
            >
              Events calendar
            </Button>
          </Grid>
          {canExport && (
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={downloadVolunteers}
              disabled={exporting || !router.isReady}
              fullWidth
            >
              {exporting ? "Downloading…" : "Download volunteers"}
            </Button>

            {exportMessage && (
              <Typography
                variant="body2"
                role="status"
                sx={{ mt: 1 }}
              >
                {exportMessage}
              </Typography>
            )}
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

      {location ? (
        <div style={{ paddingBottom: "4em" }}>
          {events.length > 0 ? (
            <Grid container spacing={isMobile ? 2 : 6}>
              {events.map((event) => (
                <Grid key={event.id} item xs={12} lg={6}>
                  <ProjectCard event={event} />
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
