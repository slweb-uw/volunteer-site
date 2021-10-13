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
import { useState } from "react";

import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

interface Props {
  classes?: any;
}

const Onboarding: NextPage<Props> = ({ classes }) => {
  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel: any) => (event: any, newExpanded: any) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div className={classes.page}>
      <Typography
        variant="h4"
        style={{ fontWeight: 600, paddingBottom: "0.5em" }}
      >
        Volunteer Provider Onboarding Instructions
      </Typography>

      <Typography style={{ fontWeight: 600, paddingBottom: "2em" }}>
        All providers must fill out a brief survey here:{" "}
        <a href="https://catalyst.uw.edu/webq/survey/clarkel/343031">
          https://catalyst.uw.edu/webq/survey/clarkel/343031
        </a>
      </Typography>

      <Accordion
        square
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography className={classes.title}>Seattle</Typography>
          <AddCircleOutlineIcon
            style={{ color: "#4B2E83", height: "1.5em", width: "auto" }}
          />
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography paragraph>
              Individual projects may have additional training/onboarding
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
              Please contact Leonora Clarke,{" "}
              <a href="mailto://clarkel@uw.edu">clarkel@uw.edu</a>.
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
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography className={classes.title}>Spokane</Typography>
          <AddCircleOutlineIcon
            style={{ color: "#4B2E83", height: "1.5em", width: "auto" }}
          />
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography paragraph>
              Individual projects may have additional training/onboarding
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
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography className={classes.title}>All Other Sites</Typography>
          <AddCircleOutlineIcon
            style={{ color: "#4B2E83", height: "1.5em", width: "auto" }}
          />
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography paragraph>
              Individual projects may have additional training/onboarding
              requirements. See project specific pages for details.
            </Typography>
            <Typography>
              Please contact your insurance company/employer to find out if you
              are covered for service learning activities. If your coverage does
              not extend to this activity, contact Leonora Clarke,{" "}
              <a href="mailto://clarkel@uw.edu">clarkel@uw.edu</a>.
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
  },

  title: {
    color: "#4B2E83",
    fontSize: "1.5rem",
    fontWeight: 900,
  },

  resource: {
    fontWeight: 800,
  },
});

const Accordion = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
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
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
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
