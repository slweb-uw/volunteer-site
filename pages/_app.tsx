import type { AppProps } from "next/app";
import { AuthProvider } from "../auth";
import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import Layout from "components/layout";

// Global Theme
const theme = createMuiTheme({
  typography: {
    fontFamily: '"Open Sans", sans-serif',
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
        href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap"
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
