import React from "react";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  appBar: {
    width: `calc(100% - ${theme.sideBar.drawerWidth}px)`,
    marginLeft: theme.sideBar.drawerWidth,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}));

export default function Header({ routing: { location } }) {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Tabs
          value={location.pathname === "/" ? 0 : 1}
          className={classes.tabs}
        >
          <Tab label="Search" component={Link} to="/" />
          <Tab label="Design" component={Link} to="/design" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
}
