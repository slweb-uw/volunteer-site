import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import Link from "next/link";

import { useRouter } from 'next/router';

import ModifyEventForm from "components/modifyEventForm";
import { useAuth } from "auth";


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

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function EventModal(props: {
  open: boolean;
  event: EventData | undefined;
  handleClose: any;
  handleModify: any;
}) {
  const { open, event, handleClose, handleModify } = props;
  const router = useRouter();

  const { location } = router.query; // string of current location (ex: "Seattle")

  let eventLink = "/"
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
            <Grid item xs={12} lg={4} style={{ textAlign: "center" }}>
              <img
                src={event?.["imageURL"]}
                style={{ maxHeight: 400, width: "auto", maxWidth: "90%" }}
              />
            </Grid>
          )}
          <Grid item xs={12} lg={event?.["imageURL"] ? 8 : 12}>
            <Typography>
              <b>Project Description</b>
            </Typography>
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
                  {event?.["Types of Volunteers Needed"]}
                </Typography>
              </div>
            )}
            <div style={{ marginTop: "2em" }}>
              <Link href={eventLink}>
                <Button
                  autoFocus
                  onClick={handleClose}
                  color="secondary"
                  variant="contained"
                  style={{ marginRight: "1em" }}
                >
                  Learn more
                </Button>
              </Link>
              {event?.["Sign-up Link"] && (
                <a
                  href={event?.["Sign-up Link"]}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    autoFocus
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
                <div style={{ paddingBottom: "2em" }}>
                  <ModifyEventForm eventData={event} handleClose={handleClose} />
                </div>
              )}
            </div>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
