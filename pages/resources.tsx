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

const Resources: NextPage<Props> = ({ classes }) => {
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
        Links to additional Service Learning resources
      </Typography>

      <Typography
        variant="h5"
        style={{ fontWeight: 600, paddingBottom: "0.5em" }}
      >
        University of Washington Service Learning Websites
      </Typography>

      <Typography className={classes.header}>
        <b>School of Medicine</b>
      </Typography>
      <Typography className={classes.header} style={{ marginLeft: 50 }}>
        -{" "}
        <Link
          className={classes.links}
          href="https://www.uwmedicine.org/school-of-medicine/md-program/service-learning"
          target="_blank"
        >
          School of Medicine Service Learning
        </Link>{" "}
        (External)
      </Typography>

      <Typography className={classes.header} style={{ marginLeft: 50 }}>
        -{" "}
        <Link
          className={classes.links}
          href="https://canvas.uw.edu/courses/1176739"
          target="_blank"
        >
          School of Medicine Service Learning Canvas Site
        </Link>{" "}
        (Internal - logistics site)
      </Typography>

      <Typography className={classes.header} style={{ marginLeft: 50 }}>
        -{" "}
        <Link
          className={classes.links}
          href="https://education.uwmedicine.org/volunteer-opportunities-2-2/"
          target="_blank"
        >
          School of Medicine Intranet/Service Learning Page
        </Link>{" "}
        (External)
      </Typography>

      <Typography className={classes.header}>
        <b>School of Dentistry</b>
      </Typography>

      <Typography className={classes.header} style={{ marginLeft: 50 }}>
        -{" "}
        <Link
          className={classes.links}
          href="https://dental.washington.edu/oepd/volunteer-opportunities/"
          target="_blank"
        >
          Service Learning Page
        </Link>{" "}
      </Typography>

      <Typography className={classes.header}>
        <b>School of Pharmacy</b>
      </Typography>

      <Typography className={classes.header} style={{ marginLeft: 50 }}>
        -{" "}
        <Link
          className={classes.links}
          href="https://sop.washington.edu/pharmd/student-resources/student-organizations-and-activities/student-organizations-committees/"
          target="_blank"
        >
          Service Learning Page
        </Link>{" "}
      </Typography>

      <Typography className={classes.header}>
        <b>School of Social Work</b>
      </Typography>

      <Typography className={classes.header} style={{ marginLeft: 50 }}>
        -{" "}
        <Link
          className={classes.links}
          href="https://canvas.uw.edu/courses/1369328/pages/ssw-student-groups"
          target="_blank"
        >
          Service Learning Page
        </Link>{" "}
      </Typography>

      <Typography className={classes.header}>
        <b>School of Nursing</b>
      </Typography>

      <Typography className={classes.header} style={{ marginLeft: 50 }}>
        -{" "}
        <Link
          className={classes.links}
          href="https://nursing.uw.edu/community/"
          target="_blank"
        >
          Service Learning Page
        </Link>{" "}
      </Typography>

      <Typography className={classes.header}>
        <b>Interprofessional</b>
      </Typography>

      <Typography className={classes.header} style={{ marginLeft: 50 }}>
        -{" "}
        <Link
          className={classes.links}
          href="https://collaborate.uw.edu/in-the-community/"
          target="_blank"
        >
          Center for Health Sciences Interprofessional Education
        </Link>{" "}
        (CHSIE)
      </Typography>

      <Accordion
        square
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography className={classes.title}>Alaska</Typography>
          <AddCircleOutlineIcon
            style={{ color: "#4B2E83", height: "1.5em", width: "auto" }}
          />
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography>
              <a
                href="https://www.cssalaska.org/our-programs/brother-francis-shelter/"
                className={classes.resource}
                target="_blank"
              >
                Brother Francis Shelter
              </a>{" "}
              - https://www.cssalaska.org/our-programs/brother-francis-shelter/
            </Typography>
            <Typography>
              <a
                href="https://www.alaskanaids.org/"
                className={classes.resource}
                target="_blank"
              >
                Four A’s. (Alaskan AIDS Assistance Association)
              </a>{" "}
              - https://www.alaskanaids.org/
            </Typography>
            <Typography>
              <a
                href="https://www.facebook.com/events/egan-center/anchorage-project-homeless-connect/437372703642603/"
                className={classes.resource}
                target="_blank"
              >
                Project Homelessness Connect
              </a>{" "}
              -
              https://www.facebook.com/events/egan-center/anchorage-project-homeless-connect/437372703642603/
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
          <Typography className={classes.title}>Idaho</Typography>
          <AddCircleOutlineIcon
            style={{ color: "#4B2E83", height: "1.5em", width: "auto" }}
          />
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography>
              <a
                href="https://www.cap4action.org/aaa/"
                className={classes.resource}
                target="_blank"
              >
                Area Center on Aging
              </a>{" "}
              - https://www.cap4action.org/aaa/
            </Typography>
            <Typography>
              <a
                href="https://gritman.org/"
                className={classes.resource}
                target="_blank"
              >
                Gritman Medical Center
              </a>{" "}
              - https://gritman.org/
            </Typography>
            <Typography>
              <a
                href="https://friendshipclinic.com/"
                className={classes.resource}
                target="_blank"
              >
                Marie Blanchard Friendship Clinic
              </a>{" "}
              - https://friendshipclinic.com/
            </Typography>
            <Typography>
              <a
                href="https://www.facebook.com/palousefreeclinic/"
                className={classes.resource}
                target="_blank"
              >
                Palouse Free Clinic
              </a>{" "}
              - https://www.facebook.com/palousefreeclinic/
            </Typography>
            <Typography>
              <a
                href="https://www.srccfreeclinic.org/"
                className={classes.resource}
                target="_blank"
              >
                Snake River Community Clinic
              </a>{" "}
              - https://www.srccfreeclinic.org/
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
          <Typography className={classes.title}>Montana</Typography>
          <AddCircleOutlineIcon
            style={{ color: "#4B2E83", height: "1.5em", width: "auto" }}
          />
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography>
              <a
                href="https://www.aidsoutreachmt.org/"
                className={classes.resource}
                target="_blank"
              >
                AIDS Outreach
              </a>{" "}
              - https://www.aidsoutreachmt.org/
            </Typography>
            <Typography>
              <a
                href="https://chphealthmt.org/"
                className={classes.resource}
                target="_blank"
              >
                CHP (Community Health Partners)
              </a>{" "}
              - https://chphealthmt.org/
            </Typography>
            <Typography>
              <a
                href="https://www.hopamountain.org/"
                className={classes.resource}
                target="_blank"
              >
                Hopa Mountain
              </a>{" "}
              - https://www.hopamountain.org/
            </Typography>
            <Typography>
              <a
                href="https://thehrdc.org/"
                className={classes.resource}
                target="_blank"
              >
                HRDC (Human Resource Development Council)
              </a>{" "}
              - https://thehrdc.org/
            </Typography>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion
        square
        expanded={expanded === "panel4"}
        onChange={handleChange("panel4")}
      >
        <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
          <Typography className={classes.title}>Seattle</Typography>
          <AddCircleOutlineIcon
            style={{ color: "#4B2E83", height: "1.5em", width: "auto" }}
          />
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography>
              <a
                href="https://www.co.washington.or.us/Housing/SupportiveHousingServices/Shelters/aloha-inn-permanent-supportive-housing.cfm"
                className={classes.resource}
                target="_blank"
              >
                Aloha Inn
              </a>{" "}
              -
              https://www.co.washington.or.us/Housing/SupportiveHousingServices/Shelters/aloha-inn-permanent-supportive-housing.cfm
            </Typography>
            <Typography>
              <a
                href="https://casa-latina.org/"
                className={classes.resource}
                target="_blank"
              >
                Casa Latina
              </a>{" "}
              - https://casa-latina.org/
            </Typography>
            <Typography>
              <a
                href="https://www.desc.org/"
                className={classes.resource}
                target="_blank"
              >
                Downtown Emergency Service Center (DESC)
              </a>{" "}
              - https://www.desc.org/
            </Typography>
            <Typography>
              <a
                href="https://eghseattle.org/"
                className={classes.resource}
                target="_blank"
              >
                Elizabeth Gregory Home
              </a>{" "}
              - https://eghseattle.org/
            </Typography>
            <Typography>
              <a
                href="https://www.ichs.com/"
                className={classes.resource}
                target="_blank"
              >
                ICHS (International Community Health Services)
              </a>{" "}
              - https://www.ichs.com/
            </Typography>
            <Typography>
              <a
                href="https://lihi.org/tiny-houses/"
                className={classes.resource}
                target="_blank"
              >
                Low Income Housing Institute (LIHI) Tiny Houses
              </a>{" "}
              - https://lihi.org/tiny-houses/
            </Typography>
            <Typography>
              <a
                href="https://www.mercyhousing.org/northwest/"
                className={classes.resource}
                target="_blank"
              >
                Mercy Housing Northwest
              </a>{" "}
              - https://www.mercyhousing.org/northwest/
            </Typography>
            <Typography>
              <a
                href="https://www.uwmedicine.org/locations/harborview-medical-center"
                className={classes.resource}
                target="_blank"
              >
                Harborview Medical Center
              </a>{" "}
              - https://www.uwmedicine.org/locations/harborview-medical-center
            </Typography>
            <Typography>
              <a
                href="https://help.rescue.org/donate?ms=gs_brand_best_charity_es_fy18&initialms=gs_brand_best_charity_es_fy18&gclid=CjwKCAjw-e2EBhAhEiwAJI5jgwiwHEGgUTQKXzfSXc32Wq9klMzmC4Imn23JcSm6I1z2h7HbgYxGWBoCQuMQAvD_BwE"
                className={classes.resource}
                target="_blank"
              >
                International Resuce Committee
              </a>{" "}
              -
              https://help.rescue.org/donate?ms=gs_brand_best_charity_es_fy18&initialms=gs_brand_best_charity_es_fy18&gclid=CjwKCAjw-e2EBhAhEiwAJI5jgwiwHEGgUTQKXzfSXc32Wq9klMzmC4Imn23JcSm6I1z2h7HbgYxGWBoCQuMQAvD_BwE
            </Typography>
            <Typography>
              <a
                href="https://nhmin.org/"
                className={classes.resource}
                target="_blank"
              >
                New Horizons
              </a>{" "}
              - https://nhmin.org/
            </Typography>
            <Typography>
              <a
                href="https://www.peerseattle.org/"
                className={classes.resource}
                target="_blank"
              >
                Peer Seattle
              </a>{" "}
              - https://www.peerseattle.org/
            </Typography>
            <Typography>
              <a
                href="https://www.uwmedicine.org/locations/pioneer-square"
                className={classes.resource}
                target="_blank"
              >
                Pioneer Square Clinic
              </a>{" "}
              - https://www.uwmedicine.org/locations/pioneer-square
            </Typography>
            <Typography>
              <a
                href="https://kingcounty.gov/depts/health.aspx"
                className={classes.resource}
                target="_blank"
              >
                Public Health Seattle/King County
              </a>{" "}
              - https://kingcounty.gov/depts/health.aspx
            </Typography>
            <Typography>
              <a
                href="https://rootsinfo.org/"
                className={classes.resource}
                target="_blank"
              >
                ROOTS Youth Shelter
              </a>{" "}
              - https://rootsinfo.org/
            </Typography>
            <Typography>
              <a
                href="http://www.rotacarelakecity.org/"
                className={classes.resource}
                target="_blank"
              >
                Rotacare Free Clinic
              </a>{" "}
              - http://www.rotacarelakecity.org/
            </Typography>
            <Typography>
              <a
                href="https://www.seamar.org/king-medical-seattle.html"
                className={classes.resource}
                target="_blank"
              >
                SeaMar
              </a>{" "}
              - https://www.seamar.org/king-medical-seattle.html
            </Typography>
            <Typography>
              <a
                href="https://www.seattlecca.org/?gclid=CjwKCAjw-e2EBhAhEiwAJI5jg3vYWEYCyEpmvQD6b_5W6uX4m_iH_-uNVB1_zaId9ghcdP4msAOAShoCLv8QAvD_BwE"
                className={classes.resource}
                target="_blank"
              >
                Seattle Cancer Care Alliance
              </a>{" "}
              -
              https://www.seattlecca.org/?gclid=CjwKCAjw-e2EBhAhEiwAJI5jg3vYWEYCyEpmvQD6b_5W6uX4m_iH_-uNVB1_zaId9ghcdP4msAOAShoCLv8QAvD_BwE
            </Typography>
            <Typography>
              <a
                href="https://seattlecenter.org/skcclinic/"
                className={classes.resource}
                target="_blank"
              >
                Seattle/King County Clinic
              </a>{" "}
              - https://seattlecenter.org/skcclinic/
            </Typography>
            <Typography>
              <a
                href="https://somalihealthboard.org/"
                className={classes.resource}
                target="_blank"
              >
                Somali Health Board
              </a>{" "}
              - https://somalihealthboard.org/
            </Typography>
            <Typography>
              <a
                href="https://svdpseattle.org/"
                className={classes.resource}
                target="_blank"
              >
                St. Vincent de Paul
              </a>{" "}
              - https://svdpseattle.org/
            </Typography>
            <Typography>
              <a
                href="https://www.uwmedicine.org/"
                className={classes.resource}
                target="_blank"
              >
                University of Washington Medical Center
              </a>{" "}
              - https://www.uwmedicine.org/
            </Typography>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion
        square
        expanded={expanded === "panel5"}
        onChange={handleChange("panel5")}
      >
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography className={classes.title}>Spokane</Typography>
          <AddCircleOutlineIcon
            style={{ color: "#4B2E83", height: "1.5em", width: "auto" }}
          />
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography>
              <a
                href="https://chas.org/"
                className={classes.resource}
                target="_blank"
              >
                CHAS Health
              </a>{" "}
              - https://chas.org/
            </Typography>
            <Typography>
              <a
                href="https://www.cceasternwa.org/house-of-charity"
                className={classes.resource}
                target="_blank"
              >
                House of Charity
              </a>{" "}
              - https://www.cceasternwa.org/house-of-charity
            </Typography>
            <Typography>
              <a
                href="http://www.refugeeconnectionsspokane.org/store/c1/Featured_Products.html"
                className={classes.resource}
                target="_blank"
              >
                Refugee Connections
              </a>{" "}
              -
              http://www.refugeeconnectionsspokane.org/store/c1/Featured_Products.html
            </Typography>
            <Typography>
              <a
                href="https://www.rangecommunityclinic.org/"
                className={classes.resource}
                target="_blank"
              >
                Range Community Health
              </a>{" "}
              - https://www.rangecommunityclinic.org/
            </Typography>
            <Typography>
              <a
                href="https://www.spokaneschools.org/rogers"
                className={classes.resource}
                target="_blank"
              >
                Rogers High School
              </a>{" "}
              - https://www.spokaneschools.org/rogers
            </Typography>
            <Typography>
              <a
                href="https://srhd.org/"
                className={classes.resource}
                target="_blank"
              >
                Spokane Regional Health District
              </a>{" "}
              - https://srhd.org/
            </Typography>
            <Typography>
              <a
                href="https://www.facebook.com/UGMSpokane/"
                className={classes.resource}
                target="_blank"
              >
                Union Gospel Mission
              </a>{" "}
              - https://www.facebook.com/UGMSpokane/
            </Typography>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion
        square
        expanded={expanded === "panel6"}
        onChange={handleChange("panel6")}
      >
        <AccordionSummary aria-controls="panel6d-content" id="panel6d-header">
          <Typography className={classes.title}>Wyoming</Typography>
          <AddCircleOutlineIcon
            style={{ color: "#4B2E83", height: "1.5em", width: "auto" }}
          />
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography>
              <a
                href="https://www.downtownclinic.org/"
                className={classes.resource}
                target="_blank"
              >
                Downtown Clinic
              </a>{" "}
              - https://www.downtownclinic.org/
            </Typography>
            <Typography>
              <a
                href="https://hospiceoflaramie.org/"
                className={classes.resource}
              >
                Hospice of Laramie
              </a>{" "}
              - https://hospiceoflaramie.org/
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

export default withStyles(styles)(Resources);
