import type { AppProps } from "next/app";
import { AuthProvider } from "../auth";
import React from "react";
import { MuiThemeProvider, createTheme } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import Layout from "components/layout";
import type {} from '@mui/lab/themeAugmentation';

// Global Theme
const theme = createTheme({
  //@ts-ignore
  components: {
    MuiTimeline: {
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Lato", sans-serif',
  },
  palette: {
    background: {
      default: "#F7F7F7",
    },
    primary: { 500: "#6415ff" },
    secondary: { main: "#85754D" },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Lato&display=swap"
      />
      <title>UW Medicine Service Learning Volunteer Catalog</title>
      <SnackbarProvider maxSnack={3}>
        <AuthProvider>
          <MuiThemeProvider theme={theme}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </MuiThemeProvider>
        </AuthProvider>
      </SnackbarProvider>
    </div>
  );
}
export default MyApp;
