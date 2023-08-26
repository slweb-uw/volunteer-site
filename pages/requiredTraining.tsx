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

const RequiredTraining: NextPage<Props> = ({ classes }) => {
  return (
    <div className={classes.page}>
      <CssBaseline />
      <IconBreadcrumbs
        crumbs={["Required Training"]}
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
        REQUIRED TRAINING
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
              Ensuring that our student and provider volunteers are properly trained is
              central to the mission of our program. Please check out the following links
              prior to participation in outreach events:
            </Typography>
            <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
              <li>
                <Typography style={{ fontSize: 16, fontFamily: "Open sans" }}>
                    <a href="/foundationsOfServiceLearning" className={classes.link}>
                        Foundations of Service Learning: Preparation and Reflection (required
                        to review)
                  </a>
                </Typography>
              </li>
              <li>
                <Typography style={{ fontSize: 16, fontFamily: "Open sans" }}>
                    <a href="/standardOfCare" className={classes.link}>
                        Standard of Care: Expectations and Goals (required to review)
                    </a>
                </Typography>
              </li>
              <li>
                <Typography style={{ fontSize: 16, fontFamily: "Open sans" }}>
                    <a
                     href="https://canvas.uw.edu/courses/1693188/pages/training-modules?module_item_id=18595279"
                     target="_blank" // Opens link in a new tab
                     rel="noopener noreferrer" // Recommended for security
                    >
                        Online skills training modules (see individual projects for details)
                    </a>
                </Typography>
              </li>
            </ul>
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

export default withStyles(styles)(RequiredTraining);
