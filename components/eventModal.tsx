import React, { useState, useEffect } from "react"
import { Theme } from "@mui/material/styles"
import { WithStyles } from "@mui/styles"
import createStyles from "@mui/styles/createStyles"
import withStyles from "@mui/styles/withStyles"
import Dialog from "@mui/material/Dialog"
import MuiDialogTitle from "@mui/material/DialogTitle"
import MuiDialogContent from "@mui/material/DialogContent"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"
import Typography from "@mui/material/Typography"
import { Button, Grid } from "@mui/material"
import Link from "next/link"
import { useAuth } from "auth"
import { firebaseClient } from "firebaseClient"
import AddModifyEventModal from "./addModifyEventModal"
import EventImage from "./eventImage"
import naturalJoin from "../helpers/naturalJoin"
import EventDescription from "./eventDescription"
import { Location } from "../helpers/locations"

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
  })

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string
  children: React.ReactNode
  onClose: () => void
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props
  return (
    <MuiDialogTitle className={classes.root} {...other}>
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
  )
})

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(3),
  },
}))(MuiDialogContent)

const deleteEvent = async (eventData: EventData | undefined) => {
  if (
    eventData &&
    confirm("Please acknowledge you wish to delete this event.")
  ) {
    const userToken = await firebaseClient.auth().currentUser?.getIdToken()

    try {
      await Promise.all([
        fetch("/api/delete-event-data", {
          method: "POST",
          body: JSON.stringify({
            eventData,
            userToken,
          }),
        }),
        // fetch("/api/delete-calendar-event", {
        //   method: "POST",
        //   body: JSON.stringify({
        //     eventData,
        //     userToken,
        //   }),
        // }),
      ])
      location.reload()
    } catch (e) {
      alert(e)
    }
  }
}

export default function EventModal(props: {
  open: boolean
  event: EventData | undefined
  location: Location
  handleClose: any
}) {
  const { open, event, location, handleClose } = props
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false)

  let eventLink = event ? "/" + location + "/" + event.id : "/"

  const { isAdmin } = useAuth()

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
                style={{
                  maxWidth: "100%",
                  maxHeight: "500px",
                  borderRadius: 10,
                }}
                imageURL={event.imageURL}
                eventTitle={event.Title}
              />
            </Grid>
          )}
          <Grid item xs={12} lg={event?.["imageURL"] ? 8 : 12}>
            {event && (
              <Typography gutterBottom>
                <EventDescription event={event} />
              </Typography>
            )}
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
              {(isAdmin || event?.SignupActive) && (
                <Link href={event ? `/${location}/${event.id}/signup` : "/"}>
                  <Button
                    color="primary"
                    variant="contained"
                    style={{ marginRight: "1em" }}
                  >
                    Sign up
                  </Button>
                </Link>
              )}
              <Link
                href={eventLink}
                style={{ textDecoration: "none" }}
                target="_blank"
              >
                <Button
                  onClick={handleClose}
                  color="secondary"
                  variant="contained"
                  style={{ marginRight: "1em" }}
                >
                  Learn more
                </Button>
              </Link>
              {isAdmin && (
                <div style={{ paddingBottom: "2em", paddingTop: "2em" }}>
                  <div style={{ display: "inline-block" }}>
                    <AddModifyEventModal
                      open={adminModalOpen}
                      location={location}
                      event={event}
                      handleClose={() => {
                        setAdminModalOpen(false)
                      }}
                    />
                    <Button
                      style={{ display: "inline-block" }}
                      color="secondary"
                      onClick={(e) => {
                        setAdminModalOpen(true)
                      }}
                    >
                      Modify Project
                    </Button>
                  </div>
                  <Button
                    style={{ display: "inline-block", marginLeft: "1em" }}
                    color="secondary"
                    onClick={async (e) => {
                      deleteEvent(event)
                    }}
                  >
                    Delete Project
                  </Button>
                </div>
              )}
            </div>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}
