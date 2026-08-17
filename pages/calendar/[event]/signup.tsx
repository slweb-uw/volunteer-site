import { useRouter } from "next/router";
import { useAuth } from "auth";
import React, { useState } from "react";
import { GetServerSideProps } from "next";
import makeStyles from "@mui/styles/makeStyles";
import { EventData, SlotData, VolunteerData } from "../../../new-types";
import { slotId, dateKeyOf } from "helpers/slots";
import { CssBaseline, Typography, Divider, Button } from "@mui/material";
import naturalJoin from "../../../helpers/naturalJoin";
import RichTextField from "../../../components/richTextField";
import Box from "@mui/material/Box";
import VolunteerPopup from "components/VolunteerSignupPopup";
import { firebaseAdmin } from "firebaseAdmin";
import { doc, runTransaction, DocumentData } from "firebase/firestore";
import { db } from "firebaseClient";
import AuthorizationMessage from "pages/AuthorizationMessage";
import VolunteerSignupGrid from "../../../components/VolunteerSignupGrid";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useSnackbar } from "notistack";

type RichEventFieldProps = {
  name: string;
  value: string | string[] | undefined;
  removeTopMargin: boolean;
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
          marginBottom: "3%",
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

  const slotsSnapshot = await eventRef.collection("slots").get();
  const slotData = slotsSnapshot.docs.map((doc) => doc.data() as SlotData);

  const rawEventData = eventDoc.data() as DocumentData;

  const eventData = {
    ...rawEventData,
    date: rawEventData.date?.toDate?.().toISOString() || null,
    dates: rawEventData.dates?.map((d: any) => d.toDate().toISOString()) || [],
  };

  return {
    props: {
      eventData,
      volunteer: volunteerData,
      slots: slotData,
      eventID: event,
    },
  };
};

const useStyles = makeStyles(() => ({
  page: {
    fontFamily: "Encode Sans, sans-serif",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 1500,
    marginBottom: 100,
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
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh",
  },
}));

