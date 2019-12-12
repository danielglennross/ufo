import React, { useReducer, createContext, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import SideBarTemplate from "../../src/cross-cutting/SideBarTemplate";
import ContentTemplate from "../../src/cross-cutting/ContentTemplate";

export const SearchContext = createContext();

const initialSearchFilterState = {
  dateTime: {
    active: "quick",
    quick: "-15mins",
    relative: "-24hours",
    absolute: {
      from: "2020-01-01T00:00",
      to: "2020-01-07T00:00"
    }
  },
  searchBar: ""
};

const useStyles = makeStyles(theme => ({
  textField: {
    flexBasis: 200
  }
}));

const searchBarBuilder = classes => () => {
  const { searchFilterState, dispatch } = useContext(SearchContext);
  const [value, setValue] = useState(searchFilterState.searchBar);

  const handleSearchBarChange = event => {
    setValue(event.target.value);
    dispatch({
      type: "searchBar",
      searchBar: event.target.value
    });
  };

  return (
    <TextField
      className={classes.textField}
      label="Search"
      inputProps={{ "aria-label": "search" }}
      variant="outlined"
      value={value}
      onChange={handleSearchBarChange}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              className={classes.iconButton}
              aria-label="search"
              edge="end"
              type="submit"
            >
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
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
    case "searchBar":
      return {
        ...state,
        searchBar: action.searchBar || state.searchBar
      };
    default:
      return initialSearchFilterState;
  }
}

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
