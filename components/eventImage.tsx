import React from "react";
import Image from "next/image";

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
    <Image
      style={style}
      width={300}
      height={300}
      src={
        props.imageURL ? props.imageURL : "/beigeSquare.png"
      }
      alt={props.eventTitle}
    />
  );
}

export default EventImage;
