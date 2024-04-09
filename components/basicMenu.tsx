import React from "react";

import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/icons/Menu";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

type Anchor = "top";

interface Props {
  links: React.ReactNode[];
}

const BasicMenu: React.FC<Props> = (Props) => {
  const [state, setState] = React.useState({
    top: false,
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
        {Props.links.map((element: React.ReactNode, index) => {
          return <ListItem key={index}>{element}</ListItem>;
        })}
      </List>
    </Box>
  );

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
};

export default BasicMenu;
