import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Link from "next/link";

const Header: React.FC<{}> = (props) => {
  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#4B2E83",
        padding: "1em",
        margin: "0em",
        width: "100%",
      }}
    >
      <Link href="/">
        <img src="/header-logo.png" style={{ cursor: "pointer" }} />
      </Link>
    </div>
  );
};

export default Header;