const Event = ({
  eventData,
  volunteer,
  slots,
  eventID,
}: {
  eventData: EventData;
  volunteer: VolunteerData[];
  slots: SlotData[];
  eventID: string;
}) => {
  //snackbar notification
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const router = useRouter();
  const { date: queryDate } = router.query;
  const datesInfo = React.useMemo(() => {
    if (!eventData.dates || eventData.dates.length === 0) {
      return eventData.date ? [eventData.date.toString()] : [];
    }
    const dateStrings = eventData.dates as unknown as string[];
    const sortedDates = [...dateStrings].sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );
    const targetQuery =
      typeof queryDate === "string" ? queryDate : sortedDates[0];
    const targetDay = new Date(targetQuery).toISOString().split("T")[0];
    const targetIndex = sortedDates.findIndex(
      (d) => new Date(d).toISOString().split("T")[0] === targetDay,
    );
    // return all dates and target index if it exists, otherwise default to first date
    return [sortedDates, targetIndex == -1 ? 0 : targetIndex];
  }, [eventData.dates, eventData.date, queryDate]);
  const { user, isAdmin, isAuthorized, isLead, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDateSignup, setSelectedDateSignup] = useState("");
  const [editedVolunteer, setEditedVolunteer] = useState<VolunteerData | null>(
    null,
  );
  const [openVolunteerPopup, setOpenVolunteerPopup] = useState(false);

  const getCurrentUserRecordForDate = (date: string) => {
    if (!user) return undefined;
    return volunteer.find(
      (v) =>
        v.uid === user.uid &&
        v.date &&
        v.date.split("T")[0] === date.split("T")[0],
    );
  };

  if (isLoading) {
    return <div className={classes.loadingContainer}>Loading...</div>;
  }
  if (isLoading == false && !isAdmin && !isAuthorized && !isLead) {
    return <AuthorizationMessage user={user} />;
  }

  const handleCloseVolunteerPopup = () => {
    setOpenVolunteerPopup(false);
    setSelectedRole("");
    setSelectedDateSignup("");
    setEditedVolunteer(null);
    router.replace(router.asPath, undefined, { scroll: false });
  };

  const handleAddVolunteer = async (volunteerData: VolunteerData) => {
    if (!selectedRole || !user || !selectedDateSignup) return;

    const dateKey = dateKeyOf(selectedDateSignup);
    // COMPOSITE KEY: uid + date ensures uniqueness per day, but allows multiple days
    const docId = `${user.uid}_${dateKey}`;
    const volunteerRef = doc(db, `events/${eventID}/volunteers`, docId);
    const slotRef = doc(
      db,
      `events/${eventID}/slots`,
      slotId(dateKey, selectedRole),
    );
    try {
      await runTransaction(db, async (transaction) => {
        // All reads must precede all writes inside a transaction.
        const slotDoc = await transaction.get(slotRef);
        if (!slotDoc.exists()) {
          throw new Error("This role is not available for this date.");
        }

        const existingVolunteerDoc = await transaction.get(volunteerRef);
        if (existingVolunteerDoc.exists()) {
          throw new Error("You are already signed up for this date.");
        }

        const { remaining } = slotDoc.data() as SlotData;
        if (remaining < 1) {
          throw new Error("No spots left for this position.");
        }

        transaction.update(slotRef, { remaining: remaining - 1 });

        transaction.set(volunteerRef, {
          ...volunteerData,
          role: selectedRole,
          date: selectedDateSignup,
          uid: user.uid,
        });
      });
      handleCloseVolunteerPopup();
      enqueueSnackbar("Signup successfully created", {
        variant: "success",
        autoHideDuration: 3000,
      });
    } catch (e: any) {
      enqueueSnackbar(`Signup failed: ${e.message}`, {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };

  const handleOpenVolunteerPopup = (type: string, date: string) => {
    setSelectedDateSignup(date); // Capture the date context

    // check if they are already registered for THIS date
    const recordForDate = getCurrentUserRecordForDate(date);

    if (recordForDate) {
      setEditedVolunteer(recordForDate);
      setSelectedRole(recordForDate.role);
    } else {
      setEditedVolunteer(null);
      setSelectedRole(type);
    }
    setOpenVolunteerPopup(true);
  };

  const handleDeleteVolunteer = async (
    volunteerData: VolunteerData,
    mode: string,
  ) => {
    if (!volunteerData.date) {
      enqueueSnackbar(
        "Deletion failed: Missing date information for this record",
        { variant: "error", autoHideDuration: 3000 },
      );
      return;
    }

    const message =
      mode === "remove"
        ? "Are you sure you want to remove this volunteer?"
        : "Are you sure you want to withdraw from this role?";

    if (!window.confirm(message)) return;

    const dateKey = dateKeyOf(volunteerData.date);
    // Reconstruct Composite Key
    const docId = `${volunteerData.uid}_${dateKey}`;
    const volunteerRef = doc(db, `events/${eventID}/volunteers`, docId);

    try {
      await runTransaction(db, async (transaction) => {
        const volunteerDoc = await transaction.get(volunteerRef);
        if (!volunteerDoc.exists()) throw new Error("Error finding data.");

        const volunteerRole = volunteerDoc.data().role;
        const slotRef = doc(
          db,
          `events/${eventID}/slots`,
          slotId(dateKey, volunteerRole),
        );
        const slotDoc = await transaction.get(slotRef);

        // The old code skipped the increment when the count was missing but
        // deleted the record anyway, silently destroying a spot. Refuse instead.
        if (!slotDoc.exists()) {
          throw new Error(
            "Could not find the slot for this signup. Nothing was changed.",
          );
        }

        const { remaining, capacity } = slotDoc.data() as SlotData;
        if (remaining >= capacity) {
          throw new Error(
            "This slot already shows every spot open. Nothing was changed.",
          );
        }

        transaction.update(slotRef, { remaining: remaining + 1 });
        transaction.delete(volunteerRef);
      });
      handleCloseVolunteerPopup();
      enqueueSnackbar("Signup successfully removed", {
        variant: "success",
        autoHideDuration: 3000,
      });
    } catch (e: any) {
      enqueueSnackbar(`Deletion failed: ${e.message}`, {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };

  return (
    <div className={classes.page}>
      <CssBaseline />
      <Box sx={{ mb: 3 }}>
        <Button
          onClick={() => router.back()}
          startIcon={
            <ArrowBackIosNewIcon sx={{ fontSize: "1.2rem !important" }} />
          }
          sx={{
            color: "#4b2e83",
            fontWeight: 700,
            textTransform: "uppercase",
            fontSize: "1.2rem",
            paddingLeft: 0,
            "&:hover": {
              backgroundColor: "transparent",
              textDecoration: "underline",
            },
          }}
        >
          Back
        </Button>
      </Box>
      {/* EVENT TITLE */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          style={{
            fontWeight: 900,
            color: "#4C2F83",
            marginBottom: "4px",
            fontFamily: "Encode Sans, sans-serif",
          }}
        >
          {eventData?.name} - Sign Up
        </Typography>
        <Typography variant="body1" style={{ color: "#000", fontSize: "1rem" }}>
          Hosted by{" "}
          <span style={{ textDecoration: "underline" }}>
            {eventData.projectName}
          </span>
        </Typography>
      </Box>

      <Box sx={{ mb: 1, maxWidth: "800px" }}>
        <RichEventField
          name="Event Description"
          value={eventData?.eventInformation}
          removeTopMargin={true}
        />
        <RichEventField
          name="Address"
          value={eventData?.address}
          removeTopMargin={true}
        />
        <RichEventField
          name="Lead Contact"
          value={eventData?.leadEmail}
          removeTopMargin={true}
        />
        <RichEventField
          name="Before Signing Up"
          value={eventData?.requiredTraining}
          removeTopMargin={true}
        />
      </Box>
      {datesInfo.length > 0 && (
        <Box sx={{ mt: 4, mb: 8 }}>
          <VolunteerSignupGrid
            eventData={eventData}
            slots={slots}
            volunteers={volunteer}
            onSignUp={handleOpenVolunteerPopup}
            relevantDates={datesInfo[0] as string[]}
            targetDay={datesInfo.length > 1 ? datesInfo[1] : datesInfo[0]}
          />
        </Box>
      )}

      {/* Manage Registration button if the user is signed up, note this is disabled for now. Needs reworking and design.*/}
      {/* {currentUserVolunteerRecord && (
        <Box sx={{ mt: -2, mb: 4, display: 'flex', justifyContent: 'flex-start' }}>
            <Button 
                variant="contained" 
                onClick={() => handleOpenVolunteerPopup(currentUserVolunteerRecord.role)}
            >
                Manage my Registration ({currentUserVolunteerRecord.role})
            </Button>
        </Box>
      )} */}
      <Divider
        style={{
          marginBottom: "3em",
          marginTop: "3em",
          height: 3,
          borderRadius: "25px",
        }}
      ></Divider>
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
