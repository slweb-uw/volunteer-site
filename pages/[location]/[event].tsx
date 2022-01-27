import { useRouter } from "next/router";
import { firebaseClient } from "../../firebaseClient";
import { useState, useEffect } from "react";
import { NextPage } from "next";
import IconBreadcrumbs from "../../components/breadcrumbs";

import {
  createStyles,
  CssBaseline,
  Typography,
  Select,
  Divider,
  withStyles,
  Grid,
  Button,
} from "@material-ui/core";

interface Props {
  classes?: any;
}

const NotSpecified = <i style={{ color: "gray" }}>Not specified</i>;

const initialGridKeys = [
  "Project Description",
  "Tips and Reminders",
  "Clinic Flow",
  "Required Trainings",
  "Parking and Directions",
  "Provider Information",
];

const reservedKeys = [
  "Project Description",
  "Types of Volunteers Needed",
  "Title",
  "Order",
  "Organization",
  "Location",
  "Contact Information and Cancellation Policy",
  "Website Link",
  "Sign-up Link",
  "Parking and Directions",
  "Clinic Flow",
  "Tips and Reminders",
  "Provider Information",
  "id",
  "timestamp",
  "StartDate",
  "EndDate",
  "Recurrence",
  "recurrences",
  "original recurrence",
  "imageURL",
];

const Event: NextPage<Props> = ({ classes }) => {
  const router = useRouter();
  const { event, location } = router.query; // current event id and location

  // const [data, setData] = useState({});

  const [eventData, setEventData] = useState<EventData>();

  useEffect(() => {
    // Load initial events
    if (event) {
      loadEventData();
    }
  }, [router]);

  const loadEventData = async () => {
    const next = await firebaseClient
      .firestore()
      .collection("" + location)
      .doc("" + event)
      .get(); // queries data
    // setData(next.data() as any);
    setEventData(next.data() as EventData);
  };

  // console.log(eventData);

  const options = { year: "numeric", month: "long", day: "numeric" };

  let buttonText = eventData?.["Sign-up Link"]
    ? "Sign up >"
    : "No sign up links available yet";

  return !eventData ? (
    <div />
  ) : (
    <div className={classes.page}>
      <CssBaseline />
      <IconBreadcrumbs
        parentURL={"/location/" + location}
        crumbs={["Opportunities in " + location, eventData.Title]}
      />
      <Typography variant="h5" style={{ fontWeight: 900 }}>
        {eventData?.Title}
      </Typography>

      <Grid container spacing={6}>
        <Grid item sm={12} md={6} className={classes.detailsImageContainer}>
          <img
            className={classes.detailsImage}
            src={eventData?.imageURL ? eventData?.imageURL : "/beigeSquare.png"}
            alt={"Image for " + eventData.Title}
          />
        </Grid>
        <Grid item sm={12} md={6}>
          <Grid container direction="column" spacing={6}>
            <Grid item>
              <Grid container direction="row" spacing={10}>
                <Grid item>
                  <Typography variant="h6" style={{ fontWeight: 600 }}>
                    Location
                  </Typography>
                  <Typography variant="body1">
                    {eventData?.Location ?? NotSpecified}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h6" style={{ fontWeight: 600 }}>
                    Date and Time
                  </Typography>
                  <Typography variant="body1">
                    {eventData["StartDate"] ?? NotSpecified}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="h6" style={{ fontWeight: 600 }}>
                Contact Information & Cancellation Policy
              </Typography>
              <Typography>
                {eventData["Contact Information and Cancellation Policy"] ??
                  NotSpecified}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6" style={{ fontWeight: 600 }}>
                Types of Volunteers Needed
              </Typography>
              <Typography>
                {eventData["Types of Volunteers Needed"] ?? NotSpecified}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                autoFocus
                color="secondary"
                variant="contained"
                style={{ marginRight: "1em", marginBottom: "2em" }}
                href={eventData["Sign-up Link"]}
                disabled={!eventData["Sign-up Link"]}
              >
                {buttonText}
              </Button>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item>{Object.keys(eventData).map((fieldName) => {})}</Grid>
          </Grid>
        </Grid>
      </Grid>

      <Divider style={{ marginBottom: "2em" }}></Divider>

      <Grid container spacing={4}>
        {initialGridKeys.map((key) => (
          <Grid item sm={12} md={6}>
            <Typography variant="h6" style={{ fontWeight: 600 }}>
              {key}
            </Typography>
            <Typography>{eventData[key] ?? NotSpecified}</Typography>
          </Grid>
        ))}
        {Object.keys(eventData)
          .filter((key) => !reservedKeys.includes(key))
          .map((key) => (
            <Grid item sm={12} md={6}>
              <Typography variant="h6" style={{ fontWeight: 600 }}>
                {key}
              </Typography>
              <Typography>{eventData[key] ?? NotSpecified}</Typography>
            </Grid>
          ))}
      </Grid>
    </div>
  );
};

const styles = createStyles({
  page: {
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 1500,
    marginBottom: 300,
    width: "90%",
    paddingTop: "2em",
    paddingBottom: "5em",
  },
  detailsImageContainer: {
    display: "flex",
    margin: "1rem",
    justifyContent: "center",
    overflow: "hidden",
    maxWidth: "500px",
    maxHeight: "500px",
    paddingRight: "0px !important",
  },
  detailsImage: {
    minWidth: "100%",
    minHeight: "100%",
    borderRadius: "10px",
    objectFit: "cover",
  },
});
export default withStyles(styles)(Event);
