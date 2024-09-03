import { useRouter } from "next/router";
import { useAuth } from "auth";
import React from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import IconBreadcrumbs from "../../components/breadcrumbs";
import makeStyles from "@mui/styles/makeStyles";

import { CssBaseline, Typography, Divider, Grid, Button } from "@mui/material";
import naturalJoin from "../../helpers/naturalJoin";
import EventDescription from "../../components/eventDescription";
import RichTextField from "../../components/richTextField";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import { firebaseAdmin } from "firebaseAdmin";

const initialGridKeys = [
  "Tips and Reminders",
  "Clinic Flow",
  "Required Trainings",
  "Address/Parking/Directions",
  "Provider Information",
] as const;

const reservedKeys = [ //most of these not needed?
  "Project Description",
  "Details",
  "Clinic Schedule",
  "Types of Volunteers Needed",
  "projectName",
  "Order",
  "Organization",
  "Location",
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
  "DateObject",
] as const;

type EventFieldProps = {
  name: string;
  value: string | string[] | JSX.Element | undefined;
};

type RichEventFieldProps = {
  name: string;
  value: string | string[] | undefined;
  removeTopMargin: boolean;
};

const EventField: React.FC<EventFieldProps> = ({ name, value }) => {
  let data: string | JSX.Element | undefined;
  if (value && Array.isArray(value)) {
    data = naturalJoin(value);
  } else {
    data = value;
  }
  if (!data) return null;
  return (
    <Box
      style={{
        pageBreakInside: "avoid",
        breakInside: "avoid-column",
        marginBottom: "5%",
      }}
    >
      <Typography variant="h6" style={{ fontWeight: 600 }}>
        {name}
      </Typography>
      <Typography>{data}</Typography>
    </Box>
  );
};

const RichEventField: React.FC<RichEventFieldProps> = ({
  name,
  value,
  removeTopMargin,
}) => {
  let data: string | undefined;
  if (value && Array.isArray(value)) {
    data = naturalJoin(value);
  } else {
    data = value;
  }
  const remove: boolean | undefined = removeTopMargin
    ? typeof data === "string" && data.includes("<p>")
    : false;
  if (!data) return null;
  return (
    <>
      <Box
        style={{
          pageBreakInside: "avoid",
          breakInside: "avoid-column",
          marginBottom: "5%",
        }}
      >
        <Typography variant="h6" style={{ fontWeight: 600 }}>
          {name}
        </Typography>
        <RichTextField value={data} removeTopMargin={remove ?? false} />
      </Box>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const event = ctx.params?.event;
     // Check that no extra params are passed
    if (typeof event === "undefined") {
        return {
            notFound: true,
        };
    }
    const data = await firebaseAdmin
      .firestore()
      .collection("events")
      .doc(event as string)
      .get();
  
    if (data.exists) {  //Check if event exists.
        const eventDate: string = data.data()?.date.toDate().toString(); // Convert Date object to string
        return { props: { event: { ...data.data(), date: eventDate } } };
    } else {
        // Handle the case where the event does not exist.
        return { notFound: true };
    }
    
  };

const useStyles = makeStyles(() => ({
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
    width: "100%",
    borderRadius: "10px",
    objectFit: "cover",
  },
}));

const Event = ({
  event: eventData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isAdmin } = useAuth();
  const classes = useStyles();
  //console.log(eventData);
  return (
    <div className={classes.page}>
      <CssBaseline />
      <IconBreadcrumbs
        parentURL={"/calendar"}
        crumbs={["Calendar", eventData.projectName]}
      />
      {/* EVENT TITLE */}
      <Typography variant="h5" style={{ fontWeight: 900, paddingBottom: 50 }}>
        {eventData?.projectName}
      </Typography>

      <Grid container spacing={6}>
        {/* <Grid item sm={12} md={6} className={classes.detailsImageContainer}>       //Do we want to show an image here?
          <Image
            className={classes.detailsImage}
            width={500}
            height={500}
            src={eventData?.imageURL ? eventData?.imageURL : "/beigeSquare.png"}
            alt={eventData.projectName}
          />
        </Grid> */}
        <Grid item container direction="column" sm={12} md={6}>
          <Stack direction="row" spacing={6} sx={{ marginTop: "5%" }}>
            <RichEventField
              name="Location"
              value={eventData?.location}
              removeTopMargin={true}
            />
            {/* <RichEventField
              name="Clinic Schedule"
              value={eventData["Clinic Schedule"]}
              removeTopMargin={true}
            /> */}
          </Stack>
          <RichEventField
            name="Contact Information"
            value={eventData["leadEmail"]}
            removeTopMargin={true}
          />
          {/* <RichEventField
            name="Website Link"
            value={eventData["Website Link"]}
            removeTopMargin={true}
          /> */}
          <RichEventField
            name="Types of Volunteers Needed"
            value={
              eventData["volunteerTypes"]
                ? naturalJoin(eventData["volunteerTypes"])
                : undefined
            }
            removeTopMargin={true}
          />
          {/* This href may need to be updated to link to specific signup timeslots */}
          {(eventData?.SignupActive || isAdmin) && (
            <Link href={`/${eventData.location}/${eventData.projectId}/signup`}> 
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

      <Divider
        style={{
          marginBottom: "3em",
          marginTop: "3em",
          height: 3,
          borderRadius: "25px",
        }}
      ></Divider>

      <Box sx={{ columns: { xs: 1, md: 2 }, columnGap: 8 }}>
        <EventField
          name="Project Description"
          value={<EventDescription event={eventData} />}
        />
        {initialGridKeys
          .filter((name) => eventData[name] != null && eventData[name] != "")
          .map((name) => (
            <RichEventField
              key={name}
              name={name}
              value={eventData[name]}
              removeTopMargin={true}
            />
          ))}
        {Object.keys(eventData)
          .filter((name) => !reservedKeys.includes(name))
          .filter((name) => eventData[name] != null && eventData[name] != "")
          .filter((name) => name != "SignupActive")
          .map((name) => (
            <RichEventField
              key={name}
              name={name}
              value={eventData[name]}
              removeTopMargin={true}
            />
          ))}
      </Box>
    </div>
  );
};

export default Event;