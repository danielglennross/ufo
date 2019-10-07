import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  content: {
    width: `calc(100% - ${theme.sideBar.drawerWidth}px)`,
    marginLeft: theme.sideBar.drawerWidth,
    padding: theme.spacing(3)
  }
}));

export default function ContentTemplate({ children }) {
  const classes = useStyles();

  return <div className={classes.content}>{children}</div>;
}
