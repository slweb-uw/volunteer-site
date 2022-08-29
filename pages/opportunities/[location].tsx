import React, {useEffect} from "react";
import { firebaseClient } from "../../firebaseClient";
import { NextPage } from "next";
import {
  createStyles,
  CssBaseline,
  Typography,
  withStyles,
} from "@material-ui/core";
import { withSnackbar } from "notistack";
import IconBreadcrumbs from "components/breadcrumbs";
import LocationSelector from "../../components/locationSelector";
import { useRouter } from "next/router";
import Events from "../../components/events";
import { DEFAULT_LOCATION, LAST_LOCATION_KEY, Location, setLocation } from "../../helpers/locations";

interface Props {
  classes?: any;
  enqueueSnackbar: (message: string) => void;
}

const LocationPage: NextPage<Props> = ({ classes, enqueueSnackbar }) => {
  const router = useRouter();
  let location = (router.query.location && !Array.isArray(router.query.location)) ? router.query.location : DEFAULT_LOCATION;

  useEffect(() => {
    firebaseClient.analytics().logEvent("location_page_visit");
  }, []);

  // Handle last location saving/loading
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const lastLocation = window.localStorage.getItem(LAST_LOCATION_KEY);
    if (lastLocation && lastLocation !== DEFAULT_LOCATION && location === DEFAULT_LOCATION) {
      setLocation(router, lastLocation as Location);
    }
  }, [router.isReady])

  return (
    <div className={classes.page}>
      <CssBaseline />
      <IconBreadcrumbs crumbs={["Opportunities"]} parentURL={undefined} />
      <Typography variant="h3" gutterBottom style={{ fontFamily: "Encode Sans", fontWeight: 800, marginBottom: ".5rem", fontSize: "2.5rem"}}>
        OPPORTUNITIES
      </Typography>
      <img src={"../goldbar.png"} alt="" style={{ width: "310px", height: "13px", marginBottom: "30px" }}/>
      <div style={{
        marginTop: "2em"
      }}>
        <LocationSelector defaultLocation={DEFAULT_LOCATION} />
      </div>
      {location !== DEFAULT_LOCATION && <Events location={location as Location} />}
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
});

//@ts-ignore
export default withStyles(styles)(withSnackbar(LocationPage));
