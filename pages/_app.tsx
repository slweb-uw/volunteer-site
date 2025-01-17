import type { AppProps } from "next/app"
import { AuthProvider } from "../auth"
import React from "react"
import {
  ThemeProvider,
  createTheme as createv5Theme,
} from "@mui/material/styles"
import { SnackbarProvider } from "notistack"
import Layout from "components/layout"
import type {} from "@mui/lab/themeAugmentation"
import "../global.css"
import { Theme } from "@mui/material/styles"
import { CssBaseline } from "@mui/material"

declare module "@mui/styles" {
  interface DefaultTheme extends Theme {}
}
// Global Theme
const theme = {
  components: {
    MuiTimeline: {
      styleOverrides: {
        root: {
          backgroundColor: "red",
        },
      },
    },
  },
  typography: {
    /*
    fontFamily: '"Encode Sans", sans-serif',
    */
  },
  palette: {
    background: {
      default: "#FFFFFF",
    },
    grey: { 500: "#E5E5E5" },
    primary: { main: "#4B2E83" },
    secondary: { main: "#85754D" },
  },
}

const v5theme = createv5Theme(theme)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <title>UW Medicine Service Learning Volunteer Catalog</title>
      <SnackbarProvider maxSnack={3}>
        <AuthProvider>
          <CssBaseline>
            <ThemeProvider theme={v5theme}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ThemeProvider>
          </CssBaseline>
        </AuthProvider>
      </SnackbarProvider>
    </div>
  )
}
export default MyApp
