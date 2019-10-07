import React from "react";
import { Route, BrowserRouter } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import Header from "../src/cross-cutting/Header";
import LayoutManager from "../src/cross-cutting/LayoutManager";

const theme = createMuiTheme({
  sideBar: {
    drawerWidth: 300
  }
});

export default function App() {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Route
            path="/"
            render={({ location }) => (
              <>
                <Header routing={{ location }} />
                <LayoutManager />
              </>
            )}
          />
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}
