import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

import Link from "next/link";

const useStyles = makeStyles((theme) => ({
  root: {
    cursor: "pointer",
    display: "flex",
  },
  details: {
    height: 300,
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 0 auto",
  },
  cover: {
    width: 230,
    height: 300,
  },
}));

interface Props {
  event: EventData;
  handleClick: React.MouseEventHandler<HTMLDivElement> | undefined;
}

const NotSpecified = <i style={{color: 'gray'}}>Not specified</i>

const EventCard: React.FC<Props> = (props) => {
  const classes = useStyles();

  return (
    <Card
      className={classes.root}
      variant='outlined'
      style={{ borderRadius: 10 }}
      onClick={props.handleClick}
    >
      <CardMedia
        component='img'
        className={classes.cover}
        src={
          props.event["imageURL"] ? props.event["imageURL"] : "/beigeSquare.png"
        }
        alt={"Image for" + props.event.Title}
      />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component='h6' variant='h6'>
            <b>{props.event.Title}</b>
          </Typography>
          <Typography variant='subtitle1' color='textSecondary' gutterBottom>
            {props.event.organization}
          </Typography>
          <div>{props.event["Project Description"] ?? NotSpecified }</div>
        </CardContent>
      </div>
    </Card>
  );
};

export default EventCard;
