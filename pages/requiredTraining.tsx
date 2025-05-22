import { NextPage } from "next";
import { CssBaseline, Typography, Grid, Link } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import IconBreadcrumbs from "components/breadcrumbs";
import HeadlineBar from "components/headlineBar";

interface Props {
  classes?: any;
}

const RequiredTraining: NextPage<Props> = ({ classes }) => {
  return (
    <div className={classes.page}>
      <CssBaseline />
      <IconBreadcrumbs crumbs={["Onboarding"]} parentURL={undefined} />
      <Typography
        variant="h4"
        style={{
          fontFamily: "Encode Sans",
          fontWeight: 800,
          fontSize: "2rem",
          color: "#000000",
        }}
      >
        ONBOARDING
      </Typography>
      <HeadlineBar color="gold" width={205} height={10} marginBottom={30}/>
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
              Ensuring that our student volunteers are appropriately trained is
              central to the mission of our program. Prior to participation in
              service learning events, please review the materials below.
            </Typography>
              <ul style={{ listStyleType: "none", padding: "0px", paddingTop: "20px", margin: "0px" }}>
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
                      Expectations and Goals (required to review)
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
                      href="/foundationsOfServiceLearning"
                      className={classes.link}
                      color="inherit"
                    >
                      Preparation and Reflection (required to review)
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
                      color="inherit"
                    >
                      Skills Training Modules (see individual projects for site
                      specific requirements)
                    </Link>
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
