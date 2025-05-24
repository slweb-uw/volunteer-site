import { NextPage } from "next";
import { CssBaseline, Typography, Select, MenuItem, Grid, Button, Link, Divider } from "@mui/material";
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import { useState } from "react";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import IconBreadcrumbs from "../components/breadcrumbs"
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import { yellow } from "@mui/material/colors";
import { WarningOutlined } from "@mui/icons-material";
import HeadlineBar from "components/headlineBar";
interface Props {
  classes?: any;
}
const Onboarding: NextPage<Props> = ({ classes }) => {
  const [expanded, setExpanded] = useState("");

  const handleChange = (panel: any) => (event: any, newExpanded: any) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div className={classes.page}>
      <IconBreadcrumbs
        crumbs = {["Onboarding Instructions"]} />
      <Typography
        variant="h4"
        style={{ fontFamily: "Encode Sans", fontWeight: 800 }}
      >
        VOLUNTEER PROVIDER ONBOARDING INSTRUCTIONS
      </Typography>

      <HeadlineBar color="gold" width={900} height={10} marginBottom={0}/>

      <Alert severity="warning" style={{ backgroundColor: "#fef4e5", marginBottom: "2em", marginTop: "2em" }}>
        <AlertTitle>
          <strong>All providers must fill out a brief survey here:{" "}</strong>
          <a target="_blank" href="http://bit.ly/45t3Lmn">
          Service Learning Provider Onboarding Form
          </a>
        </AlertTitle>
      </Alert>

      <Accordion
        square
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={ <ArrowDropDownCircleOutlinedIcon style={{ color: "#4B2E83", height: "1.5em", width: "auto" }} /> }>
          <Typography className={classes.title}>Seattle</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography paragraph>
              Individual projects may have other training/onboarding
              requirements. See project specific pages for details.
            </Typography>
            <Typography>
              <b>
                UW Physicians (full-time or part-time) in the Departments of
                Internal Medicine, Family Medicine, Emergency Medicine,
                Neurology, and Pediatrics
              </b>
            </Typography>
            <Typography paragraph>
              NO additional approval is required
            </Typography>
            <Typography>
              <b>
                UW Physicians (full-time or part-time) in ALL OTHER departments
              </b>
            </Typography>
            <Typography paragraph>
              Please contact the UWSOM Service Learning Team,{" "}
              <a href="mailto://somserve@uw.edu">somserve@uw.edu</a>.
            </Typography>
            <Typography>
              <b>Non-UW Physicians (this includes VA and FQHC employees)</b>
            </Typography>
            <Typography paragraph>
              Please contact your insurance company/employer to find out if you
              are covered for service learning activities. If your coverage does
              not extend to this activity, or if you are retired, the University
              requires volunteers to apply for the free professional liability
              coverage through the Volunteer and Retired Provider (VRP) program.
              The VRP program offers coverage for non-invasive primary and
              specialty care of low-income patients in qualified settings.
              The <a target="_blank" href="https://www.wahealthcareaccessalliance.org/volunteers/apply-for-vrp">form</a> is
              quite simple and approval takes 1-2 weeks.
            </Typography>
            <Typography>
              <b>Non-MD Providers</b>
            </Typography>
            <Typography gutterBottom>
              Please contact your insurance company/employer to find out if you
              are covered for service learning activities. If your coverage does
              not extend to this activity, or if you are retired, the University
              requires volunteers to apply for the free professional liability
              coverage through the Volunteer and Retired Provider (VRP) program.
              The VRP program offers coverage for non-invasive primary and
              specialty care of low-income patients in qualified settings.
              The <a target="_blank" href="https://www.wahealthcareaccessalliance.org/volunteers/apply-for-vrp">form</a> is
              quite simple and approval takes 1-2 weeks.
            </Typography>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion
        square
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header" expandIcon={ <ArrowDropDownCircleOutlinedIcon style={{ color: "#4B2E83", height: "1.5em", width: "auto" }} /> }>
          <Typography className={classes.title}>Spokane</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography paragraph>
              Individual projects may have other training/onboarding
              requirements. See project specific pages for details.
            </Typography>
            <Typography>
              <b>All Providers</b>
            </Typography>
            <Typography>
              Please contact your insurance company/employer to find out if you
              are covered for service learning activities. If your coverage does
              not extend to this activity, or if you are retired, the University
              requires volunteers to apply for the free professional liability
              coverage through the Volunteer and Retired Provider (VRP) program.
              The VRP program offers coverage for non-invasive primary and
              specialty care of low-income patients in qualified settings.
              The <a target="_blank" href="https://www.wahealthcareaccessalliance.org/volunteers/apply-for-vrp">form</a> is
              quite simple and approval takes 1-2 weeks.
            </Typography>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion
        square
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header" expandIcon={ <ArrowDropDownCircleOutlinedIcon style={{ color: "#4B2E83", height: "1.5em", width: "auto" }} /> }>
          <Typography className={classes.title}>All Other Sites</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography paragraph>
              Individual projects may have other training/onboarding
              requirements. See project specific pages for details.
            </Typography>
            <Typography>
              Please contact your insurance company/employer to find out if you
              are covered for service learning activities. If your coverage does
              not extend to this activity, contact the UWSOM Service Learning Team,{" "}
              <a href="mailto://somserve@uw.edu">somserve@uw.edu</a>.
            </Typography>
          </div>
        </AccordionDetails>
      </Accordion>
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
    paddingBottom: "0.5em",
  },

  links: {
    color: "#2436D9",
    textDecorationLine: "underline",
    marginLeft: 50,
  },

  title: {
    color: "#4B2E83",
    fontSize: "1.5rem",
    fontFamily: "Encode Sans",
    fontWeight: 900,
  },

  resource: {
    fontWeight: 800,
  },

  standout: {
    display: "inline-block",
    backgroundColor: "#FFFF00",
  },

});

const Accordion = withStyles({
  root: {
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: "2px solid #A0A0A0",
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
      backgroundColor: "#E5E5E5",
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

export default withStyles(styles)(Onboarding);
