import React, { useEffect } from "react";
import {
  withStyles,
  createStyles,
  Typography,
  Grid,
  NoSsr,
  makeStyles,
  Button,
} from "@material-ui/core";
import Link from "next/link";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { firebaseClient } from "firebaseClient";

const App: React.FC<{}> = () => {
  // Page where customers can check their order status

  const classes = useStyles();

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
      {/** Cover image and header*/}
      <div className={classes.container}>
        <div className={classes.background}>
          <div className={classes.triangletop}></div>
          <div className={classes.trianglebottom}></div>
          <div
            className={classes.text}
            style={{ margin: "10px", marginLeft: "4rem" }}
          >
            <Typography
              variant="h4"
              gutterBottom
              style={{
                fontSize: "2.5rem",
                width: "60%",
                color: "#4B2E83",
                fontWeight: 700,
              }}
            >
              {
                "Welcome to Service Learning at the UW School of Medicine/WWAMI & UW Health Sciences"
              }
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              style={{ fontSize: "1.2rem" }}
            >
              Choose a location to find Service Learning opportunities in that
              area
            </Typography>
            <Button
              color="primary"
              variant="contained"
              style={{ width: "15%" }}
            >
              Find Opportunities {">"}
            </Button>
          </div>
        </div>
      </div>

      {/** Get started section, contains three cards -- students, volunteer providers, community partners */}
      <div style={{ textAlign: "center", margin: "2em" }}>
        <Typography
          gutterBottom
          variant="h4"
          style={{ fontWeight: 700, paddingBottom: "0.5em" }}
        >
          Get Started
        </Typography>
        <div
          style={{
            margin: "2em",
            width: "95%",
            display: "flex",
            justifyContent: "center",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography style={{ fontSize: "1.3rem", fontWeight: 700 }}>
              Students
            </Typography>
            <Card
              variant="outlined"
              style={{ borderRadius: 10, margin: "1em", height: "auto" }}
            >
              <CardMedia
                component="img"
                src="./home1.png"
                style={{ height: "200px", width: "auto" }}
              ></CardMedia>
              <CardContent>
                <div className={classes.cardlinks}>
                  <Typography>Welcome</Typography>
                  <Typography>&gt;</Typography>
                </div>
                <hr></hr>
                <div className={classes.cardlinks}>
                  <Typography>Find Opportunities</Typography>
                  <Typography>&gt;</Typography>
                </div>
              </CardContent>
            </Card>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography style={{ fontSize: "1.3rem", fontWeight: 700 }}>
              Volunteer Providers
            </Typography>

            <Card
              variant="outlined"
              style={{ borderRadius: 10, margin: "1em" }}
            >
              <CardMedia
                component="img"
                src="./home2.png"
                style={{ height: "200px", width: "auto" }}
              ></CardMedia>
              <CardContent>
                <div className={classes.cardlinks}>
                  <Typography>Welcome</Typography>
                  <Typography>&gt;</Typography>
                </div>
                <hr></hr>
                <div className={classes.cardlinks}>
                  <Typography>Onboarding</Typography>
                  <Typography>&gt;</Typography>
                </div>
                <hr></hr>
                <div className={classes.cardlinks}>
                  <Typography>Find Opportunities</Typography>
                  <Typography>&gt;</Typography>
                </div>
              </CardContent>
            </Card>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography style={{ fontSize: "1.3rem", fontWeight: 700 }}>
              Community Partners
            </Typography>

            <Card
              variant="outlined"
              style={{ borderRadius: 10, margin: "1em" }}
            >
              <CardMedia
                component="img"
                src="./home3.png"
                style={{ height: "200px", width: "280px" }}
              ></CardMedia>
              <CardContent>
                <div className={classes.cardlinks}>
                  <Typography>Become a Partner</Typography>
                  <Typography>&gt;</Typography>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/** Serve With Us section*/}
      <div
        style={{
          backgroundColor: "#E8E3D3",
          padding: "5em",
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
                  width: "20rem",
                }}
                src="/serve.png"
                alt="doctor caring for mom with child"
              />
            </div>
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <div
              style={{
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <Typography
                gutterBottom
                variant="h4"
                style={{ fontWeight: 700, paddingBottom: "0.5em" }}
              >
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
          padding: "5em",
          verticalAlign: "middle",
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} lg={8}>
            <div
              style={{
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <Typography
                gutterBottom
                variant="h4"
                style={{ fontWeight: 700, paddingBottom: "0.5em" }}
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
              <br></br>
              <Typography>
                These goals could not be achieved without strong community
                partnerships, dedicated supervising providers, and collaboration
                with the other six health sciences schools.
              </Typography>
              <br></br>
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
                  width: "25rem",
                }}
                src="/aboutUs2.png"
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
        <Typography
          gutterBottom
          variant="h4"
          style={{ fontWeight: 700, marginLeft: "2em" }}
        >
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
                    <Typography style={{ fontSize: "1.2rem" }}>
                      Leonora Clarke, Service Learning Manager
                    </Typography>
                    <Typography style={{ fontSize: "1.2rem" }}>
                      UW School of Medicine
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid
                  container
                  direction="column"
                  style={{ marginLeft: "5em" }}
                >
                  <Grid item>
                    <Typography>clarkel@uw.edu</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>206-685-2009</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>
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
                    <Typography style={{ fontSize: "1.2rem" }}>
                      Mailing Address
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid
                  container
                  direction="column"
                  style={{ marginLeft: "5em" }}
                >
                  <Grid item>
                    <Typography>1959 NE. Pacific Ave. Suite A-300</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>Box 356340</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>Seattle, WA 98195</Typography>
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


const useStyles = makeStyles((theme) => ({
  container: {
    height: "100%",
  },
  background: {
    backgroundImage: "url(./homeNew.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "661px",
    position: "relative",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  triangletop: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "50%",
    height: "100%",
    borderTop: "661px solid #FFFFFF95",
    borderRight: "100px solid transparent",
  },
  trianglebottom: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "50%",
    height: 0,
    borderBottom: "661px solid #FFFFFF95",
    borderRight: "100px solid transparent",
  },
  text: {
    display: "flex",
    position: "absolute",
    justifyContent: "center",
    flexDirection: "column",
    height: "100%",
  },
  cardlinks: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
}));

export default App;
