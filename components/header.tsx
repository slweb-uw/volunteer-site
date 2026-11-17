import React, { useState } from "react";
import Hidden from "@mui/material/Hidden";
import { useAuth } from "auth";
import BasicMenu from "./basicMenu";
import SignInPopup from "./SignInPopup";
import makeStyles from "@mui/styles/makeStyles";
import { signOut } from "firebase/auth";
import { auth } from "firebaseClient";
import Link from "next/link";
import { useSnackbar } from "notistack";

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
    paddingLeft: "10px",
    paddingTop: "5px",
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

const Header: React.FC<{}> = () => {
  const { user, isAdmin, isLead } = useAuth();
  const [isSignInPopupOpen, setSignInPopupOpen] = useState(false);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      enqueueSnackbar("Sign out successful", {
        variant: "success",
        autoHideDuration: 3000,
      });
    } catch (error) {
      enqueueSnackbar("Sign out failed, please try again", {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };

  const links: React.ReactNode[] = [
    <Link key="home" href="/" className={classes.navtitle} tabIndex={0}>
      Home
    </Link>,
    <Divider key="divider-1" />,
    <Link key="opportunities" href="/opportunities" className={classes.navtitle} tabIndex={0}>
      Opportunities
    </Link>,
    <Divider key="divider-2" />,
    <a
      key="training"
      className={classes.navtitle}
      href="https://canvas.uw.edu/courses/1693188/pages/training-modules?module_item_id=18595279"
      target="_blank"
      tabIndex={0}
    >
      Training
    </a>,
    //*NOTE: Resources name was changed to Links*/
    <Divider key="divider-3" />,
    <Link key="links" href="/resources" className={classes.navtitle} tabIndex={0}>
      Links
    </Link>,
    <Divider key="divider-4" />,
    <a
      key="protocols"
      href="https://canvas.uw.edu/courses/1693188/pages/protocols?module_item_id=18595280"
      className={classes.navtitle}
      target="_blank"
      tabIndex={0}
    >
      Protocols
    </a>,
    <Divider key="divider-5" />,
    <Link key="donations" href="/donations" className={classes.navtitle} tabIndex={0}>
      Donations
    </Link>,
    <Divider key="divider-6" />,
    <Link key="help" href="/help" className={classes.navtitle} tabIndex={0}>
      Help
    </Link>,
    <Divider key="divider-7" />,
    // sign in and out
    user ? (
      <>
        <a
          key="sign out"
          onClick={handleSignOut}
          className={classes.navtitle}
          tabIndex={0}
        >
          Sign Out
          {isAdmin && (
            <>
              <p style={{ color: "gold", margin: 0, fontSize: "12px" }}>
                ADMIN
              </p>
            </>
          )}
          {isLead && (
            <p style={{ color: "gold", margin: 0, fontSize: "12px" }}>LEAD</p>
          )}
        </a>
      </>
    ) : (
      <>
        <a
          key="sign in"
          onClick={() => setSignInPopupOpen(true)}
          className={classes.navtitle}
          tabIndex={0}
        >
          Sign In
        </a>
      </>
    ),
  ];

  return (
    <div className={useStyles().root}>
      <Link href="/" tabIndex={0}>
        <img
          src="/header-logo.png"
          alt="University of Washington School of Medicine logo"
          className={useStyles().logo}
        />
      </Link>

      <Hidden only={["lg", "md", "xl"]}>
        <BasicMenu links={links} />
      </Hidden>
      <Hidden only={["sm", "xs"]}>
        <div style={{ marginRight: "3em", display: "flex" }}>
          {links.map((element: React.ReactNode, index) => (
            <React.Fragment key={index}>{element}</React.Fragment>
          ))}
        </div>
      </Hidden>
      <SignInPopup
        open={isSignInPopupOpen}
        close={() => setSignInPopupOpen(false)}
      />
    </div>
  );
};

export default Header;
