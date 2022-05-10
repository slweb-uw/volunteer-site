import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import EventImage from "./eventImage";
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
  root: {
    cursor: "pointer",
    display: "flex",
    borderRadius: 10,
    flex: "1 0 auto",
    // height: 300,
    "@media (max-width: 600px)": {
      flexDirection: "column",
      alignItems: "center",
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
      marginTop: '.5em',
      display: "none",
    },
    "@media (min-width: 600px)": {
      height: 300,
      width: 230,
    },
  },
}));

interface Props {
  event: EventData | CalendarEventData;
  handleClick: React.MouseEventHandler<HTMLDivElement> | undefined;
}

const NotSpecified = <i style={{color: 'gray'}}>Not specified</i>

const EventCard: React.FC<Props> = (props) => {
  const classes = useStyles();
  const mobileView = useMediaQuery('(max-width: 600px)');
  let imageURL = props.event.cardImageURL ?? props.event.imageURL;
  if (mobileView) {
    imageURL = props.event.imageURL;
  }


  return (
    <Card
      className={classes.root}
      variant='outlined'
      onClick={props.handleClick}
    >
      <CardMedia>
        <EventImage
          className={classes.cover}
          imageURL={imageURL}
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
