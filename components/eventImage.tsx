import React from "react";

interface Props {
  className?: string;
  style?: React.CSSProperties;
  imageURL?: string | undefined;
  eventTitle: string;
}

const EventImage: React.FC<Props> = (props) => {
  const style = props.style ?? {};
  if (!style.objectFit) {
    style.objectFit = "cover";
  }
  return (
    <img
      className={props.className}
      style={style}
      src={
        props.imageURL ? props.imageURL : "/beigeSquare.png"
      }
      alt={"Image for " + props.eventTitle}
    />
  );
}

export default EventImage;