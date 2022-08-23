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
import HeadlineBar from "components/headlineBar";

interface Props {
  classes?: any;
}

const StudentVolunteers: NextPage<Props> = ({ classes }) => {
  return (
    <div className={classes.page}>
      <CssBaseline />
      <IconBreadcrumbs crumbs={["Welcome Students"]} parentURL={undefined} />
      <Typography
        variant="h4"
        style={{ 
          fontFamily: "Encode Sans", 
          fontWeight: 800, 
          fontSize: "1.75rem",
        }}
      >
        WELCOME STUDENT VOLUNTEERS!
      </Typography>
      <img
        src={"../goldbar.png"}
        style={{ width: "470px", height: "10px", marginBottom: "5px" }}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={8}>
          <div
            style={{
              marginLeft: "0px",
              marginRight: "82px",
              textAlign: "left",
              marginTop: "1em",
            }}
          >
            <Typography style={{ fontSize: 16, fontFamily: "Open Sans" }}>
              Thank you for your interest in volunteering to serve our
              communities! Sometimes we can get so caught up in our studies that
              we lose track of the reasons why we went into health care to begin
              with. Service learning can help.
              <Typography
                style={{
                  fontSize: 16,
                  marginTop: "20px",
                  fontFamily: "Open Sans",
                }}
              >
                <ul>
                  <li>
                    Take advantage of real-life opportunities to get involved!
                  </li>{" "}
                  {/* LINK TO Find Opportunities PAGE */}
                  <li>
                    Utilize the skills that you are gaining in the classroom to
                    actualize your values!
                  </li>
                  <li>
                    Take time to reflect on what medicine means in our world!
                  </li>
                  <li>
                    Serve in the way that fits your interests - Clinical, Health
                    Education, Mentorship, or Advocacy!
                  </li>{" "}
                  <li>
                    Scratch that itch to do something positive in the world!
                  </li>
                </ul>
              </Typography>
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <div
            style={{
              marginLeft: "0px",
              marginRight: "146px",
              textAlign: "center",
              marginTop: "1em",
            }}
          >
            <img
              style={{
                width: "466px",
                height: "255px",
                margin: "0px",
                borderRadius: "10px",
                objectFit: "cover",
              }}
              src="/studentVolunteers.png"
              alt="Student Volunteer Sample Image"
            />
          </div>
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
          <Typography
            style={{
              fontWeight: 400,
              fontSize: 16,
              fontStyle: "italic",
              marginTop: "39px",
              marginBottom: "39px",
              fontFamily: "Open Sans",
            }}
          >
            “Service Learning has helped me to get to know and build
            relationships in a community that I was new to. I have bonded with
            my classmates as I work alongside them and I have grown to
            appreciate and respect the locals in the place I now call home. What
            I love the most about this work is the inspiration I get from being
            surrounded by students and faculty who have such large hearts,
            helping hands and altruistic spirits. I can only hope to model those
            characteristics for the rest of my life.”
            <Typography
              style={{
                fontWeight: 700,
                fontSize: 20,
                marginTop: "20px",
                marginLeft: "20px",
              }}
            >
              - Kierney Ross, Montana WWAMI
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

export default withStyles(styles)(StudentVolunteers);
