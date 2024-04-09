import { NextPage } from "next";
import {
  createStyles,
  CssBaseline,
  Typography,
  Select,
  MenuItem,
  withStyles,
  Grid,
  Button,
} from "@material-ui/core";
import IconBreadcrumbs from "../components/breadcrumbs";

interface Props {
  classes?: any;
}

const Protocols: NextPage<Props> = ({ classes }) => {
  return (
    <div className={classes.page}>
      <CssBaseline />
      <IconBreadcrumbs
        crumbs = {["Protocols"]} />
      <Typography
        variant='h4'
        style={{ fontWeight: 600, paddingBottom: "1em" }}
      >
        Protocols
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6} lg={8}>
          <div
            style={{
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Typography style={{ fontWeight: 600 }}>
              COVID-19: For information see Service Learning COVID Guidelines{" "}
              <a href='https://education.uwmedicine.org/covid-19-service-learning/'>
                here.
              </a>
            </Typography>

            <Typography variant='h6' className={classes.header}>
              Urgent Care
            </Typography>
            <Typography>
              For life-threatening illness or injury, call 911 or go to your
              nearest emergency room location.
            </Typography>
            <Typography variant='h6' className={classes.header}>
              <a href='https://drive.google.com/file/d/19YXIakAij0IOf0yyEiP4ZjNPFJr-CLUc/view?usp=sharing'>
                UWSOM Bloodborne Pathogen Protocol
              </a>
            </Typography>

            <Typography variant='h6' className={classes.header}>
              <a href='https://catalyst.uw.edu/webq/survey/clarkel/408070'>
                Incident Report Form
              </a>
            </Typography>

            <Typography variant='h6' className={classes.header}>
              <a href='https://docs.google.com/document/d/1mYrFFx-jlq9FdnKvKAvh3cx2XIeKSAVLfgnrOLi04E0/edit?usp=sharing'>
                Supervision Guidelines
              </a>
            </Typography>

            <Typography
              variant='h6'
              className={classes.header}
              style={{ marginTop: "1em" }}
            >
              Standards of Practice
            </Typography>

            <Typography variant='h6' className={classes.header}>
              <a href='https://drive.google.com/file/d/1ArIy-cOJ2d3keqkjyUxP-IBE3Y1D4q3z/view?usp=sharing'>
                Footcare Manual (CHAP)
              </a>
            </Typography>

            <Typography variant='h6' className={classes.header}>
              <a href='https://drive.google.com/file/d/1W5g2tey9tPEMCyc5VMb-AsW3ITCqnWSz/view?usp=sharing'>
                General Clinical Protocols (SHIFA)
              </a>
            </Typography>

            <Typography variant='h6' className={classes.header}>
              <a href='https://drive.google.com/file/d/1ZTbz-diYHWxnEpEhEu57fLeCykdBD6UW/view?usp=sharing'>
                Blood Glucose Guide (SHIFA)
              </a>
            </Typography>

            <Typography variant='h6' className={classes.header}>
              <a href='http://servicelearning.washington.edu/resources'>
                Blood Glucose Testing Protocol (SHIFA)
              </a>
            </Typography>

            <Typography variant='h6' className={classes.header}>
              <a href='https://drive.google.com/file/d/1__J_8Kc7P2Ll0WcVlJoFUECZ7lzDTFAp/view?usp=sharing'>
                Blood Pressure Volunteer Information (SHIFA)
              </a>
            </Typography>

            <Typography variant='h6' className={classes.header}>
              <a href='https://drive.google.com/file/d/19mAxA_9UNJ8whBkpRXdHlk26SmM3hnDU/view?usp=sharing'>
                Screen and Refer information for preceptors (SHIFA)
              </a>
            </Typography>

            <Typography variant='h6' className={classes.header}>
              <a href='https://drive.google.com/drive/folders/1g0S7HfB5-mOYXNh0Ph4gtJYbQ4t6--Nx?usp=sharing'>
                Diabetes Protocol (UGM)
              </a>
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
            <img
              style={{
                width: "25rem",
              }}
              src='/protocols.jpeg'
              alt='a masked vaccine volunteer holding a green sign'
            />
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

export default withStyles(styles)(Protocols);
