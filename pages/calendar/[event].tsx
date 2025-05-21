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
import { addDoc, collection, deleteField, doc, runTransaction, setDoc, updateDoc } from "firebase/firestore";
import { db } from "firebaseClient";
import AuthorizationMessage from "pages/AuthorizationMessage";

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
        return { props: { eventData: { ...data.data(), date: eventDate }, volunteer: volunteerData, eventID: event } };
    } else {
        // Handle the case where the event does not exist.
        return { notFound: true };
    }
    
  };

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
    volunteer,
    eventID,
  }: {
    eventData: EventData;
    volunteer: VolunteerData[];
    eventID: string;
  }) => {
  const classes = useStyles();
  const router = useRouter();
  const { user, isAdmin, isAuthorized, isLead } = useAuth();
  const [selectedRole, setSelectedRole] = useState("");
  const [editedVolunteer, setEditedVolunteer] = useState(null);
  const [openVolunteerPopup, setOpenVolunteerPopup] = useState(false);

  if (!isAdmin && !isAuthorized && !isLead) {
    return <AuthorizationMessage user={user} />;
  }
  
  const handleOpenVolunteerPopup = (type: string) => {
    setSelectedRole(type);
    setOpenVolunteerPopup(true);
  };

  const handleCloseVolunteerPopup = () => {
    setSelectedRole("");
    setOpenVolunteerPopup(false);
    setEditedVolunteer(null);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, },
    });
  };

  const handleAddVolunteer = async (volunteerData: VolunteerData) => {
    if (selectedRole) {
      const existingRolesOnEvent = volunteer || {};
      const hasSignedUpForEvent = (existingRolesOnEvent).some(
        (user) => user.role === selectedRole && user.uid === volunteerData.uid
      ); //Notice: Right now, only stops the user from re-signing up for the same role, 
         //but will allow the number of signups to be decreased arbitrarily if someone spams between roles. This should be clarified.

      if (hasSignedUpForEvent) {
        alert("You have already signed up for this role on this event.");
      } else {
        const eventRef = doc(
          db,
          `events/${eventID}/volunteers`,
          volunteerData.uid
        );
        const roleRef = doc(db, `events/${eventID}`);
        try {
            await runTransaction(db, async (transaction) => {
                const positionDoc = await transaction.get(roleRef);
                if (!positionDoc.exists()) {
                    throw new Error("Position does not exist!");
                    }
                const spotsOpen = positionDoc.data().openings[selectedRole];
                if (spotsOpen < 1) {
                    throw new Error("No spots left for this position.");
                }
                transaction.update(roleRef, {
                    [`openings.${selectedRole}`]: spotsOpen - 1, 
                });

                transaction.set(eventRef, { 
                  ...volunteerData, role: selectedRole,
                }); 
            });
            handleCloseVolunteerPopup();
        } catch (e: any) {
          alert(e.message);
        }
      }
    }
  };

    //TBD: May be used in near future.
  const handleDeleteVolunteer = (volunteerData: VolunteerData, mode: String) => {
    if (selectedRole) {
      let message = "Are you sure you want to withdraw from this role?";

      if (mode === "remove") {
        message = "Are you sure you want to remove this volunteer?";
      }

      const isConfirmed = window.confirm(message);

      if (isConfirmed) {
        const uid = volunteerData.uid;
        const eventRef = doc(
          db,
          `events/${eventID}/volunteers`,
          volunteerData.uid
        );
        updateDoc(eventRef, {
          [uid]: deleteField(),
        }).then(() => {
          handleCloseVolunteerPopup();
        });
      }
    }
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
            {/* Notice: These commented fields are subject to change based on what we want to display on the signup page. */}
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
          {/* This flexbox is just for spacing out signup buttons, can be replaced with better styling later. */}
          <Grid container spacing={3}>
          {eventData?.openings && 
          Object.entries(eventData.openings).map(([volunteerRole, spotsOpen], index) => (
             <Grid item key={index}>
            {(spotsOpen > 0 || (isAdmin && false)) && (
                <Link href={router.asPath} passHref> 
                <Button color="primary" variant="contained" 
                style={{ marginRight: "1em" }} 
                onClick={() => handleOpenVolunteerPopup(volunteerRole)}
                >
                Sign up for {volunteerRole} </Button> </Link> )} 
                {(!(isAdmin && false) && (spotsOpen <= 0)) && ( 
                    <Link href={router.asPath} passHref> 
                    <Button color="primary" variant="contained" 
                    style={{ marginRight: "1em" }} disabled 
                    >
                    Sign up for {volunteerRole} unavailable </Button>
                    </Link> 
                )} 
            </Grid>
          ))}
          </Grid>
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
          value={<RichTextField value={eventData.eventInformation} removeTopMargin={true} />}
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
    {user && (
        <VolunteerPopup
            open={openVolunteerPopup}
            handleClose={handleCloseVolunteerPopup}
            email={user.email}
            name={user.displayName}
            uid={user.uid}
            phone={user.phoneNumber}
            position={selectedRole}
            addVolunteer={handleAddVolunteer}
            volunteer={editedVolunteer}
            onDeleteVolunteer={handleDeleteVolunteer}
        />
    )}
    </div>
  );
};

export default Event;