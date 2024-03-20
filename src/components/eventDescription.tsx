import React from "react";
import { Typography } from "@material-ui/core";
import RichTextField from "./richTextField";

type EventDescriptionProps = {
  event: EventData;
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