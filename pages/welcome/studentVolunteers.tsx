import { NextPage } from "next";
import { CssBaseline, Typography, Grid } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import IconBreadcrumbs from "components/breadcrumbs";
import Image from "next/image";
import StudentVolunteersUrl from "public/studentVolunteers.png";
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
          fontSize: "2rem",
        }}
      >
        WELCOME STUDENT VOLUNTEERS
      </Typography>
      <HeadlineBar color="gold" width={550} height={10} marginBottom={5}/>
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
            </Typography>
            <ul>
              <li>
                <Typography>
                  Take advantage of real-life opportunities to get involved.
                </Typography>
              </li>{" "}
              {/* LINK TO Find Opportunities PAGE */}
              <li>
                Utilize the skills that you are gaining in the classroom to
                actualize your values.
              </li>
              <li>Take time to reflect on what medicine means in our world.</li>
              <li>
                Serve in the way that fits your interests - Clinical, Health
                Education, Mentorship, or Advocacy.
              </li>{" "}
              <li>Scratch that itch to do something positive in the world.</li>
            </ul>
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
            <Image
              style={{
                margin: "0px",
                borderRadius: "10px",
                objectFit: "cover",
              }}
              src={StudentVolunteersUrl}
              width={466}
              height={255}
              alt="Student Volunteer Sample Image"
            />
          </div>
        </Grid>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            style={{
              fontWeight: 400,
              fontSize: 16,
              fontStyle: "italic",
              marginTop: "39px",
              marginBottom: "39px",
              fontFamily: "Open Sans",
              textAlign: "center",
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
          </Typography>
          <Typography
            style={{
              fontWeight: 700,
              fontSize: 20,
              marginTop: "15px",
              marginLeft: "20px",
            }}
          >
            - Kierney Ross, Montana WWAMI
          </Typography>
        </div>
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
