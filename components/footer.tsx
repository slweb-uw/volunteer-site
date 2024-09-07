import React from "react";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import { useAuth } from "auth";
import Link from "next/link";
import Image from "next/image";
import LogoUrl from "public/uw-text-logo.png"

const useStyles = makeStyles((theme) => ({
  logo: {
    width: "25rem",
    height: "auto",
    "@media only screen and (max-width: 960px)": {
      width: "90%",
      marginBottom: "1%",
    },
  },
  text: {
    color: "white",
    marginTop: "0.5em",
    fontFamily: "Open Sans",
    fontSize: "14px",
    "@media only screen and (max-width: 600px)": {
      fontSize: "12px",
    },
  },
  footer: {
    fontFamily: "Encode Sans Compressed, sans-serif",
    backgroundColor: "#4B2E83",
    width: "100%",
    textAlign: "center",
    paddingTop: "3rem",
    paddingBottom: "3em",
    marginBottom: "0",
  },
}));

const Footer: React.FC<{}> = () => {
  const { isAdmin } = useAuth();

  return (
    <footer className={useStyles().footer}>
      <Image
        src={LogoUrl}
        alt="University of Washington logo"
        sizes="100vw"
        className={useStyles().logo}
      />
      <Typography className={useStyles().text} gutterBottom>
        Contact us: (206) 685-2009 or {" "}
        <a href="mailto://clarkel@uw.edu" className={useStyles().text}>
          somserve@uw.edu
        </a>
      </Typography>
      <Typography className={useStyles().text} gutterBottom>
        <i>
          Please use browsers other than internet explorer for the best
          experience on this website.
        </i>
      </Typography>
      {isAdmin && (
        <Link
          href="/userManager"
          style={{ color: "white", paddingTop: "100px", fontWeight: 600 }}
        >
          User Manager
        </Link>
      )}
    </footer>
  );
};

export default Footer;
