import React, { useEffect, useState } from "react";
import { getAppAnalytics } from "firebaseClient";
import makeStyles from "@mui/styles/makeStyles";
import { Typography, Button, Tooltip } from "@mui/material";
import IconBreadcrumbs from "components/breadcrumbs";
import LocationSelector from "../../components/locationSelector";
import { useRouter } from "next/router";
import ProjectsList from "components/projectsList";
import HelpIcon from "@mui/icons-material/Help";
import {
  DEFAULT_LOCATION,
  LAST_LOCATION_KEY,
  Location,
  setLocation,
} from "../../helpers/locations";
import { handleHelpButtonClick } from "../../helpers/navigation";
import { useAuth } from "auth";
import { logEvent } from "firebase/analytics";
import AddModifyEventModal from "components/AddModifyEventModal";
import { useSearchParams } from "next/navigation";

const LocationPage = () => {
  const classes = useStyles();
  const router = useRouter();
  const { isAdmin } = useAuth();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const [createEventOpen, setCreateEventOpen] = useState(false);
  let location =
    router.query.location && !Array.isArray(router.query.location)
      ? router.query.location
      : DEFAULT_LOCATION;

  /*const handleHelpButtonClick = () => {
    router.push({
      pathname: '/help',
      query: { fromLocationPage: true },
    });
  };*/

  //new logic using helper function
  const handleHelpButtonClickLocation = () => {
    handleHelpButtonClick(router, "fromLocationPage");
  };
  useEffect(() => {
    const analytics = getAppAnalytics();
    logEvent(analytics, "location_page_visit");
  }, []);

  useEffect(() => {}, [from]);

  // Handle last location saving/loading
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const lastLocation = window.localStorage.getItem(LAST_LOCATION_KEY);
    if (
      lastLocation &&
      lastLocation !== DEFAULT_LOCATION &&
      location === DEFAULT_LOCATION
    ) {
      setLocation(router, lastLocation as Location);
    }
  }, [router.isReady]);

  return (
    <div className={classes.page}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <IconBreadcrumbs crumbs={["Opportunities"]} parentURL={undefined} />
          <Typography variant="h3" gutterBottom className={classes.header}>
            OPPORTUNITIES
          </Typography>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          {isAdmin && (
            <>
              <Button
                variant="contained"
                onClick={() => setCreateEventOpen(true)}
              >
                Create Project
              </Button>
              <AddModifyEventModal
                open={createEventOpen}
                location={location}
                handleClose={() => {
                  setCreateEventOpen(false);
                }}
              />
            </>
          )}
          <Tooltip title="Help" arrow>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<HelpIcon />}
              onClick={handleHelpButtonClickLocation}
            >
              Help
            </Button>
          </Tooltip>
        </div>
      </div>
      <img src={"../goldbar.png"} alt="" className={classes.bar} style={{}} />
      <div
        style={{
          marginTop: "2em",
        }}
      >
        <LocationSelector defaultLocation={DEFAULT_LOCATION} />
      </div>
      {location !== DEFAULT_LOCATION && (
        <ProjectsList location={location as Location} />
      )}
    </div>
  );
};

const useStyles = makeStyles(() => ({
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
  bar: {
    width: "310px",
    height: "11px",
    marginBottom: "30px",
    "@media only screen and (max-width: 600px)": {
      width: "245px",
    },
  },
}));

export default LocationPage;
