import { useRouter } from "next/router";
import { firebaseClient } from "../../firebaseClient";
import { useState, useEffect } from "react";
import { NextPage } from "next";

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

const Data: { [key: string]: any } = {
  WEBSITE: "Website Link",
  DATETIME: "Date and Time",
  CONTACT: "Contact Information and Cancellation Policy",
  TYPESVOL: "Types of Volunteers Needed",
  DESC: "Project Description",
  TIPS: "Tips and Reminders",
  REQTRNGS: "Required Trainings",
  PROVINFO: "Provider Information",
  CLINICF: "Clinic Flow",
  DIRECTIONS: "Parking and Directions",
};

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

  let buttonText = eventData?.[Data.WEBSITE]
    ? "Sign up >"
    : "No sign up links available yet";

  return (
    <div className={classes.page}>
      <CssBaseline />
      <Typography variant='h5' style={{ fontWeight: 900 }}>
        {eventData?.Title}
      </Typography>

      <Grid container spacing={6}>
        <Grid item sm={12} md={6} className={classes.detailsImageContainer}>
          <img
            className={classes.detailsImage}
            src={eventData?.imageURL ? eventData?.imageURL : "/beigeSquare.png"}
            alt={"Image for " + eventData?.Title}
          />
        </Grid>
        <Grid item sm={12} md={6}>
          <Grid container direction='column' spacing={6}>
            <Grid item>
              <Grid container direction='row' spacing={10}>
                <Grid item>
                  <Typography variant='h6' style={{ fontWeight: 600 }}>
                    Location
                  </Typography>
                  <Typography variant='body1'>
                    {eventData?.Location ?? NotSpecified}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant='h6' style={{ fontWeight: 600 }}>
                    Date and Time
                  </Typography>
                  <Typography variant='body1'>
                    {eventData?.[Data.DATETIME] ?? NotSpecified}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant='h6' style={{ fontWeight: 600 }}>
                Contact Information & Cancellation Policy
              </Typography>
              <Typography>
                {eventData?.[Data.CONTACT] ?? NotSpecified}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant='h6' style={{ fontWeight: 600 }}>
                Types of Volunteers Needed
              </Typography>
              <Typography>
                {eventData?.[Data.TYPESVOL] ?? NotSpecified}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                autoFocus
                color='secondary'
                variant='contained'
                style={{ marginRight: "1em", marginBottom: "2em" }}
                href={eventData?.[Data.WEBSITE]}
                disabled={!eventData?.[Data.WEBSITE]}
              >
                {buttonText}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Divider></Divider>

      <Grid container spacing={6} style={{ marginTop: "2em" }}>
        <Grid item sm={12} md={6}>
          <Grid container direction='column' spacing={3}>
            <Grid item>
              <Typography variant='h6' style={{ fontWeight: 600 }}>
                Project Description
              </Typography>
              <Typography>{eventData?.[Data.DESC] ?? NotSpecified}</Typography>
            </Grid>
            <Grid item>
              <Typography variant='h6' style={{ fontWeight: 600 }}>
                Clinic Flow
              </Typography>
              <Typography>
                {eventData?.[Data.CLINICF] ?? NotSpecified}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant='h6' style={{ fontWeight: 600 }}>
                Parking Directions
              </Typography>
              <Typography>
                {eventData?.[Data.DIRECTIONS] ?? NotSpecified}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={12} md={6}>
          <Grid container direction='column' spacing={3}>
            <Grid item>
              <Typography variant='h6' style={{ fontWeight: 600 }}>
                Tips and Reminders
              </Typography>
              <Typography>{eventData?.[Data.TIPS] ?? NotSpecified}</Typography>
            </Grid>
            <Grid item>
              <Typography variant='h6' style={{ fontWeight: 600 }}>
                Required Trainings
              </Typography>
              <Typography>
                {eventData?.[Data.REQTRNGS] ?? NotSpecified}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant='h6' style={{ fontWeight: 600 }}>
                Provider Information
              </Typography>
              <Typography>
                {eventData?.[Data.PROVINFO] ?? NotSpecified}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
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
