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

const StandardsOfCarePage: NextPage<Props> = ({ classes }) => {
  return (
    <div className={classes.page}>
      <CssBaseline />
      <IconBreadcrumbs
        crumbs={["Required Training", "Standards of Care: Expectations and Goals"]}
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
        Standards of Care: Expectations and Goals
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
              Service learning offers students the opportunity to improve their facility
              in working with historically vulnerable and stigmatized communities. As such,
              it is important to make yourself aware of the following for each category of
              service:
            </Typography>
            <div style={{ paddingLeft: "20px" }}>
              <Typography style={{ fontSize: 16, fontFamily: "Open sans" }}>
                Clinical
              </Typography>
              <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                <li>
                  Learn how environmental, institutional, political, and economic factors
                  create barriers to better health.
                </li>
                <li>
                  Understand the significance of rooting service in ongoing assessments
                  of community-identified needs.
                </li>
                <li>
                  Recognize that impact may not always be obvious or immediate. It
                  takes time and patience to develop trust with communities that have
                  experienced historical trauma. Consider this work an opportunity to
                  increase clinical and cultural humility.
                </li>
                <li>
                  Remember that the main goal is to get patients connected with
                  sustained, clinic-based care.
                </li>
                <li>
                  Appreciate the richness and strengths of the communities that you
                  work with.
                </li>
              </ul>
              {/* ... Continue with Mentorship/Outreach and Advocacy sections */}
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

export default withStyles(styles)(StandardsOfCarePage);
