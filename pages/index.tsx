import React, { useEffect } from "react"
import Image from "next/image"
import MobileOutReachSrc from "../public/Mobile_Outreach_Clinic_resized.jpg"
import ServeWithUsSrc from  "../public/serve.jpg"
import CommunityPartnersSrc from "../public/communityPartners.jpg"
import {
  Typography,
  Grid,
  Button,
  CardActionArea,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material"
import withStyles from "@mui/styles/withStyles"
import createStyles from "@mui/styles/createStyles"
import makeStyles from "@mui/styles/makeStyles"
import Link from "next/link"

import { firebaseClient } from "firebaseClient"
import { ArrowForwardIos } from "@mui/icons-material"
import HeadlineBar from "components/headlineBar"

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
    "@media only screen and (max-width: 430px)": {
      height: "500px",
    },
  },
  triangletop: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "50%",
    height: "100%",
    borderTop: "661px solid #FFFFFF95",
    borderRight: "100px solid transparent",
    "@media only screen and (max-width: 430px)": {
      borderTop: "500px solid #FFFFFF95",
      borderRight: "100px solid transparent",
    },
  },
  trianglebottom: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "50%",
    height: 0,
    borderBottom: "661px solid #FFFFFF95",
    borderRight: "100px solid transparent",
    "@media only screen and (max-width: 430px)": {
      borderBottom: "500px solid #FFFFFF95",
    },
  },
  text: {
    display: "flex",
    position: "absolute",
    justifyContent: "center",
    flexDirection: "column",
    height: "100%",
    marginLeft: "4rem",
    "@media only screen and (max-width: 780px)": {
      marginLeft: "1rem",
      marginTop: "-30px",
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
  contactContainer: {
    marginLeft: "4em",
    "@media only screen and (max-width: 480px)": {
      marginLeft: "0",
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
  learnMoreBtn: {
    width: "135px",
    fontFamily: "Encode Sans",
    fontWeight: 800,
    "&:hover": {
      color: "#B7A57A",
      transition: ".25s",
    },
  },
  mobileLearnMoreBtn: {
    "@media only screen and (max-width: 600px)": {
      textAlign: "center",
    },
  },
  img: {
    width: "25em",
    height: "auto",
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
    marginBottom: "0",
    "@media only screen and (max-width: 780px)": {
      fontSize: "6vw",
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
      fontSize: "4vw",
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
      fontSize: "16px",
    },
  },
  mobile: {
    padding: "5em",
    verticalAlign: "middle",
    paddingTop: "1em",
    paddingBottom: "1em",
    "@media only screen and (max-width: 430px)": {
      padding: "3em",
    },
  },
}))

const App: React.FC<{}> = () => {
  const classes = useStyles()

  useEffect(() => {
    firebaseClient.analytics().logEvent("home_page_visit")
  }, [])

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
            <Typography variant="h4" gutterBottom style={{ marginBottom: 0 }}>
              <pre className={classes.topTitle}>
                {"SERVICE LEARNING & \nCOMMUNITY ENGAGEMENT"}
              </pre>
            </Typography>

            <HeadlineBar color="purple" width={590} height={15}></HeadlineBar>

            <Typography variant="h5" gutterBottom>
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
      <div style={{ marginTop: "1em" }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            columnGap: "5%",
          }}
        >
          {/* Students */}
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
                marginTop: "2em",
              }}
            >
              <HeadlineBar color="gold" width={130} height={10}></HeadlineBar>
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
                href="/requiredTraining"
                className={classes.cardhover}
              >
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
          {/* Volunteer Providers */}
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
              Volunteer Providers
            </Typography>

            <div
              style={{
                position: "absolute",
                marginBottom: "0",
                marginTop: "2em",
              }}
            >
              <div style={{ marginRight: "3em", textAlign: "right" }}>
                <HeadlineBar color="gold" width={320} height={10}></HeadlineBar>
              </div>
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
              <Link href="/opportunities/Alaska?type=Providers">
                <CardActionArea
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
              </Link>
            </Card>
          </div>
          {/* Community Partners */}
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
              Community Partners
            </Typography>

            <div
              style={{
                position: "absolute",
                marginBottom: "0",
                marginTop: "2em",
              }}
            >
              <div style={{ marginRight: "2.5em", textAlign: "right" }}>
                <HeadlineBar color="gold" width={310} height={10}></HeadlineBar>
              </div>
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

      {/** Mobile Health Outreach Section*/}
      <div
        className={useStyles().mobile}
        style={{
          backgroundColor: "#E8E3D3",
        }}
      >
        <Grid container spacing="2px">
          <Grid item xs={12} md={6} lg={6}>
            <div
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                width: "90%",
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
                Mobile Health Outreach Clinic (Seattle only)
              </Typography>
              <Typography
                style={{ fontFamily: "Open Sans", marginTop: "1rem" }}
              >
                In Seattle, UW Health Sciences students are partnering with
                Harborview Medical Center (HMC) Downtown programs to provide
                urgent care services to residents of Low Income Housing
                Institute’s Tiny House Villages. Health sciences students will
                work on interprofessional teams to respond to community
                identified health needs while further developing their teamwork
                and clinical skills.
              </Typography>
              <div className={classes.mobileLearnMoreBtn}>
                <Link href="https://collaborate.uw.edu/student-portal/mobile-health-outreach/">
                  <Button
                    color="primary"
                    variant="contained"
                    style={{ marginTop: "1rem", alignItems: "center" }}
                    className={classes.learnMoreBtn}
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <div
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                textAlign: "center",
              }}
            >
              <Image
                style={{
                  width: "30em",
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "10px",
                }}
                //className={useStyles().img}
                src={MobileOutReachSrc}
                priority
                alt="doctor caring for mom with child"
              />
            </div>
          </Grid>
        </Grid>
      </div>

      {/** Serve With Us section*/}
      <div className={useStyles().mobile}>
        <Grid container spacing={10}>
          <Grid item xs={12} md={6} lg={4}>
            <div
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                textAlign: "center",
              }}
            >
              <Image
                style={{
                  width: "30em",
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "10px",
                }}
                src={ServeWithUsSrc}
                placeholder="blur"
                alt="doctor caring for mom with child"
              />
            </div>
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <div
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                width: "90%",
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
              <HeadlineBar color="purple" width={210} height={10}></HeadlineBar>
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
        style={{
          backgroundColor: "#E8E3D3",
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
              <HeadlineBar color="gold" width={130} height={10}></HeadlineBar>
              <Typography style={{ fontFamily: "Open Sans" }}>
                Our Service Learning and Community Engagement programs strive to
                enrich health sciences education by providing our students with
                opportunities to hone their skills while addressing the health
                needs of our under-resourced communities. We seek to foster the
                joy of service in our students who are preparing for lives of
                civic and social responsibility in an increasingly diverse and
                complex global society.These goals could not be achieved without
                strong community partnerships, dedicated supervising providers,
                and mutual collaboration within our six health sciences schools.
              </Typography>
              <br></br>
              <br></br>
              <Typography style={{ fontFamily: "Open Sans" }}>
                Please take a moment to glance through the amazing clinical and
                mentoring projects that have been developed by our students over
                the past ten years.
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
              <Image
                className={useStyles().img}
                src={CommunityPartnersSrc}
                alt="Two students smiling"
              />
            </div>
          </Grid>
        </Grid>
      </div>

      {/** Contact section*/}
      <div className={useStyles().mobile}>
        <div style={{ textAlign: "center", alignItems: "center" }}>
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
          <div style={{ textAlign: "center" }}>
            <HeadlineBar color="purple" width={130} height={10}></HeadlineBar>
          </div>
        </div>
        <Grid
          container
          spacing={6}
          xs={12}
          sm={12}
          style={{
            marginTop: "0.5em",
            marginBottom: "0.5em",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Grid item>
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <Grid container direction="row" spacing={1}>
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
                      Service Learning Team
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
                      <a href="mailto://somserve@uw.edu">somserve@uw.edu</a>
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
            <Grid container direction="column" spacing={2}>
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
  )
}

export default App
