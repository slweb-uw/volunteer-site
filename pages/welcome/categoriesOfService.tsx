import { NextPage } from "next";
import {
  createStyles,
  CssBaseline,
  Typography,
  withStyles,
  Grid,
} from "@material-ui/core";
import IconBreadcrumbs from "components/breadcrumbs";
import HeadlineBar from "components/headlineBar";

interface Props {
  classes?: any;
}

const CategoriesOfService: NextPage<Props> = ({ classes }) => {
  return (
    <div className={classes.page} style={{ fontWeight: 1000, paddingBottom: "10em" }}>
      <CssBaseline />
      <IconBreadcrumbs
        crumbs = {["Welcome", "Categories of Service"]}  parentURL = {"/welcome/studentVolunteers"}/>
      <Typography
        variant='h4'
        style={{ fontWeight: 1000, fontFamily: "Encode Sans" }}
      >
        Categories of Service
      </Typography>

      <img src="../purplebar.png" style={{ width: "345px", height: "10px", marginBottom: "5px" }}/>

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
            <Typography style = {{fontSize: 18, fontFamily: "Open Sans"}}>
                Our service-learning projects build off community strengths and address community identified needs. We tend
                to think of our service-learning projects as falling into one of three categories.
                <Typography style = {{fontSize: 24, marginTop: "20px", fontFamily: "Uni Sans Book", fontWeight: 700, marginBottom: "0.5em"}}>
                    Clinical
                </Typography>
                    The role of volunteer providers in our clinical projects is to supervise the healthcare that our students provide.
                    This care may range from screening for health conditions with subsequent facilitated referrals for definitive care, to
                    actually seeing patients for medical problems and diagnosing and providing treatment for those problems. The care provided
                    should not be outside the scope of your individual practice.
                <Typography style = {{fontSize: 24, marginTop: "20px", fontFamily: "Uni Sans Book", fontWeight: 700, marginBottom: "0.5em" }}>
                    Health Education
                </Typography>
                    At these events, students work under your supervision to pass on their burgeoning knowledge of health and health care to community
                    groups. Your role in these projects is often to vet educational materials for accuracy and to be certain they are presented at an
                    appropriate health literacy level.
                <Typography style = {{fontSize: 24, marginTop: "20px", fontFamily: "Uni Sans Book", fontWeight: 700, marginBottom: "0.5em" }}>
                    Mentorship
                </Typography>
                    These projects form connections between our students and their younger underrepresented peers with the goal of enabling those students
                    imagine themselves as future health professionals. A major role of volunteer providers in these projects is to help our students maintain
                    appropriate boundaries with the younger students and to facilitate reflective activities on a regular basis
                <Typography style = {{fontSize: 24, marginTop: "20px", fontFamily: "Uni Sans Book", fontWeight: 700, marginBottom: "0.5em" }}>
                    Advocacy
                </Typography>
                    Enter Advocacy information here.
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
    fontFamily: "Open Sans",
  },

  header: {
    fontWeight: 600,
    paddingTop: "1em",
  },
});

export default withStyles(styles)(CategoriesOfService);
