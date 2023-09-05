import { NextPage } from "next";
import {
  createStyles,
  CssBaseline,
  Typography,
  withStyles,
  Grid,
  Link,
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
          color: "#4b2e83",
        }}
      >
        REQUIRED TRAINING
      </Typography>
      <img
        src={"../goldbar.png"}
        style={{ width: "350px", height: "10px", marginBottom: "30px" }}
      />
      <Grid container spacing={2}>
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
              Ensuring that our student and provider volunteers are properly trained is
              central to the mission of our program. Please check out the following links
              prior to participation in outreach events:
            </Typography>
            <div style={{ listStyleType: "none", paddingTop: "20px" }}>
              <li>
                <Typography
                  variant="h6"
                  style={{
                    fontSize: 20,
                    fontFamily: "Encode Sans",
                    color: "#4b2e83",
                    fontWeight: 400, // Make it bold
                  }}
                >
                  <Link
                    href="/foundationsOfServiceLearning"
                    className={classes.link}
                    color="inherit"
                  >
                    Foundations of Service Learning: Preparation and Reflection (required to review)
                  </Link>
                </Typography>
              </li>
              <li>
                <Typography
                  variant="h6"
                  style={{
                    fontSize: 20,
                    fontFamily: "Encode Sans",
                    color: "#4b2e83",
                    fontWeight: 400, // Make it bold
                  }}
                >
                  <Link
                    href="/standardOfCare"
                    className={classes.link}
                    color="inherit"
                  >
                    Standard of Care: Expectations and Goals (required to review)
                  </Link>
                </Typography>
              </li>
              <li>
                <Typography
                  variant="h6"
                  style={{
                    fontSize: 20,
                    fontFamily: "Encode Sans",
                    color: "#4b2e83",
                    fontWeight: 400, // Make it bold
                  }}
                >
                  <Link
                    href="https://canvas.uw.edu/courses/1693188/pages/training-modules?module_item_id=18595279"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.link}
                  >
                    Online skills training modules (see individual projects for details)
                  </Link>
                </Typography>
              </li>
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

export default withStyles(styles)(RequiredTraining);
