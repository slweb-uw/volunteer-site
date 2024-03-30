import makeStyles from "@mui/styles/makeStyles"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"

const useStyles = makeStyles((theme) => ({
  root: {
    cursor: "pointer",
    display: "flex",
  },
  details: {
    height: 300,
    display: "flex",
    flexDirection: "column",
    "@media only screen and (max-width: 600px)": {
      height: "auto",
    },
  },
  content: {
    flex: "1 0 auto",
  },
  cover: {
    width: 230,
    height: 300,
    "@media only screen and (max-width: 600px)": {
      marginTop: ".5em",
      display: "none",
    },
  },
}))

interface Props {
  title: string
  description: string
  donate: string
  img: string
}

const DonateCard: React.FC<Props> = (props) => {
  const classes = useStyles()

  return (
    <Card
      className={classes.root}
      variant="outlined"
      style={{ borderRadius: 10 }}
    >
      <CardMedia
        component="img"
        className={classes.cover}
        src={props.img}
        alt={props.title}
      />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography
            component="h6"
            variant="h6"
            style={{ fontFamily: "Encode Sans" }}
          >
            <b>{props.title}</b>
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            style={{ fontFamily: "Open Sans" }}
          >
            {props.description}
          </Typography>
          <a href={props.donate} target="_blank">
            <Button
              style={{
                marginTop: "1rem",
                fontFamily: "Encode Sans",
                marginBottom: "0",
              }}
              variant="contained"
              color="secondary"
              href={props.donate}
            >
              Donate
            </Button>
          </a>
        </CardContent>
      </div>
    </Card>
  )
}

export default DonateCard
