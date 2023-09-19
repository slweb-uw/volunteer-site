import { NextPage } from "next";
import {
  createStyles,
  CssBaseline,
  Typography,
  withStyles,
  Grid,
} from "@material-ui/core";
import IconBreadcrumbs from "components/breadcrumbs";

interface Props {
  classes?: any;
}

const ServiceLearningPage: NextPage<Props> = ({ classes }) => {
  return (
    <div className={classes.page}>
      <CssBaseline />
      <IconBreadcrumbs
        crumbs={["Required Training", "Foundations of Service Learning"]}
        parentURL={undefined}
      />
      <Typography
        variant="h4"
        style={{
          fontFamily: "Encode Sans",
          fontWeight: 800,
          fontSize: "2rem",
          color: "#000000",
        }}
      >
        Preparation and Reflection
      </Typography>
      <img
        src={"../goldbar.png"}
        style={{ width: "550px", height: "10px", marginBottom: "30px" }}
      />
      <Grid container spacing={1}>
        <Grid item xs={12} md={6} lg={8}>
          <div
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              textAlign: "left",
              marginTop: "0em",
              width: "100%",
            }}
          >
            <Typography style={{ fontSize: 16, fontFamily: "Open Sans" }}>
              At each service learning event, it is important to strengthen your learning
              by taking the time to prepare and reflect.
            </Typography>
            <div style={{ paddingTop: "20px" }}>
              <Typography
                variant="h6"
                style={{
                  fontSize: 24,
                  fontFamily: "Encode Sans",
                  color: "#4b2e83",
                  fontWeight: 600, // Make it bold
                }}
              >
                Preparation
              </Typography>
              <ul style={{ listStyleType: "disc" }}>
                <li>
                Actively consider the community that you will be entering in preparation 
                for each event. This may include historical healthcare interactions, 
                knowledge of current interventions, familiarity with cultural considerations 
                for the community, etc. 
                </li>
                <li>
                Understand your roles and responsibilities as well as the scope of care that will 
                be provided at the event. Ensure that you have completed the proper training (modules/skills sessions). 
                </li>
                <li>
                Discuss safety/de-escalation plan with your team that addresses potential harm
                 to both volunteers and community members. 
                </li>
              </ul>
              <Typography
                variant="h6"
                style={{
                  fontSize: 24,
                  fontFamily: "Encode Sans",
                  color: "#4b2e83",
                  fontWeight: 600, // Make it bold
                }}
              >
                Reflection
              </Typography>
              <div>
                <Typography
                  variant="h6"
                  style={{
                  fontSize: 19,
                  fontFamily: "Encode Sans",
                  }}
               >
                  Consider the following with your team:
                </Typography>
              </div>
              <ul style={{ listStyleType: "disc" }}>
                <li>Ethical considerations</li>
                <li>Quality improvement</li>
                <li>Safety for volunteers and community members</li>
                <li>Personal impact and professional identity development</li>
                <li>Reflections on the impacts of social determinants of health</li>
                <li>Identification of opportunities for advocacy that recognize gaps in care, duplication of effort, and ???</li>
              </ul>
              <Typography style={{ fontSize: 16, fontFamily: "Open Sans" }}>
              Successful participation in Service Learning while in medical school 
              will require a balancing act as you learn to navigate personal, clinical, 
              and academic responsibilities.  However, learning to integrate service 
              into your life as a medical student will teach you the skills that you 
              will need to incorporate this meaningful work into your future practice. 
              </Typography>
            </div>
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
});

export default withStyles(styles)(ServiceLearningPage);
