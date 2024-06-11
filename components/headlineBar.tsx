import React from "react";
import Image from "next/image";

const HeadlineBar: React.FC<{
  color: string;
  width: number;
  height: number;
}> = ({ color, width, height }) => {
  var url = `/${color}bar.png`;
  return (
    <Image
      src={url}
      alt={`${color} bar`}
      width={width}
      height={height}
    />
  );
};

export default HeadlineBar;
