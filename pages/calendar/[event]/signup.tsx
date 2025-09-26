import { useRouter } from "next/router";
import { useAuth } from "auth";
import React, { useState } from "react";
import { GetServerSideProps } from "next";
import Image from "next/image";
import IconBreadcrumbs from "../../../components/breadcrumbs";
import makeStyles from "@mui/styles/makeStyles";
import { EventData, VolunteerData } from "../../../new-types";
import { CssBaseline, Typography, Divider, Grid, Button } from "@mui/material";
import naturalJoin from "../../../helpers/naturalJoin";
import RichTextField from "../../../components/richTextField";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import VolunteerPopup from "components/VolunteerSignupPopup";
import { firebaseAdmin } from "firebaseAdmin";
import { doc, runTransaction, getDoc, deleteDoc, DocumentData } from "firebase/firestore";
import { db } from "firebaseClient";
import AuthorizationMessage from "pages/AuthorizationMessage";
import VolunteerSignupGrid from "../../../components/VolunteerSignupGrid";

const initialGridKeys = [
  "Tips and Reminders",
  "Clinic Flow",
  "Required Trainings",
  "Address/Parking/Directions",
  "Provider Information",
] as const;

const reservedKeys = [
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
  const { event } = ctx.params ?? {};

  if (!event || typeof event !== "string") {
    return {
      notFound: true,
    };
  }

  const eventRef = firebaseAdmin.firestore().collection("events").doc(event);
  const eventDoc = await eventRef.get();

  if (!eventDoc.exists) {
    return { notFound: true };
  }

  const volunteersSnapshot = await eventRef.collection("volunteers").get();
  const volunteerData = volunteersSnapshot.docs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
  }));
  
  const rawEventData = eventDoc.data() as DocumentData;

  //  Serialize Firestore Timestamps to ISO strings for Next.js props
  const eventData = {
    ...rawEventData,
    // Safely access and convert the date if it exists
    date: rawEventData.date?.toDate?.().toISOString() || null,
  };

  return { props: { eventData, volunteer: volunteerData, eventID: event } };
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
  const [editedVolunteer, setEditedVolunteer] = useState<VolunteerData | null>(null);
  const [openVolunteerPopup, setOpenVolunteerPopup] = useState(false);

  const currentUserVolunteerRecord = user
    ? volunteer.find((v) => v.uid === user.uid)
    : undefined;

  if (!isAdmin && !isAuthorized && !isLead) {
    return <AuthorizationMessage user={user} />;
  }

  const handleCloseVolunteerPopup = () => {
    setSelectedRole("");
    setOpenVolunteerPopup(false);
    setEditedVolunteer(null);
    // Refresh the page data after a change by re-running getServerSideProps
    router.replace(router.asPath);
  };

  // Updated volunteer signup logic with a Firestore transaction
  const handleAddVolunteer = async (volunteerData: VolunteerData) => {
    if (!selectedRole || !user) return;

    const eventRef = doc(db, "events", eventID);
    const volunteerRef = doc(db, `events/${eventID}/volunteers`, user.uid);

    try {
      await runTransaction(db, async (transaction) => {
        const eventDoc = await transaction.get(eventRef);
        if (!eventDoc.exists()) {
          throw new Error("Event does not exist!");
        }

        // Server-side check to see if the user is already signed up for any role
        const existingVolunteerDoc = await transaction.get(volunteerRef);
        if (existingVolunteerDoc.exists()) {
          throw new Error("You are already signed up for a role in this event.");
        }

        const spotsOpen = eventDoc.data().openings?.[selectedRole];
        if (spotsOpen === undefined || spotsOpen < 1) {
          throw new Error("No spots left for this position.");
        }

        transaction.update(eventRef, {
          [`openings.${selectedRole}`]: spotsOpen - 1,
        });

        transaction.set(volunteerRef, {
          ...volunteerData,
          role: selectedRole,
        });
      });
      handleCloseVolunteerPopup();
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    }
  }; 
  
  const handleOpenVolunteerPopup = (type: string) => {
    // If the user is already registered, open the popup in "edit" mode
    if (currentUserVolunteerRecord) {
      setEditedVolunteer(currentUserVolunteerRecord);
      setSelectedRole(currentUserVolunteerRecord.role);
    } else {
      // Otherwise, open in "new signup" mode
      setEditedVolunteer(null);
      setSelectedRole(type);
    }
    setOpenVolunteerPopup(true);
  };

  

  // Updated volunteer withdrawal logic to use a transaction
  const handleDeleteVolunteer = async (volunteerData: VolunteerData, mode: string) => {
    const message = mode === "remove"
      ? "Are you sure you want to remove this volunteer?"
      : "Are you sure you want to withdraw from this role?";

    if (!window.confirm(message)) {
      return;
    }

    const eventRef = doc(db, "events", eventID);
    const volunteerRef = doc(db, `events/${eventID}/volunteers`, volunteerData.uid);

    try {
        await runTransaction(db, async (transaction) => {
            const volunteerDoc = await transaction.get(volunteerRef);
            const eventDoc = await transaction.get(eventRef);

            if (!volunteerDoc.exists() || !eventDoc.exists()) {
                throw new Error("Could not find the necessary event or volunteer data.");
            }
            
            const volunteerRole = volunteerDoc.data().role;
            const currentOpenings = eventDoc.data().openings?.[volunteerRole];

            // Atomically increment the role's opening count
            if (typeof currentOpenings === 'number') {
                transaction.update(eventRef, {
                    [`openings.${volunteerRole}`]: currentOpenings + 1,
                });
            }

            // Atomically delete the volunteer document
            transaction.delete(volunteerRef);
        });
        handleCloseVolunteerPopup();
    } catch (e: any) {
        alert(`Error: ${e.message}`);
    }
  };

  return (
    <div className={classes.page}>
      <CssBaseline />
      <IconBreadcrumbs
        parentURL={`/${eventData?.location}/${eventData?.projectId}/calendar`}
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
          </Stack>
          <RichEventField
            name="Contact Information"
            value={eventData?.leadEmail}
            removeTopMargin={true}
          />
          <RichEventField
            name="Types of Volunteers Needed"
            value={
              eventData?.volunteerTypes
                ? naturalJoin(eventData?.volunteerTypes)
                : undefined
            }
            removeTopMargin={true}
          />
        </Grid>
      </Grid>
      {/* Render the new grid if there are openings defined - NOTE: We need to replace true with a conditional */}
      {true && (
        <Box sx={{ my: 4 }}>
          <VolunteerSignupGrid
            eventData={eventData}
            volunteers={volunteer}
            onSignUp={handleOpenVolunteerPopup}
          />
        </Box>
      )}

      {/* Show a clear "Manage Registration" button if the user is signed up */}
      {currentUserVolunteerRecord && (
        <Box sx={{ mt: -2, mb: 4, display: 'flex', justifyContent: 'flex-start' }}>
            <Button 
                variant="contained" 
                onClick={() => handleOpenVolunteerPopup(currentUserVolunteerRecord.role)}
            >
                Manage my Registration ({currentUserVolunteerRecord.role})
            </Button>
        </Box>
      )}
      <Divider
        style={{
          marginBottom: "3em",
          marginTop: "3em",
          height: 3,
          borderRadius: "25px",
        }}
      ></Divider>
      {/* Note: All of this will be replaced with cleaner, proper design */}
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
          .filter((name) => !reservedKeys.includes(name as any))
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