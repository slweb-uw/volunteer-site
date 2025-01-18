import React, { useState, Dispatch, SetStateAction } from "react"
import Hidden from "@mui/material/Hidden"
import { useAuth } from "auth"
//import BasicMenu from "./basicMenu"
import SignInPopup from "./SignInPopup"
import makeStyles from "@mui/styles/makeStyles"
import { signOut } from "firebase/auth"
import { auth } from "firebaseClient"
import Link from "next/link"

import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/icons-material/Menu"
import SwipeableDrawer from "@mui/material/SwipeableDrawer"
import List from "@mui/material/List"
import { Theme } from "@mui/material"

const useStyles = makeStyles((theme: Theme) => ({
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
}))

const Divider = () => <span className={useStyles().divider}>/</span>

const Header: React.FC<{}> = () => {
  const [isSignInPopupOpen, setSignInPopupOpen] = useState(false)
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Link href="/" tabIndex={0}>
        <img
          src="/header-logo.png"
          alt="University of Washington School of Medicine logo"
          className={classes.logo}
        />
      </Link>

      <Hidden only={["lg", "md", "xl"]}>
        <MobileNavMenu
          links={<NavLinks setSignInPopupOpen={setSignInPopupOpen} />}
        />
      </Hidden>
      <Hidden only={["sm", "xs"]}>
        <div style={{ marginRight: "3em", display: "flex" }}>
          <NavLinks setSignInPopupOpen={setSignInPopupOpen} />
        </div>
      </Hidden>
      <SignInPopup
        open={isSignInPopupOpen}
        close={() => setSignInPopupOpen(false)}
      />
    </div>
  )
}

type Anchor = "top"

const MobileNavMenu = ({ links }: { links: React.JSX.Element }) => {
  const [state, setState] = React.useState({
    top: false,
  })

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return
      }
      setState({ ...state, [anchor]: open })
    }
  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: "40vw" }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          paddingLeft: "0.5rem",
        }}
      >
        {links}
      </List>
    </Box>
  )

  return (
    <div
      style={{
        marginRight: "2em",
      }}
    >
      {(["top"] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <IconButton
            style={{ width: "min-content" }}
            onClick={toggleDrawer(anchor, true)}
            size="large"
          >
            <Menu style={{ color: "white" }} />
          </IconButton>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  )
}

const NavLinks = ({
  setSignInPopupOpen,
}: {
  setSignInPopupOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const classes = useStyles()
  const { user, isAdmin, isLead } = useAuth()
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
      {user ? (
        <>
          <a
            key="sign out"
            onClick={() => {
              signOut(auth)
              setSignInPopupOpen(false)
            }}
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
      )}
    </>
  )
}

export default Header
