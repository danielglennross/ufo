import React from "react";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  toolbar: {
    ...theme.mixins.toolbar,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  drawer: {
    width: theme.sideBar.drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: theme.sideBar.drawerWidth
  },
  childItems: {
    padding: theme.spacing(3)
  }
}));

export default function SideBarTemplate({ children }) {
  const classes = useStyles();

  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      <Drawer
        variant="permanent"
        anchor="left"
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.toolbar}>
          <Typography variant="subtitle2" noWrap>
            Understanding Flow Observations
          </Typography>
        </div>
        <Divider />
        <div className={classes.childItems}>{children}</div>
      </Drawer>
    </nav>
  );
}
