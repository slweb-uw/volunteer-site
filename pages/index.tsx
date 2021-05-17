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
          <Typography variant="h4" gutterBottom style={{ fontSize: "2.5rem", width: "50%", marginLeft: "3rem", color: "#4B2E83"}}>
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
      {/* <div style={{
        marginLeft: "auto",
        marginRight: "auto",
        width: "95%",
        maxWidth: 1500
      }}> */}
        <div>

        </div>

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
                  width: "70%",
                }}
                src="/serveWithUs.png"
                alt="doctor caring for mom with child"
              />
            </div>
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <div
              style={{
                width: "70%",
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

      <div
        style={{
          marginTop: "3em",
          paddingTop: "3em",
          paddingBottom: "5em",
          verticalAlign: "middle"
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} lg={8}>
            <div
              style={{
                width: "70%",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <Typography gutterBottom variant="h4" style={{paddingBottom: "1em"}}>
                About Us
              </Typography>
              <Typography>
              The UW School of Medicine's Service Learning program strives to enrich medical education by providing our students with opportunities to hone their skills while addressing the health needs of our underserved communities. We seek to foster the joy of service in our students who are preparing for lives of civic and social responsibility in an increasingly diverse and complex global society.
              </Typography>
              <Typography>
              These goals could not be achieved without strong community partnerships, dedicated supervising providers, and collaboration with the other six health sciences schools.
              </Typography>
              <Typography>
              Please take a moment to glance through the amazing clinical and mentoring projects on this website that have been developed by our students over the past ten years.
              </Typography>
            </div>
          </Grid>
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
                  width: "70%",
                }}
                src="/aboutUs.png"
                alt="doctor caring for mom with child"
              />
            </div>
          </Grid>
        </Grid>
      </div>
      <div style={{
          backgroundColor: "#E8E3D3",
          marginTop: "8em",
          paddingTop: "5em",
          paddingBottom: "5em",
          verticalAlign: "middle",
        }}>
          <Grid container sm={6}>
            <Grid>
              <div>hi</div>
              <div>hello hello</div>
            </Grid>
            <Grid>
              <div>hi</div>
              <div>hello hello</div>
              </Grid>

          </Grid>

      </div>
    </div>
  );
};

export default App;
