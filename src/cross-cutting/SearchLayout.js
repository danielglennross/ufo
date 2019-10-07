import React, { useReducer, createContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import SideBarTemplate from "../../src/cross-cutting/SideBarTemplate";
import ContentTemplate from "../../src/cross-cutting/ContentTemplate";

const useStyles = makeStyles(theme => ({
  textField: {
    flexBasis: 200
  }
}));

const searchBarBuilder = classes => () => {
  return (
    <TextField
      className={classes.textField}
      label="Search"
      inputProps={{ "aria-label": "search" }}
      variant="outlined"
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              className={classes.iconButton}
              aria-label="search"
              edge="end"
            >
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
};

const initialSearchFilterState = {
  dateTime: {
    active: "quick",
    quick: "-15mins",
    relative: "-24hours",
    absolute: {
      from: "2020-01-01T00:00",
      to: "2020-01-07T00:00"
    }
  }
};

function reducer(state, action) {
  switch (action.type) {
    case "dateTime":
      return {
        ...state,
        dateTime: {
          active: action.active || state.dateTime.active,
          quick: action.quick || state.dateTime.quick,
          relative: action.relative || state.dateTime.relative,
          absolute: action.absolute || state.dateTime.absolute
        }
      };
    default:
      return initialSearchFilterState;
  }
}

export const SearchContext = createContext();

export default function SearchLayout({
  sideBarContent: SideBarContent,
  pageContent: PageContent
}) {
  const classes = useStyles();
  const SearchBar = searchBarBuilder(classes);
  const [searchFilterState, dispatch] = useReducer(
    reducer,
    initialSearchFilterState
  );

  return (
    <SearchContext.Provider value={{ searchFilterState, dispatch }}>
      <SideBarTemplate>
        <SideBarContent />
      </SideBarTemplate>
      <ContentTemplate>
        <SearchBar />
        <PageContent />
      </ContentTemplate>
    </SearchContext.Provider>
  );
}
