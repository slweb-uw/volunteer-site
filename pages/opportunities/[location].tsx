import React, {useEffect, useState} from "react";
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
import {useRouter} from "next/router";
import Events from "../../components/events";
import setLocation from "../../helpers/setLocation";

// The default location, representing no location
const DEFAULT_LOCATION = "default";
// The local storage key to store the last location in
const LAST_LOCATION_KEY = "last_location"

interface Props {
  classes?: any;
  enqueueSnackbar: (message: string) => void;
}

const Location: NextPage<Props> = ({ classes, enqueueSnackbar }) => {
  const router = useRouter();
  let location = (router.query.location && !Array.isArray(router.query.location)) ? router.query.location : DEFAULT_LOCATION;

  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    firebaseClient.analytics().logEvent("location_page_visit");
  }, []);

  useEffect(() => {
    if (router.query.location) {
      if (loaded) {
        window.localStorage.setItem(LAST_LOCATION_KEY, location);
      } else {
        const lastLocation = window.localStorage.getItem(LAST_LOCATION_KEY);
        if (lastLocation && lastLocation !== DEFAULT_LOCATION && location === DEFAULT_LOCATION) {
          setLocation(router, lastLocation);
        }
        setLoaded(true);
      }
    }
  }, [router.query.location])

  return (
    <div className={classes.page}>
      <CssBaseline />
      <IconBreadcrumbs crumbs={["Opportunities"]} parentURL={undefined} />
      <Typography variant="h3" gutterBottom>
        Opportunities
      </Typography>

      <div style={{
        marginTop: "2em"
      }}>
        <LocationSelector defaultLocation={DEFAULT_LOCATION} />
      </div>
      {location !== DEFAULT_LOCATION && <Events location={location as unknown as Location} />}
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
export default withStyles(styles)(withSnackbar(Location));
