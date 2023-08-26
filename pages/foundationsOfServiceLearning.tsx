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
        }}
      >
        Foundations of Service Learning
      </Typography>
      <img
        src={"../goldbar.png"}
        style={{ width: "550px", height: "10px", marginBottom: "30px" }}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={8}>
          <div
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              textAlign: "left",
              marginTop: "1em",
              width: "100%",
            }}
          >
            <Typography style={{ fontSize: 16, fontFamily: "Open sans" }}>
              The need to prepare for and reflect on service learning experiences is
              a key value that we hope to instill in health professions learners. At
              each service learning event, it is important to strengthen your learning
              by taking the time to consider the following:
            </Typography>
            <div style={{ paddingLeft: "20px" }}>
              <Typography style={{ fontSize: 16, fontFamily: "Open sans" }}>
                Preparation
              </Typography>
              <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                <li>
                  Understand the centering of community-identified needs in the context
                  of the upcoming event. This may include research into historical
                  healthcare interactions, knowledge of current interventions,
                  familiarity with cultural considerations for the community, etc.
                </li>
                <li>
                  Understand the scope of care/service that you will be providing and
                  ensure that you have completed the proper training prior to the event.
                </li>
                <li>
                  Create a safety/de-escalation plan with your team that addresses
                  potential harm to both volunteers and community members.
                </li>
              </ul>
              <Typography style={{ fontSize: 16, fontFamily: "Open sans" }}>
                Reflection
              </Typography>
              <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                <li>Ethical considerations</li>
                <li>Quality improvement</li>
                <li>Safety for volunteers and community members</li>
                <li>Personal impact and professional identity development</li>
                <li>Reflections on the impacts of social determinants of health</li>
                <li>Identification of opportunities for advocacy that recognize gaps in care, duplication of effort, and ???</li>
              </ul>
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
