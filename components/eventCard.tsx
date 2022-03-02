import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import EventImage from "./eventImage";

const useStyles = makeStyles((theme) => ({
  root: {
    cursor: "pointer",
    display: "flex",
    borderRadius: 10,
    height: 300
  },
  details: {
    display: "-webkit-box",
    lineClamp: 6,
    boxOrient: "vertical",
    overflow: "hidden",
  },
  cover: {
    "@media (max-width: 600px)": {
      width: 115
    },
    "@media (min-width: 600px)": {
      width: 230
    },
    height: 300
  },
}));

interface Props {
  event: EventData | CalendarEventData;
  handleClick: React.MouseEventHandler<HTMLDivElement> | undefined;
}

const NotSpecified = <i style={{color: 'gray'}}>Not specified</i>

const EventCard: React.FC<Props> = (props) => {
  const classes = useStyles();

  return (
    <Card
      className={classes.root}
      variant='outlined'
      onClick={props.handleClick}
    >
      <CardMedia>
        <EventImage
          className={classes.cover}
          imageURL={props.event.cardImageURL ? props.event.cardImageURL : props.event.imageURL}
          eventTitle={props.event.Title}
        />
      </CardMedia>
      <CardContent>
        <Typography component='h6' variant='h6'>
          <b>{props.event.Title}</b>
        </Typography>
        <Typography variant='subtitle1' color='textSecondary' gutterBottom>
          {props.event.Organization}
        </Typography>
        <Typography className={classes.details}>
          {props.event["Project Description"] ?? NotSpecified }
        </Typography>
      </CardContent>
    </Card>
  );
};

export default EventCard;
