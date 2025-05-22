import { NextPage } from "next";
import { CssBaseline, Typography, Grid, Link } from "@mui/material";
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import IconBreadcrumbs from "components/breadcrumbs";
import HeadlineBar from "components/headlineBar";

interface Props {
  classes?: any;
}

const StandardsOfCarePage: NextPage<Props> = ({ classes }) => {
  return (
    <div className={classes.page}>
      <CssBaseline />
      <IconBreadcrumbs
        crumbs={["Onboarding", "Standards of Care: Expectations and Goals"]}
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
        Expectations and Goals
      </Typography>
      <HeadlineBar color="gold" width={355} height={10} marginBottom={20}/>
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
              Service learning offers students the opportunity to improve their facility
              in working with historically vulnerable and stigmatized communities. As such,
              it is important to make yourself aware of the following for each category of
              service:
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
                Clinical
              </Typography>
              <ul style={{ listStyleType: "disc" }}>
                <li>
                  Learn how environmental, institutional, political, and economic factors
                  create barriers to better health.
                </li>
                <li>
                  Understand the significance of grounding service in ongoing assessments
                  of community-identified needs.
                </li>
                <li>
                  Recognize that impact may not always be obvious or immediate. It
                  takes time and patience to develop trust with communities that have
                  experienced historical trauma. Consider this work an opportunity to
                  increase clinical and cultural humility.
                </li>
                <li>
                Remember that the main goal of clinical service learning is to connect 
                patients with sustainable, high-quality care.
                </li>
                <li>
                  Appreciate the richness and strengths of partner communities.
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
                Mentorship/Outreach
              </Typography>
              <ul style={{ listStyleType: "disc" }}>
                <li>
                  Expand your understanding of the many systemic barriers that 
                  underrepresented students must overcome to achieve their health 
                  professional goals. 
                </li>
                <li>
                  Develop teaching and communication skills by sharing your expertise 
                  in interviewing, networking, and navigating application processes.
                </li>
                <li>
                  Provide inspiration and role-modeling to young people who might not 
                  have other connections to the health professional world.
                </li>
                <li>
                Gain experience in career-long mentorship skills considerate
                 of ethics of working with minors, boundary setting and reciprocity.
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
                Advocacy
              </Typography>
              <ul style={{ listStyleType: "disc" }}>
                <li>
                  Learn to address social determinants of health on a large scale through
                  political, social, or institutional interventions.
                </li>
                <li>
                  Appreciate the impact that physicians in training can have on systems 
                  changes.
                </li>
                <li>
                  Understand that the validity of perspectives is solidified by personal 
                  experiences and background.
                </li>
                <li>
                  Learn to identify people who are falling through the cracks and to think
                  upstream to improve outcomes.
                </li>
              </ul>
              <Typography style={{ fontSize: 16, fontFamily: "Open sans" }}>
                Remember that early exposure to service work will help shape your 
                professional identity and increase the likelihood that you will continue to do 
                community service work as a licensed provider!
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

export default withStyles(styles)(StandardsOfCarePage);
