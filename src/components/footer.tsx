import type { FC } from "react"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import { firebaseClient } from "firebaseClient"
import { useAuth } from "auth"

const useStyles = makeStyles((theme) => ({
  logo: {
    width: "25rem",
    height: "auto",
    "@media only screen and (max-width: 960px)": {
      width: "90%",
      marginBottom: "1%",
    },
  },
  text: {
    color: "white",
    marginTop: "0.5em",
    fontFamily: "Open Sans",
    fontSize: "14px",
    "@media only screen and (max-width: 600px)": {
      fontSize: "12px",
    },
  },
  footer: {
    fontFamily: "Encode Sans Compressed, sans-serif",
    backgroundColor: "#4B2E83",
    width: "100%",
    textAlign: "center",
    paddingTop: "3rem",
    paddingBottom: "3em",
    marginBottom: "0",
  },
}))

const Footer: React.FC<{}> = () => {
  const { isAdmin } = useAuth()

  return (
    <footer className={useStyles().footer}>
      <img
        src="/uw-text-logo.png"
        alt="University of Washington logo"
        className={useStyles().logo}
      />
      <Typography className={useStyles().text} gutterBottom>
        Contact us: (206) 685-2009 or{" "}
        <a href="mailto://clarkel@uw.edu" className={useStyles().text}>
          somserve@uw.edu
        </a>
      </Typography>
      <Typography className={useStyles().text} gutterBottom>
        <i>
          Please use browsers other than internet explorer for the best
          experience on this website.
        </i>
      </Typography>
      {isAdmin && (
        <a
          href="/userManager"
          style={{ color: "white", paddingTop: "100px", fontWeight: 600 }}
        >
          User Manager
        </a>
      )}
    </footer>
  )
}

export default Footer
