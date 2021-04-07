import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Link from "next/link";
import styled from 'styled-components'

const StyledLink = styled.a`
  color: white;
  font-family: 'Lato', sans-serif;
  text-decoration: none;
  margin: 1em;
`

function NavLink({ href, name }) {
  return (
    <Link href={href} passHref>
      <StyledLink>{name}</StyledLink>
    </Link>
  )
}

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
        <img src="/header-logo.png" style={{
                                            cursor: "pointer",
                                            width: "26em",
                                            padding: "1em"
                                            }} />
      </Link>
      <div style={{ marginRight: "3em" }}>
        <NavLink href="/" name="Home"/>
        <NavLink href="/" name="About"/>
        <NavLink href="/" name="Training"/>
        <NavLink href="/" name="Resources"/>
        <NavLink href="/" name="Donations"/>
      </div>
    </div>
  );
};

export default Header;
