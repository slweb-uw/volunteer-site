import React from "react";
import Typography from "@material-ui/core/Typography";

const Footer: React.FC<{}> = () => {
  return (
    <footer
      style={{
        backgroundColor: "#4B2E83",
        width: "100%",
        textAlign: "center",
        paddingTop: "1.5em",
        paddingBottom: "1.5em",
      }}
    >
      <img src="/footer-logo.png" />
      <Typography style={{ color: "white", marginTop: "0.5em" }} gutterBottom>
        Contact us: (206) 685-2009 or{" "}
        <a href="mailto://clarkel@uw.edu">clarkel@uw.edu</a>
      </Typography>
      <Typography style={{ color: "white" }} gutterBottom>
        <i>
          Please use browsers other than internet explorer for the best
          experience on this website.
        </i>
      </Typography>
    </footer>
  );
};

export default Footer;
