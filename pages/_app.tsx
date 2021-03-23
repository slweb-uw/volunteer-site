import type { AppProps } from "next/app";
import { AuthProvider } from "../auth";
import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";
import { SnackbarProvider } from "notistack";

// Global Theme
const theme = createMuiTheme({
  typography: {
    fontFamily: '"Lato", sans-serif',
  },
  palette: {
    background: {
      default: "#F7F7F7",
    },
    primary: { 500: '#6415ff' },
    secondary: { main: '#6415ff' },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
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
            {/* TODO: Navbar component wrapper here */}
            <Component {...pageProps} />
          </MuiThemeProvider>
        </AuthProvider>
      </SnackbarProvider>
    </div>
  );
}
export default MyApp;
