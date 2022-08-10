//*NOTE: Resources is renamed as Links on the Website /*
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
import React, { useState } from "react";

import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';

import ResourceLink from "../components/resourceLink";
import IconBreadcrumbs from "../components/breadcrumbs";
import HeadlineBar from "components/headlineBar";
import { ExpandMore } from "@material-ui/icons";

interface Props {
  classes?: any;
}

const Resources: NextPage<Props> = ({ classes }) => {
  const [expanded, setExpanded] = useState("");
  const [schoolExpanded, setSchoolExpanded] = useState("")

  const handleChange = (panel: any) => (event: any, newExpanded: any) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleSchoolChange = (panel: any) => (event: any, newExpanded: any) => {
    setSchoolExpanded(newExpanded ? panel : false);
  };

  return (
    <div className={classes.page}>
      <IconBreadcrumbs
        crumbs = {["Links"]} />

      <Typography
        variant="h4"
        style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "Encode Sans", textTransform: "uppercase" }}
      >
        UW Health Sciences Service Learning Websites
      </Typography>

      <HeadlineBar color="gold" width={850} height={10}></HeadlineBar>

      <Accordion
        square
        expanded={schoolExpanded === "schoolpanel1"}
        onChange={handleSchoolChange("schoolpanel1")}
      >
        <AccordionSummary aria-controls="schoolpanel1d-content" id="panel1d-header" expandIcon={ <ArrowDropDownCircleOutlinedIcon style={{ color: "#4B2E83", height: "1.5em", width: "auto" }} /> }>
          <Typography className={classes.title}>School of Medicine</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography className={classes.header}>
              <ResourceLink
                className={classes.links}
                href="https://www.uwmedicine.org/school-of-medicine/md-program/service-learning"
              >
                School of Medicine Service Learning
              </ResourceLink>{" "}
              (External)
            </Typography>

            <Typography className={classes.header}>
              <ResourceLink
                className={classes.links}
                href="https://canvas.uw.edu/courses/1176739"
              >
                SOM Service Learning Canvas Site
              </ResourceLink>{" "}
              (Internal - Logistics Site)
            </Typography>

            <Typography className={classes.header}>
              <ResourceLink
                className={classes.links}
                href="https://education.uwmedicine.org/volunteer-opportunities-2-2/"
              >
                SOM Intranet - Service Learning page
              </ResourceLink>{" "}
              (External)
            </Typography>

            <Typography className={classes.header}>
              <ResourceLink
                className={classes.links}
                href="https://uwdpt-service-learning.rehab.washington.edu/"
              >
                Department of Rehabilitation Medicine Service Learning
              </ResourceLink>{" "}
              (External)
            </Typography>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion
        square
        expanded={schoolExpanded === "schoolpanel2"}
        onChange={handleSchoolChange("schoolpanel2")}
      >
        <AccordionSummary aria-controls="schoolpanel2d-content" id="schoolpanel2d-header" expandIcon={ <ArrowDropDownCircleOutlinedIcon style={{ color: "#4B2E83", height: "1.5em", width: "auto" }} /> }>
          <Typography className={classes.title}>School of Dentistry</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography className={classes.header}>
              <ResourceLink
                className={classes.links}
                href="https://dental.washington.edu/oepd/volunteer-opportunities/"
              >
                Service Learning Page
              </ResourceLink>{" "}
            </Typography>
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion
        square
        expanded={schoolExpanded === "schoolpanel3"}
        onChange={handleSchoolChange("schoolpanel3")}
      >
        <AccordionSummary aria-controls="schoolpanel3d-content" id="schoolpanel3d-header" expandIcon={ <ArrowDropDownCircleOutlinedIcon style={{ color: "#4B2E83", height: "1.5em", width: "auto" }} /> }>
          <Typography className={classes.title}>School of Pharmacy</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography className={classes.header}>
              <ResourceLink
                className={classes.links}
                href="https://sop.washington.edu/pharmd/student-resources/student-organizations-and-activities/student-organizations-committees/"
              >
                Service Learning Page
              </ResourceLink>{" "}
            </Typography>
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion
        square
        expanded={schoolExpanded === "schoolpanel4"}
        onChange={handleSchoolChange("schoolpanel4")}
      >
        <AccordionSummary aria-controls="schoolpanel4d-content" id="schoolpanel4d-header" expandIcon={ <ArrowDropDownCircleOutlinedIcon style={{ color: "#4B2E83", height: "1.5em", width: "auto" }} /> }>
          <Typography className={classes.title}>School of Social Work</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography className={classes.header}>
              <ResourceLink
                className={classes.links}
                href="https://canvas.uw.edu/courses/1369328/pages/ssw-student-groups"
              >
                Service Learning Page
              </ResourceLink>{" "}
            </Typography>
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion
        square
        expanded={schoolExpanded === "schoolpanel5"}
        onChange={handleSchoolChange("schoolpanel5")}
      >
        <AccordionSummary aria-controls="schoolpanel5d-content" id="schoolpanel5d-header" expandIcon={ <ArrowDropDownCircleOutlinedIcon style={{ color: "#4B2E83", height: "1.5em", width: "auto" }} /> }>
          <Typography className={classes.title}>School of Nursing</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography className={classes.header}>
              <ResourceLink
                className={classes.links}
                href="https://nursing.uw.edu/community/"
              >
                Service Learning Page
              </ResourceLink>{" "}
            </Typography>
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion
        square
        expanded={schoolExpanded === "schoolpanel6"}
        onChange={handleSchoolChange("schoolpanel6")}
      >
        <AccordionSummary aria-controls="schoolpanel6d-content" id="schoolpanel6d-header" expandIcon={ <ArrowDropDownCircleOutlinedIcon style={{ color: "#4B2E83", height: "1.5em", width: "auto" }} /> }>
          <Typography className={classes.title}>Interprofessional</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography className={classes.header}>
              <ResourceLink
                className={classes.links}
                href="https://collaborate.uw.edu/in-the-community/"
              >
                Center for Health Sciences Interprofessional Education
              </ResourceLink>{" "}
              (CHSIE)
            </Typography>
          </div>
        </AccordionDetails>
      </Accordion>


      <Typography
        variant="h4"
        style={{ fontWeight: 800, paddingBottom: "0", paddingTop: "2em", fontFamily: "Encode Sans", textTransform: "uppercase" }}
      >
        SOM Community Partners
      </Typography>

      <HeadlineBar color="gold" width={450} height={10}></HeadlineBar>

      <Accordion
        square
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={ <ArrowDropDownCircleOutlinedIcon style={{ color: "#4B2E83", height: "1.5em", width: "auto" }} /> }>
          <Typography className={classes.title}>Alaska</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography>
              <a
                href="https://www.cssalaska.org/our-programs/brother-francis-shelter/"
                className={classes.resource}
              >
                Brother Francis Shelter
              </a>{" "}
              - https://www.cssalaska.org/our-programs/brother-francis-shelter/
            </Typography>
            <Typography>
              <ResourceLink
                href="https://www.alaskanaids.org/"
                className={classes.resource}
              >
                Four A’s. (Alaskan AIDS Assistance Association)
              </ResourceLink>{" "}
              - https://www.alaskanaids.org/
            </Typography>
            <Typography>
              <ResourceLink
                href="https://www.facebook.com/events/egan-center/anchorage-project-homeless-connect/437372703642603/"
                className={classes.resource}
              >
                Project Homelessness Connect
              </ResourceLink>{" "}
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
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header" expandIcon={ <ArrowDropDownCircleOutlinedIcon style={{ color: "#4B2E83", height: "1.5em", width: "auto" }} /> }>
          <Typography className={classes.title}>Idaho</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography>
              <ResourceLink
                href="https://www.cap4action.org/aaa/"
                className={classes.resource}
              >
                Area Center on Aging
              </ResourceLink>{" "}
              - https://www.cap4action.org/aaa/
            </Typography>
            <Typography>
              <ResourceLink
                href="https://gritman.org/"
                className={classes.resource}
              >
                Gritman Medical Center
              </ResourceLink>{" "}
              - https://gritman.org/
            </Typography>
            <Typography>
              <ResourceLink
                href="https://friendshipclinic.com/"
                className={classes.resource}
              >
                Marie Blanchard Friendship Clinic
              </ResourceLink>{" "}
              - https://friendshipclinic.com/
            </Typography>
            <Typography>
              <ResourceLink
                href="https://www.facebook.com/palousefreeclinic/"
                className={classes.resource}
              >
                Palouse Free Clinic
              </ResourceLink>{" "}
              - https://www.facebook.com/palousefreeclinic/
            </Typography>
            <Typography>
              <ResourceLink
                href="https://www.srccfreeclinic.org/"
                className={classes.resource}
              >
                Snake River Community Clinic
              </ResourceLink>{" "}
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
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header" expandIcon={ <ArrowDropDownCircleOutlinedIcon style={{ color: "#4B2E83", height: "1.5em", width: "auto" }} /> }>
          <Typography className={classes.title}>Montana</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography>
              <ResourceLink
                href="https://www.aidsoutreachmt.org/"
                className={classes.resource}
              >
                AIDS Outreach
              </ResourceLink>{" "}
              - https://www.aidsoutreachmt.org/
            </Typography>
            <Typography>
              <ResourceLink
                href="https://chphealthmt.org/"
                className={classes.resource}
              >
                CHP (Community Health Partners)
              </ResourceLink>{" "}
              - https://chphealthmt.org/
            </Typography>
            <Typography>
              <ResourceLink
                href="https://www.hopamountain.org/"
                className={classes.resource}
              >
                Hopa Mountain
              </ResourceLink>{" "}
              - https://www.hopamountain.org/
            </Typography>
            <Typography>
              <ResourceLink
                href="https://thehrdc.org/"
                className={classes.resource}
              >
                HRDC (Human Resource Development Council)
              </ResourceLink>{" "}
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
        <AccordionSummary aria-controls="panel4d-content" id="panel4d-header" expandIcon={ <ArrowDropDownCircleOutlinedIcon style={{ color: "#4B2E83", height: "1.5em", width: "auto" }} /> }>
          <Typography className={classes.title}>Seattle</Typography>

        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography>
              <ResourceLink
                href="https://www.co.washington.or.us/Housing/SupportiveHousingServices/Shelters/aloha-inn-permanent-supportive-housing.cfm"
                className={classes.resource}
              >
                Aloha Inn
              </ResourceLink>{" "}
              -
              https://www.co.washResourceLinkngton.or.us/Housing/SupportiveHousingServices/Shelters/aloha-inn-permanent-supportive-housing.cfm
            </Typography>
            <Typography>
              <ResourceLink
                href="https://casa-latina.org/"
                className={classes.resource}
              >
                Casa Latina
              </ResourceLink>{" "}
              - https://casa-latina.org/
            </Typography>
            <Typography>
              <ResourceLink
                href="https://www.desc.org/"
                className={classes.resource}
              >
                Downtown Emergency Service Center (DESC)
              </ResourceLink>{" "}
              - https://www.desc.org/
            </Typography>
            <Typography>
              <ResourceLink
                href="https://eghseattle.org/"
                className={classes.resource}
              >
                Elizabeth Gregory Home
              </ResourceLink>{" "}
              - https://eghseattle.org/
            </Typography>
            <Typography>
              <ResourceLink
                href="https://www.ichs.com/"
                className={classes.resource}
              >
                ICHS (International Community Health Services)
              </ResourceLink>{" "}
              - https://www.ichs.com/
            </Typography>
            <Typography>
              <ResourceLink
                href="https://lihi.org/tiny-houses/"
                className={classes.resource}
              >
                Low Income Housing Institute (LIHI) Tiny Houses
              </ResourceLink>{" "}
              - https://lihi.org/tiny-houses/
            </Typography>
            <Typography>
              <ResourceLink
                href="https://www.mercyhousing.org/northwest/"
                className={classes.resource}
              >
                Mercy Housing Northwest
              </ResourceLink>{" "}
              - https://www.mercyhousing.org/northwest/
            </Typography>
            <Typography>
              <ResourceLink
                href="https://www.uwmedicine.org/locations/harborview-medical-center"
                className={classes.resource}
              >
                Harborview Medical Center
              </ResourceLink>{" "}
              - https://www.uwmedicine.org/locations/harborview-medical-center
            </Typography>
            <Typography>
              <ResourceLink
                href="https://help.rescue.org/donate?ms=gs_brand_best_charity_es_fy18&initialms=gs_brand_best_charity_es_fy18&gclid=CjwKCAjw-e2EBhAhEiwAJI5jgwiwHEGgUTQKXzfSXc32Wq9klMzmC4Imn23JcSm6I1z2h7HbgYxGWBoCQuMQAvD_BwE"
                className={classes.resource}
              >
                International Resuce Committee
              </ResourceLink>{" "}
              -
              https://help.rescue.org/donate?ms=gs_brand_best_charity_es_fy18&initialms=gs_brand_best_charity_es_fy18&gclid=CjwKCAjw-e2EBhAhEiwAJI5jgwiwHEGgUTQKXzfSXc32Wq9klMzmC4Imn23JcSm6I1z2h7HbgYxGWBoCQuMQAvD_BwE
            </Typography>
            <Typography>
              <ResourceLink
                href="https://nhmin.org/"
                className={classes.resource}
              >
                New Horizons
              </ResourceLink>{" "}
              - https://nhmin.org/
            </Typography>
            <Typography>
              <ResourceLink
                href="https://www.peerseattle.org/"
                className={classes.resource}
              >
                Peer Seattle
              </ResourceLink>{" "}
              - https://www.peerseattle.org/
            </Typography>
            <Typography>
              <ResourceLink
                href="https://www.uwmedicine.org/locations/pioneer-square"
                className={classes.resource}
              >
                Pioneer Square Clinic
              </ResourceLink>{" "}
              - https://www.uwmedicine.org/locations/pioneer-square
            </Typography>
            <Typography>
              <ResourceLink
                href="https://kingcounty.gov/depts/health.aspx"
                className={classes.resource}
              >
                Public Health Seattle/King County
              </ResourceLink>{" "}
              - https://kingcounty.gov/depts/health.aspx
            </Typography>
            <Typography>
              <ResourceLink
                href="https://rootsinfo.org/"
                className={classes.resource}
              >
                ROOTS Youth Shelter
              </ResourceLink>{" "}
              - https://rootsinfo.org/
            </Typography>
            <Typography>
              <ResourceLink
                href="http://www.rotacarelakecity.org/"
                className={classes.resource}
              >
                Rotacare Free Clinic
              </ResourceLink>{" "}
              - http://www.rotacarelakecity.org/
            </Typography>
            <Typography>
              <ResourceLink
                href="https://www.seamar.org/king-medical-seattle.html"
                className={classes.resource}
              >
                SeaMar
              </ResourceLink>{" "}
              - https://www.seamar.org/king-medical-seattle.html
            </Typography>
            <Typography>
              <ResourceLink
                href="https://www.seattlecca.org/?gclid=CjwKCAjw-e2EBhAhEiwAJI5jg3vYWEYCyEpmvQD6b_5W6uX4m_iH_-uNVB1_zaId9ghcdP4msAOAShoCLv8QAvD_BwE"
                className={classes.resource}
              >
                Seattle Cancer Care Alliance
              </ResourceLink>{" "}
              -
              https://www.seattlecca.org/?gclid=CjwKCAjw-e2EBhAhEiwAJI5jg3vYWEYCyEpmvQD6b_5W6uX4m_iH_-uNVB1_zaId9ghcdP4msAOAShoCLv8QAvD_BwE
            </Typography>
            <Typography>
              <ResourceLink
                href="https://seattlecenter.org/skcclinic/"
                className={classes.resource}
              >
                Seattle/King County Clinic
              </ResourceLink>{" "}
              - https://seattlecenter.org/skcclinic/
            </Typography>
            <Typography>
              <ResourceLink
                href="https://somalihealthboard.org/"
                className={classes.resource}
              >
                Somali Health Board
              </ResourceLink>{" "}
              - https://somalihealthboard.org/
            </Typography>
            <Typography>
              <ResourceLink
                href="https://svdpseattle.org/"
                className={classes.resource}
              >
                St. Vincent de Paul
              </ResourceLink>{" "}
              - https://svdpseattle.org/
            </Typography>
            <Typography>
              <ResourceLink
                href="https://www.uwmedicine.org/"
                className={classes.resource}
              >
                University of Washington Medical Center
              </ResourceLink>{" "}
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
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header" expandIcon={ <ArrowDropDownCircleOutlinedIcon style={{ color: "#4B2E83", height: "1.5em", width: "auto" }} /> }>
          <Typography className={classes.title}>Spokane</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography>
              <ResourceLink
                href="https://chas.org/"
                className={classes.resource}
              >
                CHAS Health
              </ResourceLink>{" "}
              - https://chas.org/
            </Typography>
            <Typography>
              <ResourceLink
                href="https://www.cceasternwa.org/house-of-charity"
                className={classes.resource}
              >
                House of Charity
              </ResourceLink>{" "}
              - https://www.cceasternwa.org/house-of-charity
            </Typography>
            <Typography>
              <ResourceLink
                href="http://www.refugeeconnectionsspokane.org/store/c1/Featured_Products.html"
                className={classes.resource}
              >
                Refugee Connections
              </ResourceLink>{" "}
              -
              http://www.refugeeconnectionsspokane.org/store/c1/Featured_Products.html
            </Typography>
            <Typography>
              <ResourceLink
                href="https://www.rangecommunityclinic.org/"
                className={classes.resource}
              >
                Range Community Health
              </ResourceLink>{" "}
              - https://www.rangecommunityclinic.org/
            </Typography>
            <Typography>
              <ResourceLink
                href="https://www.spokaneschools.org/rogers"
                className={classes.resource}
              >
                Rogers High School
              </ResourceLink>{" "}
              - https://www.spokaneschools.org/rogers
            </Typography>
            <Typography>
              <ResourceLink
                href="https://srhd.org/"
                className={classes.resource}
              >
                Spokane Regional Health District
              </ResourceLink>{" "}
              - https://srhd.org/
            </Typography>
            <Typography>
              <ResourceLink
                href="https://www.facebook.com/UGMSpokane/"
                className={classes.resource}
              >
                Union Gospel Mission
              </ResourceLink>{" "}
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
        <AccordionSummary aria-controls="panel6d-content" id="panel6d-header" expandIcon={ <ArrowDropDownCircleOutlinedIcon style={{ color: "#4B2E83", height: "1.5em", width: "auto" }} /> }>
          <Typography className={classes.title}>Wyoming</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography>
              <ResourceLink
                href="https://www.downtownclinic.org/"
                className={classes.resource}
              >
                Downtown Clinic
              </ResourceLink>{" "}
              - https://www.downtownclinic.org/
            </Typography>
            <Typography>
              <ResourceLink
                href="https://hospiceoflaramie.org/"
                className={classes.resource}
              >
                Hospice of Laramie
              </ResourceLink>{" "}
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
    fontFamily: "Open Sans"
  },

  links: {
    color: "#2436D9",
    textDecorationLine: "underline",
  },

  title: {
    color: "#4B2E83",
    fontSize: "1.5rem",
    fontWeight: 800,
    fontFamily: "Encode Sans",
  },

});

const Accordion = withStyles({
  root: {
    boxShadow: "none",
    borderBottom: "2px solid #A0A0A0",
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
      backgroundColor: "#E5E5E5",
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
