import { useRouter } from "next/router";
import { useAuth } from "auth";
import { useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import makeStyles from "@mui/styles/makeStyles";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

import {
  CssBaseline,
  Typography,
  Divider,
  Grid,
  Button,
  SxProps,
  Theme,
} from "@mui/material";
import naturalJoin from "../../helpers/naturalJoin";
import EventDescription from "../../components/eventDescription";
import RichTextField from "../../components/richTextField";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import NextLink from "next/link";
import { firebaseAdmin } from "firebaseAdmin";
import AddModifyEventModal from "components/AddModifyEventModal";

const initialGridKeys = [
  "Tips and Reminders",
  "Clinic Flow",
  "Required Trainings",
  "Address/Parking/Directions",
  "Provider Information",
] as const;

type InitialGridKeys = (typeof initialGridKeys)[number];

const reservedKeys = [
  "Project Description",
  "Details",
  "Clinic Schedule",
  "Types of Volunteers Needed",
  "Title",
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
  sx?: SxProps<Theme>;
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
  sx,
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
        sx={{
          pageBreakInside: "avoid",
          breakInside: "avoid-column",
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
        }}
      >
        <Typography variant="h6" style={{ fontWeight: 600 }}>
          {name}
        </Typography>
        <RichTextField sx={sx} value={data} />
      </Box>
    </>
  );
};

// fetch event data before rendering
export const getServerSideProps: GetServerSideProps<{
  event: EventData;
}> = async (ctx) => {
  const location = ctx.params?.location;
  const event = ctx.params?.event;

  if (typeof location === "undefined" || typeof event === "undefined") {
    return {
      notFound: true,
    };
  }

  // safe to to as string here because we already check they are undefined
  // typescript for some reason does
  const data = await firebaseAdmin
    .firestore()
    .collection(location as string)
    .doc(event as string)
    .get();

  return { props: { event: data.data() as EventData } };
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
  const router = useRouter();
  const { isAdmin } = useAuth();
  const { location } = router.query; // current event id and location
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className={classes.page}>
      {/* EVENT TITLE */}
      <Typography variant="h3" style={{ fontWeight: 900, paddingBottom: 50 }}>
        {eventData.Title}
      </Typography>

      <Grid container spacing={6}>
        <Grid item sm={12} md={6} className={classes.detailsImageContainer}>
          <Image
            className={classes.detailsImage}
            width={500}
            height={500}
            src={eventData?.imageURL ? eventData?.imageURL : "/beigeSquare.png"}
            alt={eventData.Title}
          />
        </Grid>
        <Grid item container direction="column" sm={12} md={6} gap={2}>
          <RichEventField
            name="Project Description"
            value={eventData["Project Description"]}
            removeTopMargin={true}
            sx={{ lineHeight: "1.75rem" }}
          />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              startIcon={<CalendarMonthOutlinedIcon />}
              LinkComponent={NextLink}
              fullWidth
              href={`/${location}/${eventData.id}/calendar`}
              variant="contained"
              sx={{ display: "flex", gap: "0.5rem" }}
            >
              Avaliable events
            </Button>
          </Box>
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
          <RichEventField
            name="Contact Information"
            value={eventData["Contact Information"]}
            removeTopMargin={true}
          />
          <RichEventField
            name="Website Link"
            value={eventData["Website Link"]}
            removeTopMargin={true}
          />
          <RichEventField
            name="Types of Volunteers Needed"
            value={
              eventData["Types of Volunteers Needed"]
                ? naturalJoin(eventData["Types of Volunteers Needed"])
                : undefined
            }
            removeTopMargin={true}
          />
          {/* Navigation for events and admin page of each */}
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
          .filter(
            (name: InitialGridKeys) =>
              eventData[name] != null && eventData[name] != "",
          )
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

      <Button onClick={() => setModalOpen(true)}>Modify Event</Button>


      <AddModifyEventModal
        open={modalOpen}
        event={eventData}
        handleClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Event;
