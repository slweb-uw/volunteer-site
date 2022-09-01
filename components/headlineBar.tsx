import React from "react";

const HeadlineBar: React.FC<{color:string, width:number, height:number}> = ({ color, width, height }) => {
  var url = `${color}bar.png`
  return (
    <img src={url} alt="" style={{ width: `${width}px`, height: `${height}px`, marginBottom: "5px", maxWidth: "90%" }}/>
  );
};

export default HeadlineBar