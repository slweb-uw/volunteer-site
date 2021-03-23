import React, { useEffect, useState } from "react";
import { firebaseAdmin } from "../../firebaseAdmin";
import { firebaseClient } from "../../firebaseClient";
import { useRouter } from 'next/router'

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
} from "@material-ui/core";
import { withSnackbar } from "notistack";

// Get initial set of events for location
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const { location } = ctx.query; // string of current location (ex: "Seattle")
    const events : EventData[] = []
    // First 10 documents, without any filtering, and set that to events
    const querySnapshot = await firebaseAdmin.firestore().collection("/" + location).orderBy("timestamp", "desc").limit(12).get();
    querySnapshot.docs.forEach(document => {
      events.push(document.data() as EventData);
    })
    return { props: { events } };
  } catch (err) {
    console.log(err);
    ctx.res.writeHead(400);
    ctx.res.end();
    return { props: {} as never };
  }
};

interface Props {
  events: EventData[];
  classes?: any;
  enqueueSnackbar: (message: string) => void;
}

const Location: NextPage<Props> = ({
  events,
  classes,
  enqueueSnackbar,
}) => {

  const router = useRouter();
  const { location } = router.query; // string of current location (ex: "Seattle")

  useEffect(() => {
    firebaseClient.analytics().logEvent("location_page_visit");
  })

  return (
    <div>
      <div className={classes.page}>

      </div>
    </div>
  );
};

const styles = createStyles({
  page: {
    marginLeft: "auto",
    marginRight: "auto",
    //maxWidth: 1000,
    width: "95%",
    paddingTop: "2em",
  },
});

//@ts-ignore
export default withStyles(styles)(withSnackbar(Location));
