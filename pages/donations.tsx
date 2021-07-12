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
import DonateCard from "../components/donateCard";

interface Props {
  classes?: any;
}

const Donations: NextPage<Props> = ({ classes }) => {
  return (
    <div className={classes.page}>
      <CssBaseline />
      <Grid container spacing={4}>
        <Grid item xs={12} md={6} lg={8}>
          <div
            style={{
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Typography
              style={{ paddingBottom: "0.5rem", fontStyle: "italic" }}
            >
              Consider a Gift to the
            </Typography>
            <Typography
              variant="h5"
              style={{ paddingBottom: "0.5rem", fontWeight: 700 }}
            >
              UWSOM Medicine Service Learning Fund
            </Typography>
            <Typography
              style={{
                paddingBottom: "0.5rem",
                fontWeight: 700,
                fontStyle: "italic",
              }}
            >
              Your donation will help sustain our efforts!
            </Typography>
            <Typography>
              Support School of Medicine students engaged in service-learning or
              advocacy activities. We provide basic health services and health
              education to communities in need and support outreach efforts to
              bring underrepressented youth into the health professions.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              target="_blank"
              href="https://www.acceleratemed.org/give/?source=servmd"
              style={{
                marginTop: "2rem",
                marginBottom: "2rem",
                fontWeight: 700,
                padding: "1rem",
                fontSize: "1.2rem",
              }}
            >
              Make a Gift Today! {">"}{" "}
            </Button>
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
              src="/donate-header.png"
              alt="doctor caring for mom with child"
            />
          </div>
        </Grid>
      </Grid>
      <Typography
        variant="h5"
        style={{ fontWeight: 600, paddingBottom: "1rem" }}
      >
        Donate to a Specific Project
      </Typography>

      <Grid container direction="row" spacing={6}>
        <Grid item xs={12} lg={6}>
          <DonateCard
            title="Health Sciences Mobile Health Van"
            description="The Mobile Health Outreach Van is a collaborative effort by students, staff and faculty from across the UW health sciences (medicine, social work, public health, pharmacy, nursing, and dentistry)."
            donate="https://online.gifts.washington.edu/peer2peer/campaign/b2a0bc42-b48b-49c7-8615-4a6fc1ad53c2"
            img="/mobile-van.png"
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <DonateCard
            title="The Student Health Initiative For Access (SHIFA)"
            description="The Student Health Initiative for Access (SHIFA) organization is a product of a group vision to create a primary care student-run clinic serving vulnerable populations in the King County area."
            donate="https://online.gifts.washington.edu/peer2peer/campaign/5c9028f3-582b-449d-ba71-91e56490e82f"
            img="/shifa.png"
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <DonateCard
            title="UNIVERSITY DISTRICT STREET MEDICINE (UDSM)"
            description="UDSM is a student-led, interprofessional organization that extends a bridge to care for people experiencing homelessness."
            donate="https://online.gifts.washington.edu/peer2peer/campaign/44c375de-6bec-40cf-8e99-e8af258b04d9"
            img="/udsm.png"
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <DonateCard
            title="UTEST"
            description="U-TEST provides rapid, anonymous and free HIV testing and counseling. These services are available to everyone, and we strive to provide inclusive care and a welcoming environment for all. "
            donate="https://online.gifts.washington.edu/peer2peer/Campaign/d929d3c5-a01a-45cd-b84f-80925a2fc6e3"
            img="/utest.png"
          />
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
    width: "95%",
    paddingTop: "2em",
    paddingBottom: "5em",
  },
});

export default withStyles(styles)(Donations);
