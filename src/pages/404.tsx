import { Button, Typography } from "@material-ui/core"
import Link from "next/link"

// pages/404.js
export default function Custom404() {
  return (
    <div style={{ minHeight: 1000, padding: "3em", textAlign: "center" }}>
      <Typography
        variant="h4"
        style={{ fontFamily: "Encode Sans", fontWeight: 800 }}
      >
        Error: Page Not Found
      </Typography>
      <div style={{ marginTop: "3em" }}>
        <Link href="/">
          <Button
            color="secondary"
            variant="contained"
            style={{ fontFamily: "Encode Sans", fontWeight: 800 }}
          >
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
