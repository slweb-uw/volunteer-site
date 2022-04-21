import React from "react";
import sanitizeHtmlRichText from "../helpers/sanitizeHtmlRichText";
import { Typography } from "@material-ui/core";

type EventDescriptionProps = {
  event: EventData;
}

const EventDescription: React.FC<EventDescriptionProps> = ({
  event
}) => {
  if (event.Details) {
    /***********************************************************
     DO NOT EDIT THIS SECTION UNLESS YOU KNOW WHAT YOU ARE DOING
     AND USE EXTREME CAUTION EVEN IF YOU DO
     ***********************************************************/
    return <div dangerouslySetInnerHTML={{ __html: sanitizeHtmlRichText(event.Details) }} />
    /***********************************************************
     ***********************************************************/
  }

  return (
    <Typography>
      {event["Project Description"]}
    </Typography>
  );
}

export default EventDescription;