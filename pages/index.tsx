import React, { useEffect } from "react";
import {
  withStyles,
  createStyles,
  Typography,
  Grid,
  NoSsr,
  makeStyles,
  Button,
  CardActionArea,
  ListItemIcon,
} from "@material-ui/core";
import Link from "next/link";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { firebaseClient } from "firebaseClient";
import { ArrowForwardIos } from "@material-ui/icons";
import { textAlign, textTransform } from "@mui/system";
import HeadlineBar from "components/headlineBar";

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
                color: "black",
                fontWeight: 700,
                fontFamily: "Encode Sans",
                textTransform: "uppercase",
                marginBottom: "2px"
              }}
            >
              {
                "UW HEALTH SCIENCES/WWAMI"
              }
            </Typography>

            <HeadlineBar color="purple" width={600} height={20}></HeadlineBar>

            <Typography
              variant="h5"
              gutterBottom
              style={{
                fontSize: "2rem",
                color: "black",
                fontWeight: 700,
                fontFamily: "Uni Sans Book",
              }}
            >
              {
                "Service Learning"
              }
            </Typography>

            <Typography
              variant="subtitle1"
              gutterBottom
              style={{ fontSize: "1rem", width: "80%", fontFamily: "Open Sans", marginBottom: "20px"}}
            >
              Our program supports 50+ student led service projects throughout the region.
            </Typography>
            <Link href="/opportunities">
              <Button
                color="primary"
                variant="contained"
                style={{ width: "220px", fontFamily: "Encode Sans" }}
              >
                Find Opportunities
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "2em"}}>
        <div
          style={{
            margin: "2em",
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            columnGap: "5%",
            textAlign: "center"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "Uni Sans Book", textTransform: "uppercase" }}>
              Students
            </Typography>

            <div style={{ position: "absolute", marginBottom: "0", marginTop: "32px", marginRight: "9px" }}>
              <HeadlineBar color="gold" width={110} height={8}></HeadlineBar>
            </div>

            <Card
              variant="outlined"
              style={{ borderRadius: 10, margin: "1em", height: "auto" }}
            >
              <CardMedia
                component="img"
                src="./studentVolunteers.png"
                style={{ height: "200px", width: "301px" }}
              ></CardMedia>
              <CardActionArea href="/welcome/studentVolunteers" className={classes.cardhover}>
                <CardContent>
                  <div className={classes.cardlinks}>
                    <Typography className={classes.cardtitle}>Welcome</Typography>
                    <Typography><ArrowForwardIos style={{fontSize: "1em", color: "#4B2E83"}}/></Typography>
                  </div>
                </CardContent>
              </CardActionArea>
              <hr style={{border: ".2px solid #E5E5E5", width:"100%", margin:"0"}}></hr>
              <CardActionArea href="/opportunities" style={{backgroundColor: "#4B2E83", color: "#ffffff"}} className={classes.cardhover}>
                <CardContent>
                  <div className={classes.cardlinks}>
                    <Typography className={classes.cardtitle} style={{color: "#ffffff"}}>Find Opportunities</Typography>
                    <Typography><ArrowForwardIos style={{fontSize: "1em", color: "#ffffff"}}/></Typography>
                  </div>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "Uni Sans Book", textTransform: "uppercase" }}>
              Volunteer Providers
            </Typography>

            <div style={{ position: "absolute", marginBottom: "0", marginTop: "32px", marginRight: "15px" }}>
              <HeadlineBar color="gold" width={250} height={8}></HeadlineBar>
            </div>

            <Card
              variant="outlined"
              style={{ borderRadius: 10, margin: "1em" }}
            >
              <CardMedia
                component="img"
                src="./volunteerProviders.jpg"
                style={{ height: "200px", width: "301px", objectFit: "cover"}}
              ></CardMedia>
              <CardActionArea href="/welcome/volunteerProviders" className={classes.cardhover}>
                <CardContent>
                  <div className={classes.cardlinks}>
                    <Typography className={classes.cardtitle}>Welcome</Typography>
                    <Typography><ArrowForwardIos style={{fontSize: "1em", color: "#4B2E83"}}/></Typography>
                  </div>
                </CardContent>
              </CardActionArea>
              <hr style={{border: ".2px solid #E5E5E5", width:"100%", margin:"0"}}></hr>
              <CardActionArea href="/onboarding" className={classes.cardhover}>
                <CardContent>
                  <div className={classes.cardlinks}>
                    <Typography className={classes.cardtitle}>Onboarding</Typography>
                    <Typography><ArrowForwardIos style={{fontSize: "1em", color: "#4B2E83"}}/></Typography>
                  </div>
                </CardContent>
              </CardActionArea>
              <hr style={{border: ".2px solid #E5E5E5", width:"100%", margin:"0"}}></hr>
              <CardActionArea href="/opportunities" style={{backgroundColor: "#4B2E83", color: "#ffffff"}} className={classes.cardhover}>
                <CardContent>
                  <div className={classes.cardlinks}>
                  <Typography className={classes.cardtitle} style={{color: "#ffffff"}}>Find Opportunities</Typography>
                    <Typography><ArrowForwardIos style={{fontSize: "1em", color: "#ffffff"}}/></Typography>
                  </div>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "Uni Sans Book", textTransform: "uppercase" }}>
              Community Partners
            </Typography>

            <div style={{ position: "absolute", marginBottom: "0", marginTop: "32px", marginRight: "18px" }}>
              <HeadlineBar color="gold" width={240} height={8}></HeadlineBar>
            </div>

            <Card
              variant="outlined"
              style={{ borderRadius: 10, margin: "1em" }}
            >
              <CardMedia
                component="img"
                src="./home3.png"
                style={{ height: "200px", width: "301px" }}
              ></CardMedia>
              <hr style={{border: ".2px solid #E5E5E5", width:"100%", margin:"0"}}></hr>
              <CardActionArea href="/welcome/communitypartners" className={classes.cardhover}>
                <CardContent>
                  <div className={classes.cardlinks}>
                    <Typography className={classes.cardtitle}>Become a Partner</Typography>
                    <Typography><ArrowForwardIos style={{fontSize: "1em", color: "#4B2E83"}}/></Typography>
                  </div>
                </CardContent>
              </CardActionArea>
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
        <Grid container spacing={2}>
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
                style={{ fontWeight: 700, paddingBottom: "0", marginBottom: "0", fontFamily: "Encode Sans", textTransform: "uppercase" }}
              >
                Serve With Us
              </Typography>
              <HeadlineBar color="purple" width={250} height={10}></HeadlineBar>
              <Typography style={{ fontFamily: "Open Sans" }}>
                Volunteering with our programs is a wonderful way to practice your
                skills, make a difference in our community and form meaningful
                connections. We invite you to explore our opportunities for providers
                and students alike. We are very flexible and try to make it easy to work
                around busy schedules. There is no required hourly commitment. Simply
                sign up when you have the time!
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
                style={{ fontWeight: 700, paddingBottom: "0", marginBottom: "0", fontFamily: "Encode Sans", textTransform: "uppercase" }}
              >
                About Us
              </Typography>
              <HeadlineBar color="gold" width={160} height={10}></HeadlineBar>
              <Typography style={{ fontFamily: "Open Sans" }}>
                The UW School of Medicine's Service Learning program strives to
                enrich medical education by providing our students with
                opportunities to hone their skills while addressing the health
                needs of our underserved communities. We seek to foster the joy
                of service in our students who are preparing for lives of civic
                and social responsibility in an increasingly diverse and complex
                global society.
              </Typography>
              <br></br>
              <Typography style={{ fontFamily: "Open Sans" }}>
                These goals could not be achieved without strong community
                partnerships, dedicated supervising providers, and collaboration
                with the other six health sciences schools.
              </Typography>
              <br></br>
              <Typography style={{ fontFamily: "Open Sans" }}>
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
                  borderRadius: "10px"
                }}
                src="/communityPartners.jpg"
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
        }}
      >
        <Typography
          gutterBottom
          variant="h4"
          style={{ fontWeight: 700, marginLeft: "2em", textAlign: "center", fontFamily: "Encode Sans", marginBottom: "0", textTransform: "uppercase" }}
        >
          Contact Us
        </Typography>
        <div style={{ textAlign: "center", marginLeft: "30px" }}>
          <HeadlineBar color="purple" width={180} height={10}></HeadlineBar>
        </div>
        <Grid container spacing={6} xs={12} sm={12} style={{ marginTop: "2em", display: "flex", justifyContent: "center"}}>
          <Grid item >
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Grid container direction="row" spacing={4}>
                  <Grid item>
                    <img src="./profile-icon.png" alt="profile icon" />
                  </Grid>
                  <Grid item>
                    <Typography style={{ fontSize: "1.2rem", fontFamily: "Uni Sans Book" }}>
                      Leonora Clarke, Service Learning Manager
                    </Typography>
                    <Typography style={{ fontSize: "1.2rem", fontFamily: "Uni Sans Book"}}>
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
                    <Typography className={classes.contact}>clarkel@uw.edu</Typography>
                  </Grid>
                  <Grid item>
                    <Typography className={classes.contact}>206-685-2009</Typography>
                  </Grid>
                  <Grid item>
                    <Typography className={classes.contact}>
                      Health Sciences Building, Suite A-300
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Grid container direction="row" spacing={4}>
                  <Grid item>
                    <img src="./mail-icon.png" alt="mail icon" />
                  </Grid>
                  <Grid item>
                    <Typography style={{ fontSize: "1.2rem", fontFamily: "Uni Sans Book" }}>
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
                    <Typography className={classes.contact}>1959 NE. Pacific Ave. Suite A-300</Typography>
                  </Grid>
                  <Grid item>
                    <Typography className={classes.contact}>Box 356340</Typography>
                  </Grid>
                  <Grid item>
                    <Typography className={classes.contact}>Seattle, WA 98195</Typography>
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
    backgroundImage: "url(./homeNew-gradient.png)",
    backgroundSize: "auto",
    backgroundPosition: "right center",
    backgroundRepeat: "no-repeat",
    height: "661px",
    position: "relative",
    top: 0,
    right: 0,
    bottom: 0,
    background: "#FFFFFF",
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
  cardhover: {
    "&:hover": {
      opacity: "60%",
      transition: "all .25s ease",
      textDecoration: "underline"
    }
  },
  cardtitle: {
    fontFamily: "Open Sans",
  },
  contact: {
    fontFamily: "Open Sans",
  }
}));

export default App;
