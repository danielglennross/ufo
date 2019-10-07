import React from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiDivider from "@material-ui/core/Divider";
import SearchFilters from "../../../src/pages/search/sideBar/searchFilters";

const SideBarDivider = withStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    width: "100%"
  }
}))(MuiDivider);

export default function SideBar() {
  return (
    <>
      <SearchFilters />
      <SideBarDivider />
    </>
  );
}
