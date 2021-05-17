import React, { useEffect } from "react";
import {
  withStyles,
  createStyles,
  Typography,
  Grid,
  NoSsr,
} from "@material-ui/core";
import Link from "next/link";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import styles from "../styles/Home.module.css";
import { firebaseClient } from "firebaseClient";

import HomeCard from "../components/homeCard";

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
      {/** top level div, background imager and header*/}
      <div id={styles["image-container"]}>
        <div id={styles.background}>
          <div id={styles["triangle-topleft"]}></div>
          <div id={styles["triangle-bottomleft"]}></div>
          <div id={styles.text} style={{ margin: "10px" }}>
            <Typography
              variant="h4"
              gutterBottom
              style={{
                fontSize: "2.5rem",
                width: "50%",
                marginLeft: "3rem",
                color: "#4B2E83",
                fontWeight: 700,
              }}
            >
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

      <div
        style={{
          margin: "2em",
          width: "95%",
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Card variant="outlined" style={{ borderRadius: 10, margin: "1em", height: "auto" }}>
          <CardMedia component="img" src="./home1.png" style={{ height: "200px", width: "auto" }}></CardMedia>
          <CardContent>
            <Typography>Welcome</Typography>
            <hr></hr>
            <Typography>Find Opportunities</Typography>
          </CardContent>
        </Card>
        <Card variant="outlined" style={{ borderRadius: 10, margin: "1em" }}>
          <CardMedia component="img" src="./home2.png" style={{ height: "200px", width: "auto" }}></CardMedia>
          <CardContent>
            <Typography>Welcome</Typography>
            <hr></hr>
            <Typography>Onboarding</Typography>
            <hr></hr>
            <Typography>Find Opportunities</Typography>
          </CardContent>
        </Card>
        <Card variant="outlined" style={{ borderRadius: 10, margin: "1em" }}>
          <CardMedia component="img" src="./home3.png" style={{ height: "200px", width: "280px" }}></CardMedia>
          <CardContent>
          <Typography>Become a Partner</Typography>
          </CardContent>
        </Card>
      </div>

      {/** Serve With Us section*/}
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

      {/** About Us section*/}
      <div
        style={{
          marginTop: "3em",
          paddingTop: "3em",
          paddingBottom: "3em",
          verticalAlign: "middle",
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
              <Typography
                gutterBottom
                variant="h4"
                style={{ paddingBottom: "1em" }}
              >
                About Us
              </Typography>
              <Typography>
                The UW School of Medicine's Service Learning program strives to
                enrich medical education by providing our students with
                opportunities to hone their skills while addressing the health
                needs of our underserved communities. We seek to foster the joy
                of service in our students who are preparing for lives of civic
                and social responsibility in an increasingly diverse and complex
                global society.
              </Typography>
              <Typography>
                These goals could not be achieved without strong community
                partnerships, dedicated supervising providers, and collaboration
                with the other six health sciences schools.
              </Typography>
              <Typography>
                Please take a moment to glance through the amazing clinical and
                mentoring projects on this website that have been developed by
                our students over the past ten years.
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

      {/** Contact Us section*/}
      <div
        style={{
          backgroundColor: "#E8E3D3",
          padding: "2em 5em 3em 5em",
          verticalAlign: "middle",
        }}
      >
        <Typography gutterBottom variant="h4" style={{ paddingBottom: "1em" }}>
          Contact Us
        </Typography>
        <Grid container spacing={6} style={{ marginTop: "2em" }}>
          <Grid item xs={6}>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Grid container direction="row" spacing={4}>
                  <Grid item>
                    <img src="./profile-icon.png" alt="profile icon" />
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" style={{ width: "60%" }}>
                      Leonora Clarke, Service Learning Manager, UW School of
                      Medicine
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container direction="column">
                  <Grid item>
                    <Typography variant="h6">clarkel@uw.edu</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6">206-685-2009</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6">
                      Health Sciences Building, Suite A-300
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Grid container direction="row" spacing={4}>
                  <Grid item>
                    <img src="./mail-icon.png" alt="mail icon" />
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" style={{ fontWeight: 600 }}>
                      Mailing Address
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container direction="column">
                  <Grid item>
                    <Typography variant="h6">
                      1959 NE. Pacific Ave. Suite A-300
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6">Box 356340</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6">Seattle, WA 98195</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default App;
