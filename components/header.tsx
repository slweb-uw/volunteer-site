import React, { useState } from "react";
import Hidden from "@mui/material/Hidden";
import Image from "next/image";
import HeaderLogo from "public/header-logo.png";
import { useAuth } from "auth";
import BasicMenu from "./basicMenu";
import SignInPopup from "./SignInPopup";
import makeStyles from "@mui/styles/makeStyles";
import { signOut } from "firebase/auth";
import { auth } from "firebaseClient";
import Link from "next/link";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#4B2E83",
    display: "flex",
    alignItems: "center",
    padding: "0.5rem",
    height: "3.75rem",
    justifyContent: "space-between",
    [theme.breakpoints.up("md")]: {
      justifyContent: "space-between",
    },
    fontFamily: "initial",
    fontWeight: "initial",
    lineHeight: "initial",
    letterSpacing: "initial",
  },
  navtitle: {
    fontFamily: "Encode Sans Compressed, sans-serif",
    fontWeight: 600,
    fontSize: "17px",
    color: "white",
    textAlign: "center",
    textDecoration: "none",
    margin: "1em",
    marginLeft: "0.5em",
    width: "fit-content",
    marginRight: "0.5em",
    paddingBottom: "5px",
    letterSpacing: ".01em",
    cursor: "pointer",
    "&:hover": {
      color: "#B7A57A",
      transition: ".25s",
      textDecoration: "underline",
    },
    "&:focus-visible": {
      outline: "none",
      boxShadow: "0 0 0 0.2rem #80bdff",
      borderColor: "#80bdff",
      borderRadius: "4px",
    },
    "@media only screen and (max-width: 960px)": {
      color: "black",
      margin: "0",
      padding: "0",
    },
  },
  logo: {
    position: "relative",
    cursor: "pointer",
    width: "25em",
    height: "auto",
    minWidth: 5,
    "@media only screen and (max-width: 480px)": {
      maxHeight: "100%",
      paddingLeft: "0",
      marginLeft: "0",
      width: "80vw",
    },
  },
  divider: {
    fontSize: "35px",
    color: "grey",
    marginTop: "8px",
    "@media only screen and (max-width: 960px)": {
      padding: "0px",
      fontSize: "0px",
      margin: "0px",
    },
  },
}));

const Divider = () => <span className={useStyles().divider}>/</span>;

const Links = ({
  handleSignout,
  openSignup,
}: {
  handleSignout: () => void;
  openSignup: () => void;
}) => {
  const { user, isLead, isAdmin } = useAuth();
  const classes = useStyles();
  return (
    <>
      <Link href="/" className={classes.navtitle} tabIndex={0}>
        Home
      </Link>
      <Divider />
      <Link href="/opportunities" className={classes.navtitle} tabIndex={0}>
        Opportunities
      </Link>
      <Divider />
      <a
        className={classes.navtitle}
        href="https://canvas.uw.edu/courses/1693188/pages/training-modules?module_item_id=18595279"
        target="_blank"
        tabIndex={0}
      >
        Training
      </a>
      <Divider />
      <Link href="/resources" className={classes.navtitle} tabIndex={0}>
        Links
      </Link>
      <Divider />
      <a
        href="https://canvas.uw.edu/courses/1693188/pages/protocols?module_item_id=18595280"
        className={classes.navtitle}
        target="_blank"
        tabIndex={0}
      >
        Protocols
      </a>
      <Divider />
      <Link href="/donations" className={classes.navtitle} tabIndex={0}>
        Donations
      </Link>
      <Divider />
      <Link href="/help" className={classes.navtitle} tabIndex={0}>
        Help
      </Link>
      <Divider />
      {
        // sign in and out}
        user ? (
          <a
            key="sign out"
            onClick={handleSignout}
            className={classes.navtitle}
            tabIndex={0}
          >
            Sign Out
            {isAdmin && (
              <p
                style={{
                  color: "gold",
                  margin: 0,
                  fontSize: "12px",
                  position: "absolute",
                }}
              >
                ADMIN
              </p>
            )}
            {isLead && (
              <p
                style={{
                  color: "gold",
                  margin: 0,
                  fontSize: "12px",
                  position: "absolute",
                }}
              >
                LEAD
              </p>
            )}
          </a>
        ) : (
          <>
            <a
              key="sign in"
              onClick={openSignup}
              className={classes.navtitle}
              tabIndex={0}
            >
              Sign In
            </a>
          </>
        )
      }
    </>
  );
};
const Header: React.FC<{}> = () => {
  const [isSignInPopupOpen, setSignInPopupOpen] = useState(false);

  return (
    <nav className={useStyles().root}>
      <Link href="/" tabIndex={0}>
        <Image
          src={HeaderLogo}
          alt="University of Washington School of Medicine logo"
          className={useStyles().logo}
          sizes="100vw"
          width={200}
          height={100}
        />
      </Link>

      <Hidden only={["lg", "md", "xl"]}>
        <BasicMenu
          Links={
            <Links
              handleSignout={() => {
                signOut(auth);
                setSignInPopupOpen(false);
              }}
              openSignup={() => setSignInPopupOpen(true)}
            />
          }
        />
      </Hidden>
      <Hidden only={["sm", "xs"]}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Links
            handleSignout={() => {
              signOut(auth);
              setSignInPopupOpen(false);
            }}
            openSignup={() => setSignInPopupOpen(true)}
          />
        </div>
      </Hidden>
      <SignInPopup
        open={isSignInPopupOpen}
        close={() => setSignInPopupOpen(false)}
      />
    </nav>
  );
};

export default Header;
