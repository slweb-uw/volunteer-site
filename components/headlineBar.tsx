import React from "react";
import Image from "next/image";

const HeadlineBar: React.FC<{
  color: string;
  width: number;
  height: number;
  marginBottom: number;
}> = ({ color, width, height, marginBottom }) => {
  var url = `/${color}bar.png`;
  return (
    <Image
      src={url}
      alt={`${color} bar`}
      width={width}
      height={height}
      style={{ marginBottom: marginBottom || 0 }}
      role="none"
    />
  );
};

export default HeadlineBar;
