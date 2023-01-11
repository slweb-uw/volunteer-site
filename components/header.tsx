import React from "react";
import Link from "next/link";
import NavLink from "./navlink";
import Hidden from "@material-ui/core/Hidden";
import { useAuth } from "auth";
import { firebaseClient } from "firebaseClient";
import BasicMenu from "./basicMenu";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    backgroundColor: "#4B2E83",
    padding: "1em",
    width: "100%",
    height: "3.75rem",
    paddingTop: "5px",
    paddingBottom: "5px",
    justifyContent: "space-between",
    alignContent: "flex-end",
    alignItems: "flex-start",
    [theme.breakpoints.up("md")]: {
      justifyContent: "space-between",
    },
    fontFamily: "initial",
    fontWeight: "initial",
    lineHeight: "initial",
    letterSpacing: "initial",
  },
  navtitle: {
    fontFamily: "Encode Sans",
    fontWeight: 600,
    fontSize: "16px",
    color: "white",
    textAlign: "center",
    textDecoration: "none",
    margin: "1em",
    marginLeft: "0.5em",
    marginRight: "0.5em",
    paddingBottom: "5px",
    cursor: "pointer",
    "&:hover": {
      color: "#B7A57A",
      transition: ".25s",
    },
    "&:focus-visible": {
      outline: "none",
      boxShadow: "0 0 0 0.2rem #80bdff",
      borderColor: "#80bdff",
      borderRadius: "4px",
    },
    "@media only screen and (max-width: 960px)":{
      color: "black",
      margin: "0",
      padding: "0", 
    }
  },
  logo: {
    position: "relative",
    cursor: "pointer",
    width: "25em",
    minWidth: 5,
    paddingLeft: "10px",
    paddingTop: "5px",
    "@media only screen and (max-width: 480px)":{
      maxHeight: "100%",
      paddingLeft: "0",
      marginLeft: "0",
      width: "80vw"
    }
  },
  divider:{
    fontSize: "35px",
    color: "grey",
    marginTop: "8px",
    "@media only screen and (max-width: 960px)":{
      padding: "0px",
      fontSize: "0px",
      margin: "0px",
    }
  }
}));

const Divider = () => <span className={useStyles().divider}>/</span>;

const Header: React.FC<{}> = (props) => {
  const { user } = useAuth();

  const links: React.ReactNode[] = [
    <NavLink key="/" href="/">
      <a className={useStyles().navtitle}>Home</a>
    </NavLink>,
    <Divider/>,
    <NavLink key="opportunities" href="/opportunities">
      <a className={useStyles().navtitle}>Opportunities</a>
    </NavLink>,
    <Divider/>,
    <NavLink key="training" href="https://canvas.uw.edu/courses/1176739/pages/service-learning-skills-training-modules?module_item_id=11110569">
      <a className={useStyles().navtitle}>Training</a>
    </NavLink>,
    //*NOTE: Resources name was changed to Links*/
    <Divider/>,
    <NavLink key="resources" href="/resources">
      <a className={useStyles().navtitle}>Links</a>
    </NavLink>,
    <Divider/>,
    <NavLink key="protocols" href="https://canvas.uw.edu/courses/1176739/pages/protocols?module_item_id=15194947">
      <a className={useStyles().navtitle}>Protocols</a>
    </NavLink>,
    <Divider/>,
    <NavLink key="donations" href="/donations">
      <a className={useStyles().navtitle}>Donations</a>
    </NavLink>,
    <Divider/>,
    // sign in and out
    user ? (
      <NavLink key="sign out" href="">
        <a
          key="sign out"
          onClick={() => {
            firebaseClient.auth().signOut();
          }}
          className={useStyles().navtitle}
        >
          Sign Out
        </a>
      </NavLink>
    ) : (
      <NavLink key="sign in" href="">
        <a
          key="sign in"
          onClick={() => {
            var provider = new firebaseClient.auth.OAuthProvider("microsoft.com");
            provider.setCustomParameters({
              // Target uw login
              tenant: "uw.edu",
            });
            firebaseClient.auth().signInWithPopup(provider);
          }}
          className={useStyles().navtitle}
        >
          Sign In 
        </a>
      </NavLink>
    ),
  ];


  return (
    <div className={useStyles().root}>
      <Link href="/">
        <a>
          <img
            src="/header-logo.png"
            alt="University of Washington School of Medicine logo"
            className={useStyles().logo}
          />
        </a>
      </Link>

      <Hidden only={["lg", "md", "xl"]}>
        <BasicMenu links={links} />
      </Hidden>
      <Hidden only={["sm", "xs"]}>
        <div style={{ marginRight: "3em", display: "flex" }}>
          {links.map((element: React.ReactNode) => {
            return element;
          })}
          {/* <NavLink href="/training"><StyledLink>Training</StyledLink></NavLink> */}
        </div>
      </Hidden>
    </div>
  );
};

export default Header;
