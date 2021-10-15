import * as React from "react";

import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/icons/Menu";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import NavLink from "./navlink";
import { StyledLink } from "./header";
import ListItem from "@material-ui/core/ListItem";

type Anchor = "right";

export default function SwipeableTemporaryDrawer() {
  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (anchor: Anchor, open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event &&
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: "40vw" }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem>
          <NavLink href="/">
            <StyledLink>Home</StyledLink>
          </NavLink>
        </ListItem>
        <ListItem>
          <NavLink href="/resources">
            <StyledLink>Resources</StyledLink>
          </NavLink>
        </ListItem>
        <ListItem>
          <NavLink href="/protocols">
            <StyledLink>Protocols</StyledLink>
          </NavLink>
        </ListItem>
        <ListItem>
          <NavLink href="/donations">
            <StyledLink>Donations</StyledLink>
          </NavLink>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div
      style={{
        marginRight: "2em",
      }}
    >
      {(["right"] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <IconButton
            style={{ width: "min-content" }}
            onClick={toggleDrawer(anchor, true)}
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
  );
}
