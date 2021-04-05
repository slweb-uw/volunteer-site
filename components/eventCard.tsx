import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
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
}

const EventCard: React.FC<Props> = (props) => {
  const classes = useStyles();

  return (
    <Card
      className={classes.root}
      variant="outlined"
      style={{ borderRadius: 10 }}
    >
      <CardMedia
        component="img"
        className={classes.cover}
        src={props.event["imageURL"] ?? "/beigeSquare.png"}
        alt={"Image for" + props.event.Title}
      />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h6" variant="h6">
            <b>{props.event.Title}</b>
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            {props.event.organization}
          </Typography>
          <Typography gutterBottom>
            <b>Project Description</b>
          </Typography>
          <div>{props.event["Project Description"]}</div>
        </CardContent>
      </div>
    </Card>
  );
};

export default EventCard;
