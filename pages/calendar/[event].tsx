import { useRouter } from "next/router";
import { useAuth } from "auth";
import React, { useState } from "react";
import { GetServerSideProps} from "next";
import Image from "next/image";
import IconBreadcrumbs from "../../components/breadcrumbs";
import makeStyles from "@mui/styles/makeStyles";
import { EventData, VolunteerData } from "../../new-types";
import { CssBaseline, Typography, Divider, Grid, Button } from "@mui/material";
import naturalJoin from "../../helpers/naturalJoin";
import RichTextField from "../../components/richTextField";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import VolunteerInfoPopup from "components/VolunteerInfoPopup";
import SignupEventPopup from "components/SignupEventPopup";
import VolunteerPopup from "components/VolunteerSignupPopup";
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
        const volunteers = await firebaseAdmin
              .firestore()
              .collection(`events/${event as string}/volunteers`)
              .get();
        const volunteerData = volunteers.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const eventDate: string = data.data()?.date.toDate().toString(); // Convert Date object to string
        return { props: { eventData: { ...data.data(), date: eventDate }, volunteer: volunteerData } };
    } else {
        // Handle the case where the event does not exist.
        return { notFound: true };
    }
    
  };

  //TODO: Get open slots for volunteer (based on the data contained in the volunteers field of the event, which is actually a collection in the firebase db).
  //TODO: Check if slots are full.
  //TODO: Signup person for event.
  //TODO: Update slots on event update.
  //TODO: Add event to new personal calander?

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
    eventData,
    volunteer,  //For use in lead view, will show who is currently signed up.
  }: {
    eventData: EventData;
    volunteer: VolunteerData[];
  }) => {
  const classes = useStyles();
  const router = useRouter();
  const { user, isAdmin, isAuthorized, isLead } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editedEvent, setEditedEvent] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [editedVolunteer, setEditedVolunteer] = useState(null);
  const [openVolunteerInfoPopup, setOpenVolunteerInfoPopup] = useState(false);
  const [volunteerInfo, setVolunteerInfo] = useState(null);
  const [openVolunteerPopup, setOpenVolunteerPopup] = useState(false);
  const [openEventFormPopup, setOpenEventFormPopup] = useState(false);

  const handleOpenVolunteerPopup = (type) => {
    setSelectedRole(type);
    setOpenVolunteerPopup(true);
  };

  const handleCloseVolunteerPopup = () => {
    setSelectedRole("");
    setOpenVolunteerPopup(false);
    setEditedVolunteer(null);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, selectedEventId: selectedEvent?.id },
    });
  };

  const handleEventAction = (action: string, eventData: any) => {
    // TODO: lets handle edit and delete this would not work any more
    // because we are not using the generate unique id
    console.log(eventData)
    if (action === "add") {
      addDoc(collection(db, "events"), {
        ...eventData,
        projectName: title,
        projectId: event,
        // this is for caledar query
        calendar: `${eventData.date.getFullYear()}-${eventData.date.getMonth()}`,
        date: Timestamp.fromDate(eventData.date),
        location: location,
      }).then(() => setSelectedEvent(eventData));
    } else if (action === "edit") {
      //  setDoc(eventRef, eventData).then(() => {
      // setSelectedEvent(eventData);
      // });
    } else if (action === "delete") {
      // deleteDoc(eventRef)
    }
  };

  const handleAddVolunteer = (volunteerData) => {
    if (selectedRole) {
      const existingRolesOnEvent = selectedEvent.volunteers || {};
      const hasSignedUpForEvent = Object.keys(existingRolesOnEvent).some(
        (role) =>
          role !== selectedRole &&
          Object.keys(existingRolesOnEvent[role]).some(
            (uid) =>
              existingRolesOnEvent[role][uid].date === volunteerData.date,
          ),
      );

      if (hasSignedUpForEvent) {
        alert("You have already signed up for another role on this event.");
      } else {
        const eventRef = doc(
          db,
          `${location}/${event}/signup/${selectedEvent?.id}`,
        );
        updateDoc(eventRef, {
          [`volunteers.${selectedRole}.${volunteerData.uid}`]: volunteerData,
        }).then(() => {
          handleCloseVolunteerPopup();
        });
      }
    }
  };

  const handleDeleteVolunteer = (volunteer, mode: String) => {
    if (selectedRole) {
      let message = "Are you sure you want to withdraw from this role?";

      if (mode === "remove") {
        message = "Are you sure you want to remove this volunteer?";
      }

      const isConfirmed = window.confirm(message);

      if (isConfirmed) {
        const eventId = selectedEvent?.id;
        const uid = volunteer.uid;
        const eventRef = doc(
          db,
          `${location}/${event}/signup/${selectedEvent?.id}`,
        );
        updateDoc(eventRef, {
          [`volunteers.${selectedRole}.${uid}`]: deleteField(),
        }).then(() => {
          handleCloseVolunteerPopup();
          handleCloseVolunteerInfoPopup();
        });
      }
    }
  };

  const handleOpenVolunteerInfoPopup = (user: any, type: any) => {
    setVolunteerInfo(user);
    setSelectedRole(type);
    setOpenVolunteerInfoPopup(true);
  };

  const handleCloseVolunteerInfoPopup = () => {
    setVolunteerInfo(null);
    setOpenVolunteerInfoPopup(false);
  };

  return (
    <div className={classes.page}>
      <CssBaseline />
      <IconBreadcrumbs
        parentURL={"/calendar"}
        crumbs={["Calendar", eventData?.projectName]}
      />
      {/* EVENT TITLE */}
      <Typography variant="h5" style={{ fontWeight: 900, paddingBottom: 50 }}>
        {eventData?.projectName}
      </Typography>

      <Grid container spacing={6}>
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
            value={eventData?.leadEmail}
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
              eventData?.volunteerTypes
                ? naturalJoin(eventData?.volunteerTypes)
                : undefined
            }
            removeTopMargin={true}
          />
          
          {(eventData?.openings && (eventData?.openings[0].spotsOpen as number > volunteer.length) || isAdmin) && (  //This signup is for the first volunteer position, possible for multiple, just need to duplicate instead.
                                                                                                                     //Just needs to check types to match how many to which position.
            <Link href={router.asPath} passHref> 
            {/* Intended to update the page, but not link elsewhere, while styling as a button link. Might be better way? */}
              <Button
                color="primary"
                variant="contained"
                style={{ marginRight: "1em" }}
                onClick={() => handleOpenVolunteerPopup("test")}
              >
                Sign up
              </Button>
            </Link>
          )}
          {((eventData?.openings[0].spotsOpen as number < 1) || (eventData?.openings[0].spotsOpen as number <= volunteer.length)) && ( 
            <Link href={router.asPath} passHref>
              <Button
                color="primary"
                variant="contained"
                style={{ marginRight: "1em" }}
              >
                Sign up unavailable
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
          value={<RichTextField value={eventData.eventInformation} removeTopMargin={true} />} //This used to pull from eventDescription, though eventDescription should be more aptly named ProjectDescription now.
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
      {/* <SignupEventPopup
        open={openEventFormPopup}
        close={() => setOpenEventFormPopup(false)}
        mode={editedEvent ? "edit" : "add"}
        event={editedEvent}
        handleEventAction={handleEventAction}
      /> */}
      <VolunteerPopup
        open={openVolunteerPopup}
        handleClose={handleCloseVolunteerPopup}
        email={user?.email}
        name={user?.displayName}
        uid={user?.uid}
        phone={user?.phoneNumber}
        addVolunteer={handleAddVolunteer}
        volunteer={editedVolunteer}
        onDeleteVolunteer={handleDeleteVolunteer}
      />
      {/* <VolunteerInfoPopup
        open={openVolunteerInfoPopup}
        handleClose={handleCloseVolunteerInfoPopup}
        volunteer={volunteerInfo}
        handleDelete={handleDeleteVolunteer}
      /> */}
    </div>
  );
};

export default Event;