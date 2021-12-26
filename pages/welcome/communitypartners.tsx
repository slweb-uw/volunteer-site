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
        crumbs = {["Welcome Community Partners"]} />
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
              marginLeft: "auto",
              marginRight: "146px",
              textAlign: "center",
              marginTop: "1em",
            }}
          >
            <img
              style={{
                width: "415px"
              }}
              src='/communitypartners.png'
              alt='a masked vaccine volunteer holding a green sign'
            />
          </div>
          <Typography 
            style={{ fontWeight: 700, fontSize: 20, marginTop: "53px" }}
          >
            Quotes from previous Community Partners
          </Typography>
          <Typography style={{fontWeight: 400, fontSize: 20, fontStyle: "italic", marginTop: "39px" }}>
              "We need more quotes..."
              <Typography style={{fontWeight: 700, fontSize: 20, fontStyle: "italic" }}>
                - UX Design Team, Washington
              </Typography>
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
          <div
            style={{
              marginLeft: "146px",
              marginRight: "82px",
              textAlign: "left",
              marginTop: "1em",
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
