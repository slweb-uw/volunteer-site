import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/icons-material/Menu";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import { ListItem } from "@mui/material";

type Anchor = "top";

interface Props {
  links: React.ReactNode[];
}

const BasicMenu: React.FC<Props> = (Props: Props) => {
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
      <List style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: "0.5rem" }}>
        {Props.links.map((element: React.ReactNode, index: number) => {
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
            size="large">
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
