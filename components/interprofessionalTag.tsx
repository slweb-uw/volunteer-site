import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  bubble: {
    border: "2px solid #800080", 
    borderRadius: "25px",
    padding: "6px 15px",
    color: "#800080", 
    marginRight: "275px",
    marginTop: "20px"
  },
}));

interface BubbleProps {
  text: string;
}

const Bubble: React.FC<BubbleProps> = ({ text }) => {
  const classes = useStyles();

  return <div className={classes.bubble}>{text}</div>;
};

export default Bubble;
