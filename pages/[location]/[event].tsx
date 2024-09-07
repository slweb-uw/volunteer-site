import { useRouter } from "next/router";
import { useAuth } from "auth";
import { useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import makeStyles from "@mui/styles/makeStyles";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

import {
  Typography,
  Divider,
  Grid,
  Button,
  SxProps,
  Theme,
} from "@mui/material";
import naturalJoin from "../../helpers/naturalJoin";
import RichTextField from "../../components/richTextField";
import Box from "@mui/material/Box";
import NextLink from "next/link";
import { firebaseAdmin } from "firebaseAdmin";
import AddModifyEventModal from "components/AddModifyEventModal";
import { useParams } from "next/navigation";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "firebaseClient";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";

const fields = [
  "Location",
  "Clinic Schedule",
  "Organization",
  "Contact Information",
  "Website Link",
  "Address/Parking/Directions",
  "Clinic Flow",
  "Tips and Reminders",
  "Provider Information",
  "Protocols",
] as const;


type RichEventFieldProps = {
  name: string;
  value: string | string[] | undefined;
  removeTopMargin: boolean;
  sx?: SxProps<Theme>;
};

const RichEventField: React.FC<RichEventFieldProps> = ({
  name,
  value,
  sx,
}) => {
  let data: string | undefined;
  if (value && Array.isArray(value)) {
    data = naturalJoin(value);
  } else {
    data = value;
  }
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
        <RichTextField sx={sx} value={data}/>
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
  const { location, event: projectId } = useParams();
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  async function HandleDeleteProject() {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    setDeletingProject(true);
    try {
      await deleteDoc(doc(db, location.toString(), projectId.toString()));
      router.push(`/${location}`);
      enqueueSnackbar("Successfully deleted project", {
        variant: "success",
        autoHideDuration: 2000,
      });
      setDeletingProject(false);
    } catch (err) {
      setDeletingProject(false);
      enqueueSnackbar("Could not delete project", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  }

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
          {/* Navigation for events and admin page of each */}
          <Box sx={{ columns: { xs: 1, md: 2 }, columnGap: 8 }}>
            {fields
              .filter(
                (name) => eventData[name] != null && eventData[name] != "",
              )
              .map((name) => (
                <RichEventField
                  key={name}
                  name={name}
                  value={eventData[name]}
                  removeTopMargin={true}
                />
              ))}
            <RichEventField
              name="Types of Volunteers Needed"
              value={
                eventData["Types of Volunteers Needed"]
                  ? naturalJoin(eventData["Types of Volunteers Needed"])
                  : undefined
              }
              removeTopMargin={true}
            />
          </Box>
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

      {isAdmin && (
      <>
      <Typography component="h3" variant="h4">Admin Options</Typography>
        <Box sx={{ display: "flex", gap: "1rem", padding: "1rem 0 " }}>
          <Button onClick={() => setModalOpen(true)} variant="contained">
            Edit Project
          </Button>
          <LoadingButton
            loading={deletingProject}
            variant="outlined"
            color="error"
            onClick={HandleDeleteProject}
          >
            Delete Project
          </LoadingButton>

          <AddModifyEventModal
            open={modalOpen}
            event={eventData}
            location={location?.toString()}
            projectId={projectId.toString()}
            handleClose={() => setModalOpen(false)}
          />
        </Box>
      </>
      )}
    </div>
  );
};

export default Event;
