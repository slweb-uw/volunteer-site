import { CssBaseline, Typography, Grid } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import IconBreadcrumbs from "components/breadcrumbs";
import Link from "next/link";
import Image from "next/image";
import CommunityPartners from "public/communityPartners.jpg";
interface Props {
  classes?: any;
}

const Communitypartners = ({ classes }) => {
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
        alt=""
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
            <Image
              style={{
                borderRadius: "10px",
                height: "auto",
              }}
              src={CommunityPartners}
              width={415}
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
            </Typography>
            <Typography
              style={{
                fontSize: 16,
                marginTop: "20px",
                fontFamily: "Open sans",
              }}
            >
              To learn more about what students are working on now,{" "}
              <Link href="/opportunities">click here</Link>. If you have an idea
              for a future program, please contact the UWSOM Service Learning
              Team, <a href="mailto://somserve@uw.edu">somserve@uw.edu</a>.
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
