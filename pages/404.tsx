import { Button, Typography } from "@material-ui/core";
import Link from "next/link";
import React from "react";

// pages/404.js
export default function Custom404() {
  return (
    <div style={{ minHeight: 1000, padding: "3em", textAlign: "center" }}>
      <Typography variant="h4">Error: Page Not Found</Typography>
      <div style={{ marginTop: "3em" }}>
        <Link href="/">
          <Button color="secondary" variant="contained">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
