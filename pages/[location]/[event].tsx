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

const Event: NextPage<Props> = ({ classes }) => {
  const router = useRouter();
  const { event, location } = router.query; // current event id and location 

  const [data, setData] = useState({});

  useEffect(() => {
    // Load initial events
    if (event) {
      loadEventData();
    }
  }, [router]);

  const loadEventData = async () => {
    const next = await firebaseClient
      .firestore()
      .collection(location)
      .doc("" + event)
      .get(); // queries data
    setData(next.data());
  };

  return (
    <div className={classes.page}>
      <CssBaseline />
      <Typography variant="h5" style={{ fontWeight: 900 }}>
        {data.Title}
      </Typography>

      <Grid container spacing={6}>
        <Grid item xs={6}>
          <img
            src={data.imageURL ?? "/beigeSquare.png"}
            style={{
              height: 350,
              width: "auto",
              margin: "1rem",
              borderRadius: "10px",
            }}
            alt={"Image for " + data.Title}
          />
        </Grid>
        <Grid item xs={6}>
          <Grid container direction="column" spacing={6}>
            <Grid item>
              <Grid container direction="row" spacing={10}>
                <Grid item>
                  <Typography variant="h6" style={{ fontWeight: 600 }}>Location</Typography>
                  <Typography variant="body1">{data.Location}</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h6" style={{ fontWeight: 600 }}>Date and Time</Typography>
                  <Typography variant="body1">{data["Date and Time"]}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="h6" style={{ fontWeight: 600 }}>
                Contact Information & Cancellation Policy
              </Typography>
              <Typography>
                {data["Contact Information and Cancellation Policy"]}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6" style={{ fontWeight: 600 }}>Types of Volunteers Needed</Typography>
              <Typography>{data["Types of Volunteers Needed"]}</Typography>
            </Grid>
            <Grid item>
              <Button
                autoFocus
                color="secondary"
                variant="contained"
                style={{ marginRight: "1em", marginBottom: "2em" }}
              >
                Sign up {'>'}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Divider></Divider>

      <Grid container spacing={6} style={{ marginTop:"2em" }}>
        <Grid item xs={6}>
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <Typography variant="h6" style={{ fontWeight: 600 }}>Project Description</Typography>
              <Typography>{data["Project Description"]}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6" style={{ fontWeight: 600 }}>Clinic Flow</Typography>
              <Typography>{data["Clinic Flow"]}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6" style={{ fontWeight: 600 }}>Parking Directions</Typography>
              <Typography>{data["Parking and Directions"]}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <Typography variant="h6" style={{ fontWeight: 600 }}>Tips and Reminders</Typography>
              <Typography>{data["Tips and Reminders"]}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6" style={{ fontWeight: 600 }}>Required Trainings</Typography>
              <Typography>{data["Required Trainings"]}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6" style={{ fontWeight: 600 }}>Provider Information</Typography>
              <Typography>{data["Provider Information"]}</Typography>
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
    width: "90%",
    paddingTop: "2em",
    paddingBottom: "5em",
  },
});
export default withStyles(styles)(Event);
