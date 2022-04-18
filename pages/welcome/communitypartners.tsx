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
  Link,
  Divider,
} from "@material-ui/core";
import IconBreadcrumbs from "components/breadcrumbs";

interface Props {
  classes?: any;
}

const Communitypartners: NextPage<Props> = ({ classes }) => {
  return (
    <div className={classes.page}>
      <CssBaseline />
      <IconBreadcrumbs
        crumbs = {["Welcome Community Partners"]} parentURL = {undefined} />
      <Typography
        variant='h4'
        style={{ fontWeight: 1000, paddingBottom: "1em" }}
      >
        Welcome Community Partners!
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={4}>
          <div
            style={{
              marginLeft: "0px",
              marginRight: "20%",
              textAlign: "center",
              marginTop: "1em",
            }}
          >
            <img
              style={{
                width: "415px",
                borderRadius: "10px"
              }}
              src='/communityPartners.jpg'
              alt='a masked vaccine volunteer holding a green sign'
            />
          </div>
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
          <div
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              textAlign: "left",
              marginTop: "1em",
              width: "80%"
            }}
          >
            <Typography style = {{fontSize: 20}}>
              Thank you for your interest in the University of Washington School of Medicine and Health Sciences
              Service Learning Program! Our mission is to provide ways for our students to connect with and serve 
              our local communities. You might see our students involved in a{" "}
              <a href='/resources'>variety of activities</a>
              {" "}such as health screenings, 
              vaccination clinics, health education programs or street outreach.
              <Typography style = {{fontSize: 20, marginTop: "20px" }}>
                To learn more about what students are working on now,{" "}
                <a href='/donations'>click here</a>.
                {" "}If you have an idea for a future program, 
                please contact Leonora Clarke,{" "}
              <a href="mailto://clarkel@uw.edu">clarkel@uw.edu</a>.
              </Typography>
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
            <Typography 
                style={{ fontWeight: 700, fontSize: 20, marginTop: "53px" }}
            >
                Quote from previous Community Partner
            </Typography>
            <Typography style={{fontWeight: 400, fontSize: 20, fontStyle: "italic", marginTop: "39px", marginBottom: "39px"}}>
                “Precepting can help you feel better about yourself and the world. This is one of the greatest positives about precepting. 
                Taking a few hours to work with totally selfless health sciences students who are searching for ways to help the less fortunate
                is the best antidote to the COVID blues and political cynicism that I’ve found. It is a joyful experience. Give it a try and see
                if you don’t agree.”
                <Typography style={{fontWeight: 700, fontSize: 20, fontStyle: "italic" }}>
                - Richard Arnold, MD
                </Typography>
            </Typography>
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

export default withStyles(styles)(Communitypartners);
