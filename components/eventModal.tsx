import React, { useState } from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { Button, Grid } from "@material-ui/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "auth";
import { firebaseClient } from "firebaseClient";
import AddModifyEventModal from "./addModifyEventModal";
import EventImage from "./eventImage";
import naturalJoin from "../helpers/naturalJoin";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(3),
  },
}))(MuiDialogContent);

const deleteEvent = async (eventData: EventData | undefined) => {
  if (
    eventData &&
    confirm("Please acknowledge you wish to delete this event.")
  ) {
    const userToken = await firebaseClient.auth().currentUser?.getIdToken();

    try {
      await Promise.all([
        fetch("/api/delete-event-data", {
          method: "POST",
          body: JSON.stringify({
            eventData,
            userToken,
          }),
        }),
        fetch("/api/delete-calendar-event", {
          method: "POST",
          body: JSON.stringify({
            eventData,
            userToken,
          }),
        }),
      ]);
      location.reload();
    } catch (e) {
      alert(e);
    }
  }
};

export default function EventModal(props: {
  open: boolean;
  event: EventData | undefined;
  handleClose: any;
}) {
  const { open, event, handleClose } = props;
  const router = useRouter();

  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);

  const { location } = router.query; // string of current location (ex: "Seattle")

  let eventLink = "/";
  if (event) {
    eventLink = "/" + location + "/" + event.id;
  }

  const { user } = useAuth();

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="event-dialog"
      open={open}
      fullWidth={true}
      maxWidth={"lg"}
      disableEnforceFocus={true}
    >
      <DialogTitle id="event-dialog" onClose={handleClose}>
        <b>{event?.Title}</b>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={5}>
          {event?.["imageURL"] && (
            <Grid item xs={12} lg={4}>
              <EventImage
                style={{ height: "100%", width: "100%", borderRadius: 10 }}
                imageURL={event.imageURL}
                eventTitle={event.Title}
              />
            </Grid>
          )}
          <Grid item xs={12} lg={event?.["imageURL"] ? 8 : 12}>
            <Typography gutterBottom>
              {event?.["Project Description"]}
            </Typography>
            {event?.["Location"] && (
              <div>
                <Typography>
                  <b>Location</b>
                </Typography>
                <Typography gutterBottom>{event?.["Location"]}</Typography>
              </div>
            )}
            {event?.["Types of Volunteers Needed"] && (
              <div>
                <Typography>
                  <b>Types of Volunteers Needed</b>
                </Typography>
                <Typography gutterBottom>
                  {naturalJoin(event["Types of Volunteers Needed"])}
                </Typography>
              </div>
            )}
            <div style={{ marginTop: "2em" }}>
              <Link passHref href={eventLink}>
                <a style={{ textDecoration: "none" }} target="_blank">
                  <Button
                    onClick={handleClose}
                    color="secondary"
                    variant="contained"
                    style={{ marginRight: "1em" }}
                  >
                    Learn more
                  </Button>
                </a>
              </Link>
              {event?.["Sign-up Link"] &&
                typeof event?.["Sign-up Link"] === "string" && (
                  <a
                    href={event?.["Sign-up Link"]}
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      onClick={handleClose}
                      color="secondary"
                      variant="contained"
                    >
                      Sign-up Link
                    </Button>
                  </a>
                )}
              {user &&
                (user.email === "slweb@uw.edu" ||
                  user.email === "slwebuw@gmail.com") && (
                  <div style={{ paddingBottom: "2em", paddingTop: "2em" }}>
                    <div style={{ display: "inline-block" }}>
                      <AddModifyEventModal
                        open={adminModalOpen}
                        location={location}
                        event={event}
                        handleClose={() => {
                          setAdminModalOpen(false);
                        }}
                      />
                      <Button
                        style={{ display: "inline-block" }}
                        color="secondary"
                        onClick={(e) => {
                          setAdminModalOpen(true);
                        }}
                      >
                        Modify Project
                      </Button>
                    </div>
                    <Button
                      style={{ display: "inline-block", marginLeft: "1em" }}
                      color="secondary"
                      onClick={async (e) => {
                        deleteEvent(event);
                      }}
                    >
                      Delete Event
                    </Button>
                  </div>
                )}
            </div>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
