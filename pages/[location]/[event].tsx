import { useRouter } from "next/router";
import { useAuth } from "auth";
import { firebaseClient } from "../../firebaseClient";
import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import IconBreadcrumbs from "../../components/breadcrumbs";

import {
  createStyles,
  CssBaseline,
  Typography,
  Divider,
  withStyles,
  Grid,
  Button,
} from "@material-ui/core";
import naturalJoin from "../../helpers/naturalJoin";
import EventDescription from "../../components/eventDescription";
import RichTextField from "../../components/richTextField";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Link from "next/link";
interface Props {
  classes?: any;
}

const initialGridKeys = [
  "Tips and Reminders",
  "Clinic Flow",
  "Required Trainings",
  "Address/Parking/Directions",
  "Provider Information",
];

const reservedKeys = [
  "Project Description",
  "Details",
  "Clinic Schedule",
  "Types of Volunteers Needed",
  "Title",
  "Order",
  "Organization",
  "Location",
  "Contact Information and Cancellation Policy",
  "Contact Information",
  "Website Link",
  "Address;Parking;Directions",
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
  "cardImageURL",
  "DateObject"
];

type EventFieldProps = {
  name: string;
  value: string | string[] | JSX.Element | undefined;
}

type RichEventFieldProps = {
  name: string;
  value: string | string[] | undefined;
  removeTopMargin: boolean;
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
  if(!data) return null;
  return (
      <Box style={{ pageBreakInside: "avoid", breakInside: "avoid-column", marginBottom: "5%"}}>
      <Typography variant="h6" style={{ fontWeight: 600 }}>
        {name}
      </Typography>
      <Typography>{data}</Typography>
    </Box>
  );
}

const RichEventField: React.FC<RichEventFieldProps> = ({
  name,
  value,
  removeTopMargin
}) => {
  let data: string | undefined;
  if (value && Array.isArray(value)) {
    data = naturalJoin(value);
  } else {
    data = value;
  }
  const remove: boolean | undefined = removeTopMargin ? (typeof data === 'string' && data.includes("<p>")) : false;
  if(!data) return null;
  return (
    <>
      <Box style={{ pageBreakInside: "avoid", breakInside: "avoid-column", marginBottom: "5%" }} >
        <Typography variant="h6" style={{ fontWeight: 600 }}>
          {name}
        </Typography>
          <RichTextField value={data} removeTopMargin={remove ?? false} />  
      </Box>
    </>
  );
}

const Event: NextPage<Props> = ({ classes }) => {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const { event, location } = router.query; // current event id and location
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
    setEventData(next.data() as EventData);
  };

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
        parentURL={"/opportunities/" + location}
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
            alt={eventData.Title}
          />
        </Grid>
        <Grid item container direction="column" sm={12} md={6}>
          <Stack direction="row" spacing={6} sx={{marginTop: "5%"}}>
            <RichEventField
              name="Location"
              value={eventData?.Location}
              removeTopMargin={true}
            />
            <RichEventField
              name="Clinic Schedule"
              value={eventData["Clinic Schedule"]}
              removeTopMargin={true}
            />
          </Stack>
          <RichEventField
            name="Contact Information"
            value={eventData["Contact Information"] || eventData["Contact Information and Cancellation Policy"]}
            removeTopMargin={true}
          />
          <RichEventField
            name="Website Link"
            value={eventData["Website Link"]}
            removeTopMargin={true}
          />
          <RichEventField 
            name="Types of Volunteers Needed"
            value={eventData["Types of Volunteers Needed"] ? naturalJoin(eventData["Types of Volunteers Needed"]) : undefined}
            removeTopMargin={true}
          />
          { (eventData?.SignupActive || isAdmin) && (
            <Link href={`/${location}/${eventData.id}/signup`}>
              <Button
                color="primary"
                variant="contained"
                style={{ marginRight: "1em" }}
              >
                Sign up
              </Button>
            </Link>
          )}
         
        </Grid>
      </Grid>

      <Divider style={{ marginBottom: "3em", marginTop: "3em", height: 3, borderRadius: "25px"}}></Divider>

      <Box sx={{ columns: { xs: 1, md: 2 }, columnGap: 8 }}>
        <EventField name="Project Description" value={<EventDescription event={eventData} />} />
        {initialGridKeys.filter((name) => eventData[name] != null && eventData[name] != "").map((name) => (
          <RichEventField key={name} name={name} value={eventData[name]} removeTopMargin={true} />
        ))}
        {Object.keys(eventData)
          .filter((name) => !reservedKeys.includes(name))
          .filter((name) => eventData[name] != null && eventData[name] != "")
          .filter((name) => name != "SignupActive")
          .map((name) => (
            <RichEventField key={name} name={name} value={eventData[name]} removeTopMargin={true} />
          ))}
      </Box>
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
    maxWidth: "500px",
  },
  detailsImage: {
    minWidth: "100%",
    minHeight: "100%",
    borderRadius: "10px",
    objectFit: "cover",
  },
});
export default withStyles(styles)(Event);
