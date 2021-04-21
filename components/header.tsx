import React from 'react'
import styled from 'styled-components'
import Link from "next/link";
import NavLink from "./navlink";

const StyledLink = styled.a`
  color: white;
  font-family: 'Lato', sans-serif;
  text-decoration: none;
  margin: 1em;
  cursor: pointer;

  &:hover {
    font-weight: 600;
  }
`

const Header: React.FC<{}> = (props) => {
  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#4B2E83",
        padding: "1em",
        margin: "0em",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Link href="/">
        <img src="/header-logo.png"
        style={{
                cursor: "pointer",
                width: "28em",
                padding: ".6em"
              }} />
      </Link>
      <div style={{ marginRight: "3em", display: 'flex'}}>
        <NavLink href="/"><StyledLink>Home</StyledLink></NavLink>
        <NavLink href="/404"><StyledLink>Training</StyledLink></NavLink>
        <NavLink href="/resources"><StyledLink>Resources</StyledLink></NavLink>
        <NavLink href="/protocol"><StyledLink>Protocol</StyledLink></NavLink>
        <NavLink href="/donations"><StyledLink>Donations</StyledLink></NavLink>
      </div>
    </div>
  );
};

export default Header;
