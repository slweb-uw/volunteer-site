import React, { useEffect } from "react";
import {
  withStyles,
  createStyles,
  Typography,
} from "@material-ui/core";
import Link from 'next/link';

import { firebaseClient } from "firebaseClient";
interface Props {
  classes?: any;
}

const App: React.FC<Props> = ({ classes }) => {
  // Page where customers can check their order status

  useEffect(() => {
    firebaseClient.analytics().logEvent('home_page_visit');
  }, []);

  return (
    <div>
      <div className={classes.page}>

      {/* TODO: turn links into cards */}

      <Link href="/Seattle"><Typography>Seattle</Typography></Link>
      <Link href="/Spokane"><Typography>Spokane</Typography></Link>
      <Link href="/Alaska"><Typography>Alaska</Typography></Link>
      <Link href="/Wyoming"><Typography>Wyoming</Typography></Link>
      <Link href="/Montana"><Typography>Idaho</Typography></Link>

      {/* Idaho wants to use own website, but card should look the same */}
      <a href="/Idaho"><Typography>Idaho</Typography></a>

      </div>
    </div>
  );
};

const styles = (theme: any) =>
  createStyles({
    page: {
      width: "90%",
      maxWidth: 600,
      marginLeft: "auto",
      marginRight: "auto",
      [theme.breakpoints.up("sm")]: {
        position: "absolute",
        marginTop: 0,
        marginBottom: 0,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      },
      marginTop: "6em",
      marginBottom: '6em'
    },
  });

export default withStyles(styles)(App);
