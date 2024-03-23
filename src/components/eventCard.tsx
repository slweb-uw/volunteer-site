import type { MouseEventHandler, FC } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import CardMedia from "@material-ui/core/CardMedia"
import Typography from "@material-ui/core/Typography"
import EventImage from "./eventImage"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import Bubble from "./interprofessionalTag"

const useStyles = makeStyles((theme) => ({
  root: {
    cursor: "pointer",
    display: "flex",
    borderRadius: 35,
    flex: "1 0 auto",
    height: 300,
    "&:focus-visible": {
      outline: "none",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
      borderColor: "#80bdff",
    },
    "@media (max-width: 500px)": {
      flexDirection: "column",
      alignItems: "left",
    },
  },
  details: {
    display: "-webkit-box",
    lineClamp: 6,
    boxOrient: "vertical",
    overflow: "hidden",
  },
  cover: {
    "@media (max-width: 600px)": {
      height: 150,
      marginTop: ".5em",
      display: "none",
    },
    "@media (min-width: 600px)": {
      height: 300,
      width: 230,
    },
  },
}))

interface Props {
  event: EventData | CalendarEventData
  handleClick: MouseEventHandler<HTMLDivElement> | undefined
}

const NotSpecified = <i style={{ color: "gray" }}>Not specified</i>

const EventCard: FC<Props> = (props) => {
  const classes = useStyles()
  const mobileView = useMediaQuery("(max-width: 600px)")
  let imageURL = props.event.cardImageURL ?? props.event.imageURL
  if (mobileView) {
    imageURL = props.event.imageURL
  }

  const volunteerTypes = props.event["Types of Volunteers Needed"]
  const isInterprofessional =
    volunteerTypes.filter(
      (type) =>
        type != "Providers" && type != "Undergraduates" && type != "Other"
    ).length > 1

  return (
    <Card
      tabIndex={0}
      className={classes.root}
      variant="outlined"
      onClick={props.handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" && props.handleClick) {
          props.handleClick()
        }
      }}
    >
      <CardMedia>
        <EventImage
          className={classes.cover}
          imageURL={imageURL}
          eventTitle={props.event.Title}
        />
      </CardMedia>
      <CardContent>
        {props.event?.SignupActive && <Bubble text="Signup Available" />}
        {isInterprofessional && <Bubble text="Interprofessional" />}
        <Typography component="h6" variant="h6">
          <b>{props.event.Title}</b>
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          {props.event.Organization}
        </Typography>
        <Typography className={classes.details}>
          {props.event["Project Description"] ?? NotSpecified}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default EventCard
