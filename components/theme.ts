import { createMuiTheme } from "@material-ui/core";

// Global Theme
const theme = createMuiTheme({
  typography: {
    fontFamily: '"Lato", sans-serif',
  },
  palette: {
    background: {
      default: "#F7F7F7",
    },
    primary: { 500: "#6415ff" },
    secondary: { main: "#6415ff" },
  },
});

export default theme;
