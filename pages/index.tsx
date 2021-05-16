import React, { useEffect } from "react";
import {
  withStyles,
  createStyles,
  Typography,
  Grid,
  NoSsr,
} from "@material-ui/core";
import Link from "next/link";

import styles from '../styles/Home.module.css';
import { firebaseClient } from "firebaseClient";

const App: React.FC<{}> = () => {
  // Page where customers can check their order status

  useEffect(() => {
    firebaseClient.analytics().logEvent("home_page_visit");
  }, []);

  return (
    <div
      style={{
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <div id={styles["image-container"]}>
        <div id={styles.background}>
          <div id={styles["triangle-topleft"]}></div>
          <div id={styles["triangle-bottomleft"]}></div>
          <div id={styles.text} style={{margin: "10px"}}>
          <Typography variant="h4" gutterBottom style={{ color: "#4B2E83" }}>
          {
            "Welcome to Service Learning at the UW School of Medicine/WWAMI & UW Health Sciences"
          }
        </Typography>
        <Typography variant="h6" gutterBottom>
          <i>
            Choose a location to find Service Learning opportunities in that
            area
          </i>
        </Typography>
            <a>Find Opportunities</a>
          </div>
        </div>
      </div>
      {/* <div style={{ position: "relative" }}> */}

        {/* <img src="./home-overlay.png" style={{}}></img>
        <img src="./home-overlay2.png"></img>
        <img src="./homepage.png" style={{}}></img> */}
        {/* <Typography variant="h4" gutterBottom style={{ color: "#4B2E83" }}>
          {
            "Welcome to Service Learning at the UW School of Medicine/WWAMI & UW Health Sciences"
          }
        </Typography>
        <Typography variant="h6" gutterBottom>
          <i>
            Choose a location to find Service Learning opportunities in that
            area
          </i>
        </Typography>
      </div> */}

      {/** 
      <Grid container spacing={4}>
        <Grid item xs={6} sm={4} lg>
          <div
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              textAlign: "center",
            }}
          >
            <Link href="/location/Seattle">
              <div style={{ cursor: "pointer" }}>
                <img src="/Seattle.png" />
                <Typography>Seattle</Typography>
              </div>
            </Link>
          </div>
        </Grid>
        <Grid item xs={6} sm={4} lg>
          <div
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              textAlign: "center",
            }}
          >
            <Link href="/location/Spokane">
              <div style={{ cursor: "pointer" }}>
                <img src="/Spokane.png" />
                <Typography>Spokane</Typography>
              </div>
            </Link>
          </div>
        </Grid>
        <Grid item xs={6} sm={4} lg>
          <div
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              textAlign: "center",
            }}
          >
            <Link href="/location/Alaska">
              <div style={{ cursor: "pointer" }}>
                <img src="/Alaska.png" />
                <Typography>Alaska</Typography>
              </div>
            </Link>
          </div>
        </Grid>
        <Grid item xs={6} sm={4} lg>
          <div
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              textAlign: "center",
            }}
          >
            <Link href="/location/Wyoming">
              <div style={{ cursor: "pointer" }}>
                <img src="/Wyoming.png" />
                <Typography>Wyoming</Typography>
              </div>
            </Link>
          </div>
        </Grid>
        <Grid item xs={6} sm={4} lg>
          <div
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              textAlign: "center",
            }}
          >
            Idaho wants to use own website, but card should look the same 
            <a href="/Idaho" style={{ textDecoration: "none", color: "black" }}>
              <div style={{ cursor: "pointer" }}>
                <img src="/Idaho.png" />
                <Typography>Idaho</Typography>
              </div>
            </a>
          </div>
        </Grid>
      </Grid>
    */}
      <div
        style={{
          backgroundColor: "#E8E3D3",
          marginTop: "8em",
          paddingTop: "5em",
          paddingBottom: "5em",
          verticalAlign: "middle",
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} lg={4}>
            <div
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                textAlign: "center",
              }}
            >
              <img
                style={{
                  width: "80%",
                }}
                src="/serveWithUs.png"
                alt="doctor caring for mom with child"
              />
            </div>
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <div
              style={{
                width: "80%",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <Typography gutterBottom variant="h4">
                Serve With Us
              </Typography>
              <Typography>
                Volunteering with our programs is a wonderful way to practice
                your clinical and teaching skills, make a difference in our
                community and form meaningful connections. We invite you to
                explore our opportunities for providers and students alike. We
                are very flexible and try to make it easy to work around busy
                schedules. There is no required hourly commitment. Simply sign
                up when you have the time!
              </Typography>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default App;
