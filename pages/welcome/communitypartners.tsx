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
        crumbs={["Welcome Community Partners"]}
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
        WELCOME COMMUNITY PARTNERS
      </Typography>
      <img
        src={"../goldbar.png"}
        style={{ width: "550px", height: "10px", marginBottom: "30px" }}
      />
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
                borderRadius: "10px",
              }}
              src="/communityPartners.jpg"
              alt="a masked vaccine volunteer holding a green sign"
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
              width: "80%",
            }}
          >
            <Typography style={{ fontSize: 16, fontFamily: "Open sans" }}>
              Thank you for your interest in the University of Washington School
              of Medicine and Health Sciences Service Learning Program! Our
              mission is to provide ways for our students to connect with and
              serve our local communities. You might see our students involved
              in a variety of activities such as health screenings, vaccination
              clinics, health education programs or street outreach.
              <Typography style={{ fontSize: 16, marginTop: "20px",  fontFamily: "Open sans"  }}>
                To learn more about what students are working on now,{" "}
                <a href="/opportunities">click here</a>. If you have an idea for a
                future program, please contact Leonora Clarke,{" "}
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
    fontFamily: "Open Sans",
  },

  header: {
    fontWeight: 600,
    paddingTop: "1em",
  },
});

export default withStyles(styles)(Communitypartners);
