import { useRouter } from "next/router";
import { firebaseClient } from "../../firebaseClient";
import { useState, useEffect } from 'react';

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

const Event:NextPage<Props> = ({ classes }) => {
    // todo: location ??
    const router = useRouter();
    const { event } = router.query; // current event id 

    const [data, setData] = useState({});

    // let currEvent: EventData = (); // data for the current event being displayed on the page

    useEffect(() => {
        // Load initial events
        if (event) {
          loadEventData();
        }
      }, [router]);

    const loadEventData = async () => {
       const next = await firebaseClient.firestore().collection("Seattle").doc("" + event).get() // queries data
       setData(next.data());
       console.log(data);
    };

    // full page is two grid containers
    //  grid one (top half)
    // container grid two (bottom half) row : 
        // two column grid containers
        // each has 3 items (each item is a heading a description)
    // 


    return (
        <div className={classes.page}>
            <CssBaseline />
            <Typography variant="h5" style={{ fontWeight:600 }}>{data.Title}</Typography>

            <Grid container>
                <Grid item xs={6}>
                    <img src={data.imageURL} 
                    style={{ height:400, width:"auto", margin:"1rem"}} 
                    />
                </Grid>
                <Grid item xs={6}>
                    top level
                </Grid>

            </Grid>

            <Divider></Divider>

            <Grid container spacing={6}>
                <Grid item xs={6}>
                    <Grid container direction="column" spacing={3}>
                        <Grid item>
                            <Typography variant="h6">Project Description</Typography>
                            <Typography>{data["Project Description"]}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6">Clinic Flow</Typography>
                            <Typography>{data["Clinic Flow"]}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6">Parking Directions</Typography>
                            <Typography>{data["Parking and Directions"]}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Grid container direction="column" spacing={3}>
                        <Grid item>
                            <Typography variant="h6">Tips and Reminders</Typography>
                            <Typography>{data["Tips and Reminders"]}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6">Required Trainings</Typography>
                            <Typography>{data["Required Trainings"]}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6">Provider Information</Typography>
                            <Typography>{data["Provider Information"]}</Typography>
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>
        </div>
    )
}

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
export default withStyles(styles)(Event);