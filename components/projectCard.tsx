import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import ProjectImage from "./projectImage";
import useMediaQuery from "@mui/material/useMediaQuery";
import Bubble from "./interprofessionalTag";
import { CardActionArea } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { ProjectData } from "new-types";

const useStyles = makeStyles(() => ({
  root: {
    cursor: "pointer",
    display: "flex",
    borderRadius: 8,
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

  actions: {
    textDecoration: "none",
    color: "black",
  },
}));

interface EventCardProps {
  event: ProjectData;
}

const NotSpecified = <i style={{ color: "gray" }}>Not specified</i>;

const ProjectCard: React.FC<EventCardProps> = (props) => {
  const classes = useStyles();
  const mobileView = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const volunteerTypes = props.event["Types of Volunteers Needed"];
  const eventLink = "/" + router.query.location + "/" + props.event.id;
  const isInterprofessional =
    Array.isArray(volunteerTypes) &&
    volunteerTypes.filter(
      (type) =>
        type != "Providers" && type != "Undergraduates" && type != "Other",
    ).length > 1;

  return (
    <Card
      tabIndex={0}
      className={classes.root}
      variant="outlined"
      id={props.event.id}
    >
      <CardActionArea
        className={` ${classes.root} ${classes.actions}`}
        LinkComponent={Link}
        href={eventLink}
      >
        {!mobileView && (
          <CardMedia>
            <ProjectImage
              className={classes.cover}
              imageURL={props.event.imageURL}
              eventTitle={props.event.Title}
            />
          </CardMedia>
        )}
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
      </CardActionArea>
    </Card>
  );
};

export default ProjectCard;
