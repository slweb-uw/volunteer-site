import React, { useState } from "react";
import Image from "next/image";
import { Skeleton } from "@mui/material";

interface Props {
  className?: string;
  style?: React.CSSProperties;
  imageURL?: string | undefined;
  eventTitle: string;
}

const EventImage: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState(true);

  const style = props.style ?? {};
  if (!style.objectFit) {
    style.objectFit = "cover";
  }
  return (
    <>
      {loading ? (
        <Skeleton width={300} height={600}>
          <Image
            style={style}
            width={300}
            height={300}
            onLoad={() => setLoading(false)}
            src={props.imageURL ? props.imageURL : "/beigeSquare.png"}
            alt={props.eventTitle}
          />
        </Skeleton>
      ) : (
        <Image
          style={style}
          width={300}
          height={300}
          onLoad={() => setLoading(false)}
          src={props.imageURL ? props.imageURL : "/beigeSquare.png"}
          alt={props.eventTitle}
        />
      )}
    </>
  );
};

export default EventImage;
