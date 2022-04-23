import { useRouter } from "next/router";
import { firebaseClient } from "../../firebaseClient";
import React, { useState, useEffect } from "react";
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
import naturalJoin from "../../helpers/naturalJoin";
import EventDescription from "../../components/eventDescription";

interface Props {
  classes?: any;
}

const NotSpecified = <i style={{ color: "gray" }}>Not specified</i>;

const initialGridKeys = [
  "Tips and Reminders",
  "Clinic Flow",
  "Required Trainings",
  "Parking and Directions",
  "Provider Information",
];

const reservedKeys = [
  "Project Description",
  "Details",
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
  "cardImageURL"
];

type EventFieldProps = {
  name: string;
  value: string | string[] | JSX.Element | undefined;
}

const EventField: React.FC<EventFieldProps> = ({
  name,
  value
}) => {
  let data: string | JSX.Element | undefined;
  if (value && Array.isArray(value)) {
    data = naturalJoin(value);
  } else {
    data = value;
  }
  return (
    <Grid style={{ maxWidth: "100%" }} item sm={12} md={6}>
      <Typography variant="h6" style={{ fontWeight: 600 }}>
        {name}
      </Typography>

      <Typography>{data ?? NotSpecified}</Typography>
    </Grid>
  );
}

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

  // console.log("eventData: ", eventData);


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
      {/* EVENT TITLE */}
      <Typography variant="h5" style={{ fontWeight: 900, paddingBottom: 50 }}>
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
          <Grid container direction="column" spacing={5} style={{  position: "absolute", marginLeft: 122, paddingTop: 8 }}>
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
                <Grid item style={{ marginLeft: 100 }}>
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
                {eventData["Types of Volunteers Needed"] ? naturalJoin(eventData["Types of Volunteers Needed"]) : NotSpecified}
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

      <Divider style={{ marginBottom: "3em", marginTop: "3em", height: 3, borderRadius: "25px"}}></Divider>

      <Grid container spacing={4}>
        <EventField name="Project Description" value={<EventDescription event={eventData} />} />
        {initialGridKeys.filter((name) => eventData[name] != null && eventData[name] != "").map((name) => (
          <EventField key={name} name={name} value={eventData[name]} />
        ))}
        {Object.keys(eventData)
          .filter((name) => !reservedKeys.includes(name))
          .filter((name) => eventData[name] != null && eventData[name] != "")
          .map((name) => (
            <EventField key={name} name={name} value={eventData[name]} />
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
    marginLeft: "0px"
  },
  detailsImage: {
    minWidth: "100%",
    minHeight: "100%",
    borderRadius: "10px",
    objectFit: "cover",
  },
});
export default withStyles(styles)(Event);
