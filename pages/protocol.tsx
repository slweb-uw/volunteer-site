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

interface Props {
  classes?: any;
}

const Protocols: NextPage<Props> = ({ classes }) => {
  return (
    <div className={classes.page}>
      <CssBaseline />
      <Typography variant="h4" style={{ fontWeight: 600, paddingBottom: "1em" }}>
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
                COVID-19 Update: For information see Service Learning COVID Guidelines <a>here.</a>
            </Typography>

            <Typography variant="h6" className={classes.header}>Urgent Care</Typography>
            <Typography>For life-threatening illness or injury, call 911 or go to your nearest emergency room location.</Typography>

            <Typography variant="h6" className={classes.header}>UWSOM Bloodborne Pathogen Protocol (LINK)</Typography>
            <a href="https://drive.google.com/file/d/19YXIakAij0IOf0yyEiP4ZjNPFJr-CLUc/view?usp=sharing">https://drive.google.com/file/d/19YXIakAij0IOf0yyEiP4ZjNPFJr-CLUc/view?usp=sharing</a>

            <Typography variant="h6" className={classes.header}>Incident Report Form (LINK)</Typography>
            <a href="https://catalyst.uw.edu/webq/survey/clarkel/408070">https://catalyst.uw.edu/webq/survey/clarkel/408070</a>

            <Typography variant="h6" className={classes.header}>Supervision Guidelines (LINK)</Typography>
            <a href="https://docs.google.com/document/d/1mYrFFx-jlq9FdnKvKAvh3cx2XIeKSAVLfgnrOLi04E0/edit?usp=sharing">https://docs.google.com/document/d/1mYrFFx-jlq9FdnKvKAvh3cx2XIeKSAVLfgnrOLi04E0/edit?usp=sharing</a>

            <Typography variant="h6" className={classes.header}>Standards of Practice</Typography>

            <Typography  className={classes.header}>Footcare Manual (CHAP):</Typography>
            <a href="https://drive.google.com/file/d/1ArIy-cOJ2d3keqkjyUxP-IBE3Y1D4q3z/view?usp=sharing">https://drive.google.com/file/d/1ArIy-cOJ2d3keqkjyUxP-IBE3Y1D4q3z/view?usp=sharing</a>

            <Typography  className={classes.header}>General Clinical Protocols  (SHIFA)</Typography>
            <a href="https://drive.google.com/file/d/1W5g2tey9tPEMCyc5VMb-AsW3ITCqnWSz/view?usp=sharing">https://drive.google.com/file/d/1W5g2tey9tPEMCyc5VMb-AsW3ITCqnWSz/view?usp=sharing</a>

            <Typography  className={classes.header}>Blood Glucose Guide (SHIFA)</Typography>
            <a href="https://drive.google.com/file/d/1ZTbz-diYHWxnEpEhEu57fLeCykdBD6UW/view?usp=sharing">https://drive.google.com/file/d/1ZTbz-diYHWxnEpEhEu57fLeCykdBD6UW/view?usp=sharing</a>

            <Typography  className={classes.header}>Blood Glucose Testing Protocol (SHIFA)</Typography>
            <a href="http://servicelearning.washington.edu/resources">http://servicelearning.washington.edu/resources</a>

            <Typography  className={classes.header}>Blood Pressure Volunteer Information (SHIFA)</Typography>
            <a href="https://drive.google.com/file/d/1__J_8Kc7P2Ll0WcVlJoFUECZ7lzDTFAp/view?usp=sharing">https://drive.google.com/file/d/1__J_8Kc7P2Ll0WcVlJoFUECZ7lzDTFAp/view?usp=sharing</a>

            <Typography  className={classes.header}>Screen and Refer information for preceptors (SHIFA)</Typography>
            <a href="https://drive.google.com/file/d/19mAxA_9UNJ8whBkpRXdHlk26SmM3hnDU/view?usp=sharing">https://drive.google.com/file/d/19mAxA_9UNJ8whBkpRXdHlk26SmM3hnDU/view?usp=sharing</a>

            <Typography  className={classes.header}>Test Result Scri (SHIFA)</Typography>
            <a href="http://servicelearning.washington.edu/resources">http://servicelearning.washington.edu/resources</a>






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
              src="/protocols.png"
              alt="a group of volunteers"
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
      paddingTop: "1em"
  }
});

export default withStyles(styles)(Protocols);
