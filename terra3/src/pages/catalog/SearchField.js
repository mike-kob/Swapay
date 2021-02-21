import React from 'react';
import {
  TextField,
  InputAdornment,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
  searchBar: {},
  textField: {
    width: '100%',
    padding: theme.spacing(1, 3),
    backgroundColor: theme.palette.primary.main,
  },
}));

const SearchField = (props) => {
  const classes = useStyles(props);
  const {params, setParams, applySearch} = props;

  return (
    <div className={classes.searchBar}>
      <TextField
        value={params.keywords}
        onChange={(e) => setParams({...params, keywords: e.target.value})}
        className={classes.textField}
        InputProps={{
          endAdornment: (
            <InputAdornment
              onClick={() => applySearch()}
              position="end"
            ><SearchIcon/></InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default SearchField;
