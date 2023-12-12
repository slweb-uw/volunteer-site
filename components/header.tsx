import React, { useState } from "react";
import Hidden from "@material-ui/core/Hidden";
import { firebaseClient } from "firebaseClient";
import { useAuth } from "auth";
import BasicMenu from "./basicMenu";
import SignInPopup from "./SignInPopup";
import { makeStyles } from "@material-ui/core/styles";
import "firebase/firestore";

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
    fontFamily: "Encode Sans Compressed, sans-serif",
    fontWeight: 600,
    fontSize: "17px",
    color: "white",
    textAlign: "center",
    textDecoration: "none",
    margin: "1em",
    marginLeft: "0.5em",
    marginRight: "0.5em",
    paddingBottom: "5px",
    letterSpacing: ".01em",
    cursor: "pointer",
    "&:hover": {
      color: "#B7A57A",
      transition: ".25s",
      textDecoration: "underline"
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
  const { user, isAdmin } = useAuth();
  const [isSignInPopupOpen, setSignInPopupOpen] = useState(false);

  const links: React.ReactNode[] = [
      <a  href="/" className={useStyles().navtitle} tabIndex={0}>Home</a>,
    <Divider/>,
      <a href="/opportunities" className={useStyles().navtitle} tabIndex={0}>Opportunities</a>,
    <Divider/>,
      <a className={useStyles().navtitle} href="https://canvas.uw.edu/courses/1693188/pages/training-modules?module_item_id=18595279" target="_blank" tabIndex={0}>Training</a>,
    //*NOTE: Resources name was changed to Links*/
    <Divider/>,
      <a  href="/resources" className={useStyles().navtitle} tabIndex={0}>Links</a>,
    <Divider/>,
      <a href="https://canvas.uw.edu/courses/1693188/pages/protocols?module_item_id=18595280" className={useStyles().navtitle} target="_blank" tabIndex={0}>Protocols</a>,
    <Divider/>,
      <a href="/donations" className={useStyles().navtitle} tabIndex={0}>Donations</a>,
    <Divider/>,
    // sign in and out
    user ? (
      <>
        <a
          key="sign out"
          onClick={() => {
            firebaseClient.auth().signOut();
            setSignInPopupOpen(false)
          }}
          className={useStyles().navtitle}
          tabIndex={0}
        >
          Sign Out
          {isAdmin ? (
          <p style={{color: "gold", margin: 0, fontSize: "12px"}}>ADMIN</p>
        ) : null}
        </a>
        
      </>
    ) : (
      <>
        <a
          key="sign in"
          onClick={() => setSignInPopupOpen(true)}
          className={useStyles().navtitle}
          tabIndex={0}
        >
          Sign In 
        </a>
        <SignInPopup 
         open={isSignInPopupOpen} 
         close={() => setSignInPopupOpen(false)}
        />
      </>
        
    ),
    
  ];

  return (
    <div className={useStyles().root}>
        <a href="/" tabIndex={0}>
          <img
            src="/header-logo.png"
            alt="University of Washington School of Medicine logo"
            className={useStyles().logo}
          />
        </a>

      <Hidden only={["lg", "md", "xl"]}>
        <BasicMenu links={links} />
      </Hidden>
      <Hidden only={["sm", "xs"]}>
        <div style={{ marginRight: "3em", display: "flex" }}>
          {links.map((element: React.ReactNode) => {
            return element;
          })}
          
        </div>
      </Hidden>
    </div>
  );
};

export default Header;
