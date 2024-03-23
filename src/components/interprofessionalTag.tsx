import type { FC } from "react"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
  bubble: {
    border: "2px solid #4b2e83",
    borderRadius: "15px",
    display: "inline-block",
    padding: "5px 10px",
    fontWeight: "bold",
    color: "#4b2e83",
    fontSize: "12px",
    marginRight: "0.5rem",
  },
}))

interface BubbleProps {
  text: string
}

const Bubble: FC<BubbleProps> = ({ text }) => {
  const classes = useStyles()

  return <div className={classes.bubble}>{text}</div>
}

export default Bubble
