import { NextPage } from "next";
import { useRouter } from 'next/router';
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
import React, {
  useState,
  useEffect,
 } from "react";

import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';

import ResourceLink from "../components/resourceLink";
import IconBreadcrumbs from "../components/breadcrumbs";
import HeadlineBar from "components/headlineBar";
import { ExpandMore } from "@material-ui/icons";

interface Props {
  classes?: any;
}

const HelpPage: NextPage<Props> = ({ classes }) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState("");
  const [schoolExpanded, setSchoolExpanded] = useState("")

  useEffect(() => {
    // Check if the state was set in the router indicating the "Help" button was clicked
    if (router.query.fromLocationPage) {
      setExpanded("dropdown3"); 
    } else if (router.query.fromSignUpPage) {
      setExpanded("dropdown4"); 
    } else if (router.query.fromSignIn) {
      setExpanded("dropdown1"); 
    }
  }, [router.query.fromLocationPage,
      router.query.fromSignUpPage,
      router.query.fromSignIn]);

  const handleChange = (panel: any) => (event: any, newExpanded: any) => {
    setExpanded(newExpanded ? panel : "");
  };

  const handleSchoolChange = (panel: any) => (event: any, newExpanded: any) => {
    setSchoolExpanded(newExpanded ? panel : false);
  };

  return (
    <div className={classes.page}>
      <IconBreadcrumbs
        crumbs = {["Help"]} />

      {/* Help Section */}
      <Typography
        variant="h4"
        style={{ 
          fontSize: "1.75rem", 
          fontWeight: 800, 
          fontFamily: "Encode Sans", 
          textTransform: "uppercase" 
        }}
      >
        Help
      </Typography>

      <HeadlineBar color="gold" width={65} height={10}></HeadlineBar>

      <MuiAccordion
        square
        expanded={expanded === "dropdown1"}
        onChange={handleChange("dropdown1")}
        >
        <MuiAccordionSummary
            aria-controls="dropdown1d-content"
            id="dropdown1d-header"
            expandIcon={<ArrowDropDownCircleOutlinedIcon style={{ color: "#4B2E83", height: "1.5em", width: "auto" }} />}
        >
            <Typography className={classes.title}>How to sign into the website</Typography>
        </MuiAccordionSummary>
        <MuiAccordionDetails style={{ flexDirection: "column", alignItems: "center", marginTop: "2rem" }}>
            <div>
                <img
                    style={{
                    width: "60em",
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: "10px",
                    }}
                    src="sign-in-step-1.png"
                    alt="Sign in step 1"
                />
            </div>
            <Typography style={{ textAlign: "center", marginTop: "2rem", marginBottom: "5rem" }}>
              Click on the Sign In button at the top right of the screen.
            </Typography>
            <img
                style={{
                width: "60em",
                maxWidth: "100%",
                height: "auto",
                borderRadius: "10px",
                }}
                src="sign-in-step-2.png"
                alt="Sign in step 2"
            />    
            <Typography style={{ textAlign: "center", marginTop: "2rem", marginBottom: "5rem" }}>
            You will be presented with a pop-up, promting to sign-in with an email account. Use your email to sign in with either a Google or Microsoft account. <br />
            If you are using a UW email (an email ending in @uw.edu), you can use either the Google or Microsoft option to sign in.
            </Typography>
            <img
                style={{
                width: "60em",
                maxWidth: "100%",
                height: "auto",
                borderRadius: "10px",
                }}
                src="sign-in-step-3.png"
                alt="Sign in step 3"
            /> 
            <Typography style={{ textAlign: "center", marginTop: "2rem", marginBottom: "5rem" }}>
            After signing in, the Sign In button on the top right will have changed to sign out. You can click this button at anytime to sign out.
            </Typography>
        </MuiAccordionDetails>
        </MuiAccordion>

        <MuiAccordion
        square
        expanded={expanded === "dropdown2"}
        onChange={handleChange("dropdown2")}
        >
        <MuiAccordionSummary
            aria-controls="dropdown2d-content"
            id="dropdown2d-header"
            expandIcon={<ArrowDropDownCircleOutlinedIcon style={{ color: "#4B2E83", height: "1.5em", width: "auto" }} />}
        >
            <Typography className={classes.title}> How to find a project/Opportunity</Typography>
        </MuiAccordionSummary>
        <MuiAccordionDetails style={{ flexDirection: "column", alignItems: "center", marginTop: "2rem" }}>
            <div>
                <img
                    style={{
                    width: "60em",
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: "10px",
                    }}
                    src="find-project-step-1.png"
                    alt="Find project step 1"
                />
            </div>
            <Typography style={{ textAlign: "center", marginTop: "2rem", marginBottom: "5rem" }}>
             On the home page, click the “Find Opportunities” button.
            </Typography>
            <img
                style={{
                width: "60em",
                maxWidth: "100%",
                height: "auto",
                borderRadius: "10px",
                }}
                src="find-project-step-2.png"
                alt="Find project step 2"
            />    
            <Typography style={{ textAlign: "center", marginTop: "2rem", marginBottom: "5rem" }}>
             Don't worry if the page is blank, it's not broken! Make sure a valid location is selected in the Location drop-down menu.
            </Typography>
            <img
                style={{
                width: "60em",
                maxWidth: "100%",
                height: "auto",
                borderRadius: "10px",
                }}
                src="find-project-step-3.png"
                alt="Find project step 3"
            /> 
            <Typography style={{ textAlign: "center", marginTop: "2rem", marginBottom: "5rem" }}>
             You can find all avalible projects at the selected location, as well as their relative information.
            </Typography>
        </MuiAccordionDetails>
        </MuiAccordion>
      
        <MuiAccordion
          square
          expanded={expanded === "dropdown3"}
          onChange={handleChange("dropdown3")}
        >
          <MuiAccordionSummary
            aria-controls="dropdown3d-content"
            id="dropdown3d-header"
            expandIcon={<ArrowDropDownCircleOutlinedIcon style={{ color: "#4B2E83", height: "1.5em", width: "auto" }} />}
          >
            <Typography className={classes.title}>How to sign up/volunteer for a project/Opportunity event</Typography>
          </MuiAccordionSummary>
          <MuiAccordionDetails style={{ flexDirection: "column", alignItems: "center", marginTop: "2rem" }}>
              <div>
                  <img
                      style={{
                      width: "60em",
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: "10px",
                      }}
                      src="sign-up-for-project-step-1.png"
                      alt="Sign up for project step 1"
                  />
              </div>
              <Typography style={{ textAlign: "center", marginTop: "2rem", marginBottom: "5rem" }}>
              Once you find a project that interests you on the oppertunities page, click on it to open a pop-up.
              </Typography>
              <img
                  style={{
                  width: "60em",
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "10px",
                  }}
                  src="sign-up-for-project-step-2.png"
                  alt="Sign up for project step 2"
              />    
              <Typography style={{ textAlign: "center", marginTop: "2rem", marginBottom: "5rem" }}>
              For more information, click the “Learn More” button.
              </Typography>
              <img
                  style={{
                  width: "60em",
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "10px",
                  }}
                  src="sign-up-for-project-step-3.png"
                  alt="Sign up for project step 3"
              /> 
              <Typography style={{ textAlign: "center", marginTop: "2rem", marginBottom: "5rem" }}>
              Here, you can view all of the details listed about the specific volunteer opportunity. For further details, you can visit the specific opportunity’s website link. <br /> 
              If you are ready to join, you can find the project lead's contact information in the Project Lead Contact List. 
              </Typography>
        </MuiAccordionDetails>
      </MuiAccordion>

      <MuiAccordion
        square
        expanded={expanded === "dropdown4"}
        onChange={handleChange("dropdown4")}
      >
        <MuiAccordionSummary
          aria-controls="dropdown4d-content"
          id="dropdown4d-header"
          expandIcon={<ArrowDropDownCircleOutlinedIcon style={{ color: "#4B2E83", height: "1.5em", width: "auto" }} />}
        >
          <Typography className={classes.title}>Navigating the signup page</Typography>
        </MuiAccordionSummary>
        <MuiAccordionDetails style={{ flexDirection: "column", alignItems: "center", marginTop: "2rem" }}>
              <img
                  style={{
                  width: "60em",
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "10px",
                  }}
                  src="sign-up-page.png"
                  alt="Sign up page"
            />
            <Typography style={{ textAlign: "center", marginTop: ".01rem", marginBottom: "5rem" }}>
             Note: Page may look different depending on user type.
            </Typography>
            <Typography style={{ textAlign: "left", marginTop: ".5rem", marginBottom: "5rem" }}>
             Once you are on the signup page, you're screen should look similar to the above image. <br />
             Here is the breakdown of each section: <br />
             1. Opprutunity title <br />
             2. Available events <br />
             3. Roles available in selected event <br />
             4. Buttons for additional features
            </Typography>
        </MuiAccordionDetails>
      </MuiAccordion>
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

export default withStyles(styles)(HelpPage);
