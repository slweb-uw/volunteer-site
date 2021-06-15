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
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

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
      <Typography variant="h4" style={{ fontWeight: 600, paddingBottom: "0.5em" }}>Links to Additional Service Learning Resources</Typography>

      <Typography variant="h5" style={{ fontWeight: 600, paddingBottom: "0.5em" }}>University of Washington Service Learning Pages</Typography>
      <Typography className={classes.header}><Link className={classes.links} href="https://www.uwmedicine.org/school-of-medicine/md-program/service-learning">School of Medicine Service Learning</Link> (External)</Typography>

      <Typography className={classes.header}><Link className={classes.links} href="https://canvas.uw.edu/courses/1176739">School of Medicine Service Learning Canvas Site</Link> (Internal - logistics site)</Typography>


      <Typography className={classes.header}><Link className={classes.links} href="https://education.uwmedicine.org/volunteer-opportunities-2-2/">School of Medicine Intranet/Service Learning Page</Link> (External)</Typography>


      <Typography className={classes.header}><Link className={classes.links} href="https://collaborate.uw.edu/in-the-community/">Center for Health Sciences Interprofessional Education</Link> (CHSIE)</Typography>

      <Accordion
        square
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography className={classes.title}>Alaska</Typography>
          <AddCircleOutlineIcon style={{color: "#4B2E83", height: "1.5em", width: "auto"}} />
        </AccordionSummary>
        <AccordionDetails>
          <div>
          <Typography><span className={classes.resource}>Brother Francis Shelter</span> - https://www.cssalaska.org/our-programs/brother-francis-shelter/</Typography>
          <Typography><span className={classes.resource}>Four A’s. (Alaskan AIDS Assistance Association)</span> - https://www.alaskanaids.org/</Typography>
          <Typography><span className={classes.resource}>Project Homelessness Connect</span> - https://www.facebook.com/events/egan-center/anchorage-project-homeless-connect/437372703642603/
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
          <AddCircleOutlineIcon style={{color: "#4B2E83", height: "1.5em", width: "auto"}} />
        </AccordionSummary>
        <AccordionDetails>
        <div>
          <Typography><span className={classes.resource}>Area Center on Aging</span> - https://www.cap4action.org/aaa/</Typography>
          <Typography><span className={classes.resource}>Gritman Medical Center</span> - https://gritman.org/</Typography>
          <Typography><span className={classes.resource}>Marie Blanchard Friendship Clinic</span> - https://friendshipclinic.com/</Typography>
          <Typography><span className={classes.resource}>Palouse Free Clinic</span> - https://www.facebook.com/palousefreeclinic/</Typography>
          <Typography><span className={classes.resource}>Snake River Community Clinic</span> - https://www.srccfreeclinic.org/</Typography>
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
          <AddCircleOutlineIcon style={{color: "#4B2E83", height: "1.5em", width: "auto"}} />
        </AccordionSummary>
        <AccordionDetails>
        <div>
          <Typography><span className={classes.resource}>AIDS Outreach</span> - https://www.aidsoutreachmt.org/</Typography>
          <Typography><span className={classes.resource}>CHP (Community Health Partners)</span> - https://chphealthmt.org/</Typography>
          <Typography><span className={classes.resource}>Hopa Mountain</span> - https://www.hopamountain.org/</Typography>
          <Typography><span className={classes.resource}>HRDC  (Human Resource Development Council)</span> - https://thehrdc.org/</Typography>
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
          <AddCircleOutlineIcon style={{color: "#4B2E83", height: "1.5em", width: "auto"}} />
        </AccordionSummary>
        <AccordionDetails>
        <div>
          <Typography><span className={classes.resource}>Aloha Inn</span>  - https://www.transitionalhousing.org/li/aloha_inn_transitional_housing_98109</Typography>
          <Typography><span className={classes.resource}>Casa Latina</span>  - https://casa-latina.org/</Typography>
          <Typography><span className={classes.resource}>Downtown Emergency Service Center (DESC)</span>  - https://www.desc.org/</Typography>
          <Typography><span className={classes.resource}>Elizabeth Gregory Home</span>  - https://eghseattle.org/</Typography>
          <Typography><span className={classes.resource}>ICHS (International Community Health Services)</span>  - https://www.ichs.com/</Typography>
          <Typography><span className={classes.resource}>Low Income Housing Institute (LIHI) Tiny Houses</span>  - https://lihi.org/tiny-houses/</Typography>
          <Typography><span className={classes.resource}>Mercy Housing Northwest</span> - https://www.mercyhousing.org/northwest/</Typography>
          <Typography><span className={classes.resource}>Harborview Medical Center</span> - https://www.uwmedicine.org/locations/harborview-medical-center</Typography>
          <Typography><span className={classes.resource}>International Resuce Committee</span> - https://help.rescue.org/donate?ms=gs_brand_best_charity_es_fy18&initialms=gs_brand_best_charity_es_fy18&gclid=CjwKCAjw-e2EBhAhEiwAJI5jgwiwHEGgUTQKXzfSXc32Wq9klMzmC4Imn23JcSm6I1z2h7HbgYxGWBoCQuMQAvD_BwE</Typography>
          <Typography><span className={classes.resource}>New Horizons</span> - https://nhmin.org/</Typography>
          <Typography><span className={classes.resource}>Peer Seattle</span> - https://www.peerseattle.org/</Typography>
          <Typography><span className={classes.resource}>Pioneer Square Clinic</span> - https://www.uwmedicine.org/locations/pioneer-square</Typography>
          <Typography><span className={classes.resource}>Public Health Seattle/King County</span> - https://kingcounty.gov/depts/health.aspx</Typography>
          <Typography><span className={classes.resource}>ROOTS Youth Shelter</span> - https://rootsinfo.org/</Typography>
          <Typography><span className={classes.resource}>Rotacare Free Clinic</span> - http://www.rotacarelakecity.org/</Typography>
          <Typography><span className={classes.resource}>SeaMar</span> - https://www.seamar.org/king-medical-seattle.html</Typography>
          <Typography><span className={classes.resource}>Seattle Cancer Care Alliance</span> - https://www.seattlecca.org/?gclid=CjwKCAjw-e2EBhAhEiwAJI5jg3vYWEYCyEpmvQD6b_5W6uX4m_iH_-uNVB1_zaId9ghcdP4msAOAShoCLv8QAvD_BwE</Typography>
          <Typography><span className={classes.resource}>Seattle/King County Clinic</span> - https://seattlecenter.org/skcclinic/</Typography>
          <Typography><span className={classes.resource}>Somali Health Board</span> - https://somalihealthboard.org/</Typography>
          <Typography><span className={classes.resource}>St. Vincent de Paul</span> - https://svdpseattle.org/</Typography>
          <Typography><span className={classes.resource}>University of Washington Medical Center</span> - https://www.uwmedicine.org/</Typography>

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
          <AddCircleOutlineIcon style={{color: "#4B2E83", height: "1.5em", width: "auto"}} />
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography><span className={classes.resource}>CHAS Health</span> - https://chas.org/</Typography>
            <Typography><span className={classes.resource}>House of Charity</span> - https://www.cceasternwa.org/house-of-charity</Typography>
            <Typography><span className={classes.resource}>Refugee Connections</span> - http://www.refugeeconnectionsspokane.org/store/c1/Featured_Products.html</Typography>
            <Typography><span className={classes.resource}>Range Community Health</span> - https://www.rangecommunityclinic.org/</Typography>
            <Typography><span className={classes.resource}>Rogers High School</span> - https://www.spokaneschools.org/rogers</Typography>
            <Typography><span className={classes.resource}>Spokane Regional Health District</span> - https://srhd.org/</Typography>
            <Typography><span className={classes.resource}>Union Gospel Mission</span> - https://www.facebook.com/UGMSpokane/</Typography>
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
          <AddCircleOutlineIcon style={{color: "#4B2E83", height: "1.5em", width: "auto"}} />
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Typography><span className={classes.resource}>Downtown Clinic</span> - https://www.downtownclinic.org/</Typography>
            <Typography><span className={classes.resource}>Hospice of Laramie</span> - https://hospiceoflaramie.org/</Typography>
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
    paddingBottom: "1em"
  },

  links: {
    color: "#2436D9", 
    textDecorationLine: "underline"
  },

  title: {
    color: "#4B2E83", 
    fontSize: "1.5rem", 
    fontWeight: 900
  },
  
  resource: {
    fontWeight: 800
  }
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
  expanded: {}
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
    justifyContent: "space-between"
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);


export default withStyles(styles)(Resources);
