import React from "react";
import { Typography } from "@mui/material";
import RichTextField from "./richTextField";
import { ProjectData } from "new-types";

type EventDescriptionProps = {
  event: ProjectData;
}

const EventDescription: React.FC<EventDescriptionProps> = ({
  event
}) => {
  if (event.Details) {
    return <RichTextField value={event.Details} removeTopMargin={true} />
  }

  return (
    <Typography>
      {event["Project Description"]}
    </Typography>
  );
}

export default EventDescription;