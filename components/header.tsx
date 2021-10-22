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
  font-family: "Lato", sans-serif;
  text-decoration: none;
  margin: 1em;
  cursor: pointer;
  @media screen and (max-width: 960px) {
    color: black;
  }
  
  &:hover {
    font-weight: 600;
  }
`;

const Header: React.FC<{}> = (props) => {
  const { user } = useAuth();

  const links: React.ReactNode[] = [
    <NavLink href="/">
      <StyledLink>Home</StyledLink>
    </NavLink>,
    <NavLink href="/resources">
      <StyledLink>Resources</StyledLink>
    </NavLink>,
    <NavLink href="/protocols">
      <StyledLink>Protocols</StyledLink>
    </NavLink>,
    <NavLink href="/donations">
      <StyledLink>Donations</StyledLink>
    </NavLink>,
    // sign in and out
    user ? (
      <StyledLink
        onClick={() => {
          firebaseClient.auth().signOut();
        }}
      >
        Sign Out
      </StyledLink>
    ) : (
      <StyledLink
        onClick={() => {
          var provider = new firebaseClient.auth.OAuthProvider(
            "microsoft.com"
          );
          provider.setCustomParameters({
            // Target specific email with login hint.
            tenant: 'uw.edu'
          });
          firebaseClient.auth().signInWithPopup(provider);
        }}
      >
        Sign In
      </StyledLink>
    )
  ]

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      backgroundColor: "#4B2E83",
      padding: "1em",
      margin: "0em",
      width: "100%",
      justifyContent: "flex-end",
      alignContent: "flex-end",
      [theme.breakpoints.up('md')]: {
        justifyContent:"space-between"
      },
    },
  }));

  return (
    <div
      className={useStyles().root}
    >
      <Hidden only={["lg", "md", "xl"]}>
        <BasicMenu links={links} />
      </Hidden>
      <Hidden only={["xs", "sm"]}>
        <Link href="/">
          <img
            src="/header-logo.png"
            style={{
              cursor: "pointer",
              width: "28em",
              padding: ".6em",
            }}
          />
        </Link>
      </Hidden>

      <Hidden only={["sm", "xs"]}>
        <div style={{ marginRight: "3em", display: "flex" }}>
          {links.map((element:React.ReactNode) => {
              return element;
          })}
          {/* <NavLink href="/training"><StyledLink>Training</StyledLink></NavLink> */}
        </div>
      </Hidden>
    </div>
  );
};

export default Header;
