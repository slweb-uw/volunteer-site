import React, { useEffect, useState } from "react";
import nookies from "nookies";
import { firebaseAdmin } from "../firebaseAdmin";
import { firebaseClient } from "../firebaseClient";
import Iframe from 'react-iframe';

import {
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import {
  createStyles,
  CssBaseline,
  Typography,
  withStyles,
  Button,
  Link,
} from "@material-ui/core";
import { withSnackbar } from "notistack";

//// Only allow authenticated users, otherwise redirect to home page
//export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  //try {
    //const cookies = nookies.get(ctx);
    //const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
    //const user = await firebaseAdmin.auth().getUser(token.uid);
    //const { uid, email } = user;
    //return { props: { uid, email } };
  //} catch (err) {
    //// either the `token` cookie didn't exist
    //// or token verification failed
    //// either way: redirect to the home page
    //ctx.res.writeHead(302, { Location: "/" });
    //ctx.res.end();
    //return { props: {} as never };
  //}
//};

interface Props {
  uid: string;
  email: string;
  classes?: any;
  enqueueSnackbar: (message: string) => void;
}

const AddModifyOrdersPage: NextPage<Props> = ({
  classes,
  enqueueSnackbar,
  uid,
  email,
}) => {
  //useEffect(() => {
    //firebaseClient.analytics().logEvent("calendar_page_visit");
  //})
  return (
    <div >
      <Link href="/opportunities">
        <Button
          color="primary"
          variant="contained"
          className={classes.backBtn}
        >
          Back
        </Button>
      </Link>
      <div className={classes.calendar}>
        <Iframe url="https://calendar.google.com/calendar/embed?height=600&amp;wkst=1&amp;bgcolor=%23ffffff&amp;ctz=America%2FLos_Angeles&amp;src=c2x3ZWJAdXcuZWR1&amp;src=ZW4udXNhI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&amp;color=%23039BE5&amp;color=%230B8043" 
        styles={{ display: "block" }} width="1800vh" height="800vh" scrolling="yes">
        </Iframe>
      </div>
      <Typography style={{marginLeft: "2.5vw", marginBottom: "1rem", fontFamily: "Encode Sans", color:"gray"}}>* To import the calendar, click the blue plus button at the bottom right of the calendar.</Typography>
    </div>
  );
};

const styles = createStyles({
  calendar: {
    display: 'flex',  
    justifyContent:'center',
    alignItems:'center',
    maxHeight: '100%',
    width: "95%",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "2rem",
    marginTop: "1.5rem",
  },
  backBtn: {
    width: "100px",
    marginTop: "1.5rem",
    marginLeft: "2.5vw",
    fontFamily: "Encode Sans",
    fontWeight: 800,
    "&:hover": {
      color: "#B7A57A",
      transition: ".25s",
    }
  }
});

//@ts-ignore
export default withStyles(styles)(withSnackbar(AddModifyOrdersPage));