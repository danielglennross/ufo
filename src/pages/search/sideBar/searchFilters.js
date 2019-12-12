import React, { useRef, useEffect, useState, useContext } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import { SearchContext } from "../../../../src/cross-cutting/SearchLayout";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  aligned: {
    display: "flex",
    flexWrap: "row wrap"
  },
  headers: {
    marginBottom: theme.spacing(1)
  }
}));

const useDateTimeStyles = makeStyles(theme => ({
  selection: {
    background: "lightgrey",
    width: "100%"
  },
  formControl: {
    width: "100%"
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  textField: {
    marginBottom: theme.spacing(1),
    width: "100%"
  }
}));

const ExpansionPanel = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0
    },
    "&:before": {
      display: "none"
    },
    "&$expanded": {
      margin: "auto"
    }
  },
  expanded: {}
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56
    }
  },
  content: {
    "&$expanded": {
      margin: "12px 0"
    }
  },
  expanded: {}
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiExpansionPanelDetails);

function QuickTime({ classes }) {
  const { searchFilterState, dispatch } = useContext(SearchContext);

  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);
  useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const [value, setValue] = useState(searchFilterState.dateTime.quick);
  const handleQuickChange = event => {
    setValue(event.target.value);
    dispatch({
      type: "dateTime",
      quick: event.target.value
    });
  };

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel ref={inputLabel} htmlFor="outlined-quick-simple">
        Period
      </InputLabel>
      <Select
        value={value}
        onChange={handleQuickChange}
        labelWidth={labelWidth}
        inputProps={{
          name: "quick",
          id: "outlined-quick-simple"
        }}
      >
        <MenuItem value={"-15mins"}>-15 mins</MenuItem>
        <MenuItem value={"-30mins"}>-30 mins</MenuItem>
        <MenuItem value={"-1hour"}>-1 hour</MenuItem>
        <MenuItem value={"-4hour"}>-4 hour</MenuItem>
        <MenuItem value={"-12hour"}>-12 hour</MenuItem>
        <MenuItem value={"-24hour"}>-24 hour</MenuItem>
        <MenuItem value={"-7days"}>-7 days</MenuItem>
      </Select>
    </FormControl>
  );
}

function RelativeTime({ classes }) {
  const { searchFilterState, dispatch } = useContext(SearchContext);
  // TODO use searchFilterState to set initial states
  const [numberValue, setNumberValue] = useState(
    searchFilterState.dateTime.relative
  );
  const handleNumberChange = event => {
    setNumberValue(event.target.value);
    dispatch({
      type: "dateTime",
      relative: `-${event.target.value}${periodValue}`
    });
  };

  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);
  useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const [periodValue, setPeriodValue] = useState("hours");
  const handlePeriodChange = event => {
    setPeriodValue(event.target.value);
    dispatch({
      type: "dateTime",
      item: {
        type: "relative",
        value: `-${numberValue}${event.target.value}`
      }
    });
  };

  return (
    <div className={classes.aligned}>
      <FormControl variant="outlined" className={classes.formControl}>
        <TextField
          id="outlined-number"
          label="Number"
          value={numberValue}
          onChange={handleNumberChange}
          type="number"
          className={classes.textField}
          InputLabelProps={{
            shrink: true
          }}
          margin="normal"
          variant="outlined"
        />
      </FormControl>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel ref={inputLabel} htmlFor="outlined-quick-simple">
          Period
        </InputLabel>
        <Select
          value={periodValue}
          onChange={handlePeriodChange}
          labelWidth={labelWidth}
          inputProps={{
            name: "quick",
            id: "outlined-quick-simple"
          }}
        >
          <MenuItem value={"secs"}>Seconds ago</MenuItem>
          <MenuItem value={"mins"}>Minutes ago</MenuItem>
          <MenuItem value={"hours"}>Hours ago</MenuItem>
          <MenuItem value={"days"}>Days ago</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

function AbsoluteTime({ classes }) {
  const { searchFilterState, dispatch } = useContext(SearchContext);

  const [toDate, setToDate] = useState(searchFilterState.dateTime.absolute.to);
  const handleToDateChange = date => {
    setToDate(date);
    dispatch({
      type: "dateTime",
      absolute: {
        from: fromDate,
        to: date
      }
    });
  };

  const [fromDate, setFromDate] = useState(
    searchFilterState.dateTime.absolute.from
  );
  const handleFromDateChange = date => {
    setFromDate(date);
    dispatch({
      type: "dateTime",
      item: {
        type: "absolute",
        value: {
          from: date,
          to: toDate
        }
      }
    });
  };

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <TextField
        id="datetime-local"
        label="From"
        type="datetime-local"
        className={classes.textField}
        value={toDate}
        onChange={handleToDateChange}
        InputLabelProps={{
          shrink: true
        }}
      />
      <TextField
        id="datetime-local"
        label="To"
        type="datetime-local"
        className={classes.textField}
        value={fromDate}
        onChange={handleFromDateChange}
        InputLabelProps={{
          shrink: true
        }}
      />
    </FormControl>
  );
}

function ExpansionItem({
  id,
  title,
  classes,
  expanded,
  handleExpandChange,
  children
}) {
  return (
    <div className={classes.selection}>
      <ExpansionPanel
        square
        expanded={expanded === id}
        onChange={handleExpandChange(id)}
      >
        <ExpansionPanelSummary
          aria-controls={`${id}d-content`}
          id={`${id}d-header`}
        >
          <Typography>{title}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>{children}</ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}

function DateTimeFilter() {
  const classes = useDateTimeStyles();
  const { searchFilterState, dispatch } = useContext(SearchContext);

  const [expanded, setExpanded] = useState(searchFilterState.dateTime.active);
  const handleExpandChange = panel => (event, newExpanded) => {
    if (newExpanded) {
      setExpanded(newExpanded ? panel : false);
      dispatch({
        type: "dateTime",
        active: panel
      });
    }
  };

  return (
    <>
      <ExpansionItem
        id="quick"
        title="Quick Time"
        classes={classes}
        expanded={expanded}
        handleExpandChange={handleExpandChange}
      >
        <QuickTime classes={classes} />
      </ExpansionItem>
      <ExpansionItem
        id="relative"
        title="Relative Time"
        classes={classes}
        expanded={expanded}
        handleExpandChange={handleExpandChange}
      >
        <RelativeTime classes={classes} />
      </ExpansionItem>
      <ExpansionItem
        id="absolute"
        title="Absolute Time"
        classes={classes}
        expanded={expanded}
        handleExpandChange={handleExpandChange}
      >
        <AbsoluteTime classes={classes} />
      </ExpansionItem>
    </>
  );
}

export default function SideBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography className={classes.headers} variant="subtitle1">
        Search Filters
      </Typography>
      <DateTimeFilter />
    </div>
  );
}
