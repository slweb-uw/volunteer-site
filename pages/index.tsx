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
          <div className={classes.text}>
            <Typography 
            variant="h4" 
            gutterBottom
            >
              <pre className={classes.topTitle}>
                {"SERVICE LEARNING & \nCOMMUNITY ENGAGEMENT"

                }
              </pre>
            </Typography>

            <HeadlineBar color="purple" width={680} height={20}></HeadlineBar>

            <Typography
              variant="h5"
              gutterBottom
            >
              <pre className={classes.bottomTitle}>
                {"UW School of Medicine/WWAMI\nUW Health Sciences"}
              </pre>
            </Typography>

            <Typography
              variant="subtitle1"
              gutterBottom
              className={classes.description}
            >
              Our program supports 50+ student led service projects throughout
              the region.
            </Typography>
            <Link href="/opportunities">
              <Button
                color="primary"
                variant="contained"
                className={classes.findOppBtn}
              >
                Find Opportunities
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/** Cards */}
      <div style={{ textAlign: "center", marginTop: "2em" }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            columnGap: "5%",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                fontFamily: "Encode Sans",
                textTransform: "uppercase",
              }}
            >
              Students
            </Typography>

            <div
              style={{
                position: "absolute",
                marginBottom: "0",
                marginTop: "32px",
                marginRight: "12px",
              }}
            >
              <HeadlineBar color="gold" width={120} height={10}></HeadlineBar>
            </div>

            <Card
              variant="outlined"
              style={{ borderRadius: 10, margin: "1em", height: "auto" }}
            >
              <CardMedia
                component="img"
                src="./studentVolunteers.png"
                style={{ height: "200px", width: "301px" }}
                alt="Student volunteers"
              ></CardMedia>
              <CardActionArea
                href="/welcome/studentVolunteers"
                className={classes.cardhover}
              >
                <CardContent>
                  <div className={classes.cardlinks}>
                    <Typography className={classes.cardtitle}>
                      Welcome
                    </Typography>
                    <Typography>
                      <ArrowForwardIos
                        style={{ fontSize: "1em", color: "#4B2E83" }}
                      />
                    </Typography>
                  </div>
                </CardContent>
              </CardActionArea>
              <hr
                style={{
                  border: ".2px solid #E5E5E5",
                  width: "100%",
                  margin: "0",
                }}
              ></hr>
              <CardActionArea
                href="/opportunities"
                style={{ backgroundColor: "#4B2E83", color: "#ffffff" }}
                className={classes.cardhover}
              >
                <CardContent>
                  <div className={classes.cardlinks}>
                    <Typography
                      className={classes.cardtitle}
                      style={{ color: "#ffffff" }}
                    >
                      Find Opportunities
                    </Typography>
                    <Typography>
                      <ArrowForwardIos
                        style={{ fontSize: "1em", color: "#ffffff" }}
                      />
                    </Typography>
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
            <Typography
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                fontFamily: "Encode Sans",
                textTransform: "uppercase",
              }}
            >
              Volunteer Providers
            </Typography>

            <div
              style={{
                position: "absolute",
                marginBottom: "0",
                marginTop: "32px",
                marginRight: "20px",
              }}
            >
              <HeadlineBar color="gold" width={280} height={10}></HeadlineBar>
            </div>

            <Card
              variant="outlined"
              style={{ borderRadius: 10, margin: "1em" }}
            >
              <CardMedia
                component="img"
                src="./volunteerProviders.jpg"
                style={{ height: "200px", width: "301px", objectFit: "cover" }}
                alt="University District Street Medicine volunteers"
              ></CardMedia>
              <CardActionArea
                href="/welcome/volunteerProviders"
                className={classes.cardhover}
              >
                <CardContent>
                  <div className={classes.cardlinks}>
                    <Typography className={classes.cardtitle}>
                      Welcome
                    </Typography>
                    <Typography>
                      <ArrowForwardIos
                        style={{ fontSize: "1em", color: "#4B2E83" }}
                      />
                    </Typography>
                  </div>
                </CardContent>
              </CardActionArea>
              <hr
                style={{
                  border: ".2px solid #E5E5E5",
                  width: "100%",
                  margin: "0",
                }}
              ></hr>
              <CardActionArea href="/onboarding" className={classes.cardhover}>
                <CardContent>
                  <div className={classes.cardlinks}>
                    <Typography className={classes.cardtitle}>
                      Onboarding
                    </Typography>
                    <Typography>
                      <ArrowForwardIos
                        style={{ fontSize: "1em", color: "#4B2E83" }}
                      />
                    </Typography>
                  </div>
                </CardContent>
              </CardActionArea>
              <hr
                style={{
                  border: ".2px solid #E5E5E5",
                  width: "100%",
                  margin: "0",
                }}
              ></hr>
              <CardActionArea
                href="/opportunities"
                style={{ backgroundColor: "#4B2E83", color: "#ffffff" }}
                className={classes.cardhover}
              >
                <CardContent>
                  <div className={classes.cardlinks}>
                    <Typography
                      className={classes.cardtitle}
                      style={{ color: "#ffffff" }}
                    >
                      Find Opportunities
                    </Typography>
                    <Typography>
                      <ArrowForwardIos
                        style={{ fontSize: "1em", color: "#ffffff" }}
                      />
                    </Typography>
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
            <Typography
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                fontFamily: "Encode Sans",
                textTransform: "uppercase",
              }}
            >
              Community Partners
            </Typography>

            <div
              style={{
                position: "absolute",
                marginBottom: "0",
                marginTop: "32px",
                marginRight: "18px",
              }}
            >
              <HeadlineBar color="gold" width={275} height={10}></HeadlineBar>
            </div>

            <Card
              variant="outlined"
              style={{ borderRadius: 10, margin: "1em" }}
            >
              <CardMedia
                component="img"
                src="./home3.png"
                style={{ height: "200px", width: "301px" }}
                alt="Two hands shaking"
              ></CardMedia>
              <hr
                style={{
                  border: ".2px solid #E5E5E5",
                  width: "100%",
                  margin: "0",
                }}
              ></hr>
              <CardActionArea
                href="/welcome/communitypartners"
                className={classes.cardhover}
              >
                <CardContent>
                  <div className={classes.cardlinks}>
                    <Typography className={classes.cardtitle}>
                      Become a Partner
                    </Typography>
                    <Typography>
                      <ArrowForwardIos
                        style={{ fontSize: "1em", color: "#4B2E83" }}
                      />
                    </Typography>
                  </div>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>
        </div>
      </div>

      {/** Serve With Us section*/}
      <div
        className={useStyles().mobile}
        style={{
          backgroundColor: "#E8E3D3",
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
                className={useStyles().img}
                src="/serve.jpg"
                alt="doctor caring for mom with child"
              />
            </div>
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <div
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                width:"90%",
              }}
            >
              <Typography
                gutterBottom
                variant="h4"
                style={{
                  fontWeight: 700,
                  paddingBottom: "0",
                  marginBottom: "0",
                  fontFamily: "Encode Sans",
                  fontSize: "1.7rem",
                  textTransform: "uppercase",
                }}
              >
                Serve With Us
              </Typography>
              <HeadlineBar color="purple" width={250} height={10}></HeadlineBar>
              <Typography style={{ fontFamily: "Open Sans" }}>
                Volunteering with our programs is a wonderful way to practice
                your skills, make a difference in our community and form
                meaningful connections. We invite you to explore our
                opportunities for providers and students alike. We are very
                flexible and try to make it easy to work around busy schedules.
                There is no required hourly commitment. Simply sign up when you
                have the time!
              </Typography>
            </div>
          </Grid>
        </Grid>
      </div>

      {/** About Us section*/}
      <div
        className={useStyles().mobile}
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
                style={{
                  fontWeight: 700,
                  paddingBottom: "0",
                  marginBottom: "0",
                  fontFamily: "Encode Sans",
                  fontSize: "1.7rem",
                  textTransform: "uppercase",
                }}
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
                className={useStyles().img}
                src="/communityPartners.jpg"
                alt="Two students smiling"
              />
            </div>
          </Grid>
        </Grid>
      </div>

      {/** Contact section*/}
      <div
        className={useStyles().mobile}
        style={{
          backgroundColor: "#E8E3D3",
        }}
      >
        <div style={{ textAlign: "center"}}>
          <Typography
            gutterBottom
            variant="h4"
            style={{
              fontWeight: 700,
              fontFamily: "Encode Sans",
              fontSize: "1.7rem",
              marginBottom: "0",
              textTransform: "uppercase",
            }}
          >
            Contact
          </Typography>
        
          <HeadlineBar color="purple" width={150} height={10}></HeadlineBar>
        </div>
        <Grid
          container
          spacing={6}
          xs={12}
          sm={12}
          style={{
            marginTop: "2em",
            display: "flex",
            justifyContent: "center",
            alignContent: "center"
          }}
        >
          <Grid item>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Grid container direction="row" spacing={2}>
                  <Grid item>
                    <img src="./profile-icon.png" alt="profile icon" />
                  </Grid>
                  <Grid item>
                    <Typography
                      style={{
                        fontSize: "1.2rem",
                        fontFamily: "Uni Sans Book",
                      }}
                    >
                      Leonora Clarke, Service Learning Manager
                    </Typography>
                    <Typography
                      style={{
                        fontSize: "1.2rem",
                        fontFamily: "Uni Sans Book",
                      }}
                    >
                      UW School of Medicine
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid
                  container
                  direction="column"
                  className={classes.contactContainer}
                >
                  <Grid item>
                    <Typography className={classes.contact}>
                      <a href="mailto://clarkel@uw.edu">clarkel@uw.edu</a>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography className={classes.contact}>
                      206-685-2009
                    </Typography>
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
                <Grid container direction="row" spacing={2}>
                  <Grid item>
                    <img src="./mail-icon.png" alt="mail icon" />
                  </Grid>
                  <Grid item>
                    <Typography
                      style={{
                        fontSize: "1.2rem",
                        fontFamily: "Uni Sans Book",
                      }}
                    >
                      Mailing Address
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid
                  container
                  direction="column"
                  className={classes.contactContainer}
                >
                  <Grid item>
                    <Typography className={classes.contact}>
                      1959 NE. Pacific Ave. Suite A-300
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography className={classes.contact}>
                      Box 356340
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography className={classes.contact}>
                      Seattle, WA 98195
                    </Typography>
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
    margin: "10px",
    marginLeft: "4rem",
    "@media only screen and (max-width: 780px)": {
      marginLeft: "1rem",
    },
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
      textDecoration: "underline",
    },
  },
  cardtitle: {
    fontFamily: "Open Sans",
  },
  contact: {
    fontFamily: "Open Sans",
  },
  contactContainer:{
    marginLeft: "4em",
    "@media only screen and (max-width: 480px)": {
      marginLeft: "0" 
    },
  },
  findOppBtn: {
    width: "220px",
    fontFamily: "Encode Sans",
    fontWeight: 800,
    "&:hover": {
      color: "#B7A57A",
      transition: ".25s",
    },
  },
  img: {
    width: "25em",
    borderRadius: "10px",
    "@media only screen and (max-width: 600px)": {
      display: "block",
      width: "100%",
    },
  },
  topTitle: {
    fontSize: "2.5rem",
    color: "black",
    fontFamily: "Encode Sans",
    fontWeight: 800,
    textTransform: "uppercase",
    marginBottom: "2px",
    "@media only screen and (max-width: 780px)": {
      fontSize: "5vw",
    },
  },
  bottomTitle: {
    fontSize: "2rem",
    color: "black",
    fontWeight: 800,
    marginTop: "0",
    marginBottom: "0",
    fontFamily: "Encode Sans Compressed, sans-serif",
    "@media only screen and (max-width: 780px)": {
      fontSize: "3.5vw",
    },
  },
  description: {
      display: "inline flex",
      fontSize: "1rem",
      maxWidth: "70%",
      overflow: "auto",
      fontFamily: "Open Sans",
      marginBottom: "15px",
      "@media only screen and (max-width: 430px)": {
        fontSize: "3vw",
        width: "35%"
      },
  },
  mobile: {
    padding: "5em",
    verticalAlign: "middle",
    paddingTop: "2em",
    "@media only screen and (max-width: 430px)": {
      padding: "3em",
    },
  }
}));

export default App;
