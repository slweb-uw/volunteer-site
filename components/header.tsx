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
    justifyContent: "space-between",
    alignContent: "flex-end",
    alignItems: "flex-start",
    [theme.breakpoints.up("md")]: {
      justifyContent: "space-between",
    },
    paddingBottom: "0px",
  },
  navtitle: {
    fontFamily: "Encode Sans",
    fontWeight: 600,
    color: "white",
    textDecoration: "none",
    margin: "1em",
    paddingBottom: "5px",
    cursor: "pointer",
    "&:hover, &:focus": {
      color: "#B7A57A",
      transition: ".25s",
    }
  },
}));

const Header: React.FC<{}> = (props) => {
  const { user } = useAuth();

  const links: React.ReactNode[] = [
    <NavLink key="/" href="/">
      <a className={useStyles().navtitle}>HOME</a>
    </NavLink>,
    <span style={{ fontSize: "35px", color: "grey", marginTop: "8px" }}>/</span>,
    <NavLink key="training" href="https://canvas.uw.edu/courses/1176739/pages/service-learning-skills-training-modules?module_item_id=11110569">
      <a className={useStyles().navtitle}>TRAINING</a>
    </NavLink>,
    //*NOTE: Resources name was changed to Links*/
    <span style={{ fontSize: "35px", color: "grey", marginTop: "8px" }}>/</span>,
    <NavLink key="resources" href="/resources">
      <a className={useStyles().navtitle}>LINKS</a>
    </NavLink>,
    <span style={{ fontSize: "35px", color: "grey", marginTop: "8px" }}>/</span>,
    <NavLink key="protocols" href="https://canvas.uw.edu/courses/1176739/pages/protocols?module_item_id=15194947">
      <a className={useStyles().navtitle}>PROTOCOLS</a>
    </NavLink>,
    <span style={{ fontSize: "35px", color: "grey", marginTop: "8px" }}>/</span>,
    <NavLink key="donations" href="/donations">
      <a className={useStyles().navtitle}>DONATIONS</a>
    </NavLink>,
    <span style={{ fontSize: "35px", color: "grey", marginTop: "8px" }}>/</span>,
    <NavLink key="opportunities" href="/opportunities">
      <a className={useStyles().navtitle}>OPPORTUNITIES</a>
    </NavLink>,
    <span style={{ fontSize: "35px", color: "grey", marginTop: "8px" }}>/</span>,
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
          SIGN OUT
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
          SIGN IN
        </a>
      </NavLink>
    ),
  ];


  return (
    <div className={useStyles().root}>
      <Link href="/">
        <a tabIndex={1}>
          <img
            src="/header-logo.png"
            style={{
              position: "relative",
              cursor: "pointer",
              width: "25em",
              minWidth: 5,
              paddingBottom: "10px",
              paddingLeft: "10px",
              paddingTop: "5px",
              marginBottom: "10px"
            }}
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
