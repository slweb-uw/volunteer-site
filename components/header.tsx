import React from "react";
import styled from "styled-components";
import Link from "next/link";
import NavLink from "./navlink";
import Hidden from "@material-ui/core/Hidden";
import { useAuth } from "auth";
import { firebaseClient } from "firebaseClient";
import BasicMenu from "./basicMenu";
import { makeStyles } from "@material-ui/core/styles";

// Create more customizable media query @ line 18
export const StyledLink = styled.a`
  color: white;
  text-decoration: none;
  margin: 1em;
  padding-bottom: 5px;
  cursor: pointer;
  @media screen and (max-width: 960px) {
    color: black;
  }

  &:hover {
    color: #B7A57A;
    transition: .25s;
  }
`;

const Header: React.FC<{}> = (props) => {
  const { user } = useAuth();

  const links: React.ReactNode[] = [
    <NavLink key="/" href="/">
      <StyledLink style={{ fontFamily: "Encode Sans" }}>HOME</StyledLink>
    </NavLink>,
    <span style={{ fontSize: "35px", color: "grey", marginTop: "8px" }}>/</span>,
    <a key="training" style={{marginTop:"1em", textDecoration:"none"}} href="https://canvas.uw.edu/courses/1176739/pages/service-learning-skills-training-modules?module_item_id=11110569" target="_blank">
      <StyledLink style={{ fontFamily: "Encode Sans" }}>TRAINING</StyledLink>
    </a>,
    //*NOTE: Resources name was changed to Links*/
    <span style={{ fontSize: "35px", color: "grey", marginTop: "8px" }}>/</span>,
    <NavLink key="resources" href="/resources">
      <StyledLink style={{ fontFamily: "Encode Sans" }}>LINKS</StyledLink>
    </NavLink>,
    <span style={{ fontSize: "35px", color: "grey", marginTop: "8px" }}>/</span>,
    <a key="protocols" style={{marginTop:"1em", textDecoration:"none", fontFamily: "Encode Sans"}} href="https://canvas.uw.edu/courses/1176739/pages/protocols?module_item_id=15194947" target="_blank">
      <StyledLink style={{ fontFamily: "Encode Sans" }}>PROTOCOLS</StyledLink>
    </a>,
    <span style={{ fontSize: "35px", color: "grey", marginTop: "8px" }}>/</span>,
    <NavLink key="donations" href="/donations">
      <StyledLink style={{ fontFamily: "Encode Sans" }}>DONATIONS</StyledLink>
    </NavLink>,
    <span style={{ fontSize: "35px", color: "grey", marginTop: "8px" }}>/</span>,
    // sign in and out
    user ? (
      <StyledLink
        key="sign out"
        onClick={() => {
          firebaseClient.auth().signOut();
        }}
        style={{ fontFamily: "Encode Sans" }}
      >
        SIGN OUT
      </StyledLink>
    ) : (
      <StyledLink
        key="sign in"
        onClick={() => {
          var provider = new firebaseClient.auth.OAuthProvider("microsoft.com");
          provider.setCustomParameters({
            // Target uw login
            tenant: "uw.edu",
          });
          firebaseClient.auth().signInWithPopup(provider);
        }}
        style={{ fontFamily: "Encode Sans" }}
      >
        SIGN IN
      </StyledLink>
    ),
  ];

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
      fontFamily: "Encode Sans"
    },
  }));


  return (
    <div className={useStyles().root}>
      <Link href="/">
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
