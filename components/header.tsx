import React from "react";
import styled from "styled-components";
import Link from "next/link";
import NavLink from "./navlink";
import Hidden from "@material-ui/core/Hidden";
import { useAuth } from "auth";
import { firebaseClient } from "firebaseClient";
import BasicMenu from "./basicMenu";

export const StyledLink = styled.a`
  color: black;
  font-family: "Lato", sans-serif;
  text-decoration: none;
  margin: 1em;
  cursor: pointer;

  &:hover {
    font-weight: 600;
  }
`;

const Header: React.FC<{}> = (props) => {
  const { user } = useAuth();

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#4B2E83",
        padding: "1em",
        margin: "0em",
        width: "100%",
        justifyContent: "flex-end",
        alignContent: "flex-end",
      }}
    >
      <Hidden only={["lg", "md", "xl"]}>
        <BasicMenu />
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
          <NavLink href="/">
            <StyledLink>Home</StyledLink>
          </NavLink>
          {/* <NavLink href="/training"><StyledLink>Training</StyledLink></NavLink> */}
          <NavLink href="/resources">
            <StyledLink>Resources</StyledLink>
          </NavLink>
          <NavLink href="/protocols">
            <StyledLink>Protocols</StyledLink>
          </NavLink>
          <NavLink href="/donations">
            <StyledLink>Donations</StyledLink>
          </NavLink>

          {/* Sign in and out */}
          {user ? (
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
                  login_hint: "netid@uw.edu",
                });
                firebaseClient.auth().signInWithPopup(provider);
              }}
            >
              Sign In
            </StyledLink>
          )}
        </div>
      </Hidden>
    </div>
  );
};

export default Header;
