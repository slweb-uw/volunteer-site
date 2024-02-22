import React, {useEffect} from "react";
import { firebaseClient } from "../../firebaseClient";
import { NextPage } from "next";
import {
  createStyles,
  CssBaseline,
  Typography,
  withStyles,
  Button,
  Tooltip,
} from "@material-ui/core";
import { withSnackbar } from "notistack";
import IconBreadcrumbs from "components/breadcrumbs";
import LocationSelector from "../../components/locationSelector";
import { useRouter } from "next/router";
import Link from 'next/link';
import Events from "../events";
import HelpIcon from "@material-ui/icons/Help";
import { DEFAULT_LOCATION, LAST_LOCATION_KEY, Location, setLocation } from "../../helpers/locations";
import { handleHelpButtonClick } from "../../helpers/navigation";

interface Props {
  classes?: any;
  enqueueSnackbar: (message: string) => void;
}

const LocationPage: NextPage<Props> = ({ classes, enqueueSnackbar }) => {
  const router = useRouter();
  let location = (router.query.location && !Array.isArray(router.query.location)) ? router.query.location : DEFAULT_LOCATION;

  /*const handleHelpButtonClick = () => {
    router.push({
      pathname: '/help',
      query: { fromLocationPage: true },
    });
  };*/

  //new logic using helper function
  const handleHelpButtonClickLocation = () => {
    handleHelpButtonClick(router, 'fromLocationPage');
  };
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div>
          <IconBreadcrumbs crumbs={["Opportunities"]} parentURL={undefined} />
          <Typography variant="h3" gutterBottom className={classes.header}>
            OPPORTUNITIES
          </Typography>
        </div>
      <div>
        <Tooltip title="Help" arrow>
            <Button
              variant='outlined'
              color='secondary'
              startIcon={<HelpIcon />}
              onClick={handleHelpButtonClickLocation}
            >
              Help
            </Button>
          </Tooltip>
        </div>
      </div>
      <img src={"../goldbar.png"} alt=""  className={classes.bar} style={{ }}/>
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
    paddingTop: "1em",
    paddingBottom: "5em",
  },
  header: {
    fontFamily: "Encode Sans", 
    fontWeight: 800, 
    marginBottom: "0rem", 
    fontSize: "2.5rem",
    "@media only screen and (max-width: 600px)": {
      fontSize: "2rem",
    },
  },
  bar:{
    width: "310px", 
    height: "11px", 
    marginBottom: "30px",
    "@media only screen and (max-width: 600px)": {
      width: "245px", 
    },
  }
});

//@ts-ignore
export default withStyles(styles)(withSnackbar(LocationPage));
