import { NextPage } from "next";
import {
  createStyles,
  CssBaseline,
  Typography,
  withStyles,
  Grid,
} from "@material-ui/core";
import IconBreadcrumbs from "components/breadcrumbs";
import { BorderAllRounded } from "@material-ui/icons";

interface Props {
  classes?: any;
}

const VolunteerProviders : NextPage<Props> = ({ classes }) => {
  return (
    <div className={classes.page} style={{ fontWeight: 1000, paddingBottom: "10em" }}>
      <CssBaseline />
      <IconBreadcrumbs
        crumbs = {["Welcome Providers"]}  parentURL = {undefined}/>
      <Typography
        variant='h4'
        style={{ fontWeight: 1000, paddingBottom: "1em" }}
      >
        Welcome Volunteer Providers!
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={8}>
            <div
                style={{
                marginLeft: "0px",
                marginRight: "82px",
                textAlign: "left",
                marginTop: "1em",
                }}
            >
                <Typography style = {{fontSize: 20, marginTop: "80px"}}>
                    We are delighted that you are interested in working with our students as they serve their communities.
                    Having qualified role models is a key component of our service-learning program at the University of Washington. 
                    Your participation is greatly appreciated and absolutely necessary.
                </Typography>
            </div>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
            <div
                style={{
                marginLeft: "0px",
                marginRight: "146px",
                textAlign: "center",
                marginTop: "1em",
                }}
            >
                <img
                style={{
                    width: "506px",
                    height: "298px",
                    objectFit: "cover",
                    margin: "0px",
                    borderRadius: "10px"
                }}
                src='/volunteerProviders.jpg'
                alt='Volunteer Provider Sample Image'
                />
            </div>
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
          <div
            style={{
              marginLeft: "0px",
              marginRight: "82px",
              textAlign: "left",
              marginTop: "1em",
            }}
          >
            <Typography style = {{fontSize: 20}}>
                <Typography style = {{fontSize: 24, marginTop: "20px", fontWeight: 700, marginBottom: "0.5em"}}>
                    Volunteer Provider Role
                </Typography>
                    As an experienced professional you will model for our students how you think through a problem and how you communicate and collaborate
                    with patients. The students may know some of the science of medicine, but not the art. You have a great deal to add to their education. 
                    Thank you so much for sharing your wisdom and passion for patient care!
                <Typography style = {{fontSize: 24, marginTop: "20px", fontWeight: 700, marginBottom: "0.5em" }}>
                    Interprofessional Approach
                </Typography>
                    Many of our projects are now interdisciplinary! The development of interprofessional teams has the added benefit of helping learners understand
                    the roles of other health professionals and their own place and contribution to a well-functioning health care system.
                <Typography style = {{fontSize: 24, marginTop: "20px", fontWeight: 700, marginBottom: "0.5em" }}>
                    Thank you
                </Typography>
                    Thank you for your interest in our programming. Sometimes we can get so caught up in our studies that we lose track of the reasons why we went into
                    health care to begin with. Service learning can help. It gives us a chance to serve the less fortunate in our communities, identifying their inherent
                    strengths, building on those. Service learning gives trainees real life opportunities to utilize the knowledge gained through course work and both actualize
                    and reflect on our values. Scratch that itch to do something positive in the world!
                <Typography style = {{fontSize: 20, marginTop: "20px", fontWeight: 700, marginBottom: "0.5em" }}>
                    <ul>
                        <li>Onboarding </li>
                        <li>Find Opportunities</li>
                        <li>Calendar</li>
                        <li><a href="https://collaborate.uw.edu/mobile/">Health Sciences Mobile Health Outreach Van</a></li>
                        <li>Training </li>
                        <li>Types of Service</li>
                        <li>Protocols</li>

                    </ul>
                </Typography>
            </Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

const styles = createStyles({
  page: {
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 1500,
    width: "90%",
    paddingTop: "2em",
    paddingBottom: "5em",
  },

  header: {
    fontWeight: 600,
    paddingTop: "1em",
  },
});

export default withStyles(styles)(VolunteerProviders);
