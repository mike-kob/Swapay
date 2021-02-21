import React from 'react';
import {connect} from 'react-redux';
import {
  Paper,
  Typography,
  Grid,
  TextField,
  Box,
  FormControl,
  Select,
  Input,
  Chip,
  MenuItem,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Autocomplete from '@material-ui/lab/Autocomplete';

import {itemAdminActions} from '@/actionCreators';


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  textInput: {
    maxWidth: theme.spacing(25),
  },
}));


const AdditionalInfoPaper = (props) => {
  const classes = useStyles(props);
  const {item, parentClasses} = props;


  return (
    <Paper className={parentClasses.paper}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom className={parentClasses.headers}>
            Additional info
          </Typography>

          <FormControl className={classes.formControl} fullWidth>
            <InputLabel htmlFor="my-input">Game tags</InputLabel>
            <Select
              id="my-input"
              multiple
              value={item.tags.map((t) => t.id)}
              onChange={(e) => {
                const values = [];
                for (const tagId of e.target.value) {
                  values.push(props.gameTags.find((t) => t.id.toString() === tagId));
                }
                props.modifyPrivateItem({'tags': values});
              }}
              input={<Input id="select-multiple-chip"/>}
              renderValue={(selected) => (
                <div className={classes.chips}>
                  {selected.map((tagId) => {
                    const tag = props.gameTags.find((t) => t.id === tagId);
                    if (!tag) return <></>;
                    return (
                      <Chip
                        key={tag.id} label={tag.enName}
                        className={classes.chip}/>
                    );
                  })}
                </div>
              )}
            >
              {props.gameTags.map((tag) => (
                <MenuItem key={tag.id} value={tag.id}>
                  {tag.enName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box m={1}/>
          <TextField
            id="outlined-basic"
            label="Age of audience"
            variant="outlined"
            className={classes.textInput}
            value={item.age}
            onChange={(e) => props.modifyPrivateItem({age: e.target.value})}
          />
          <Box m={1}/>
          <Autocomplete
            id="free-solo-language"
            freeSolo
            className={classes.textInput}
            options={['Russian', 'Ukrainian', 'English', 'Independent']}
            renderInput={(params) => (
              <TextField {...params} label="Language" margin="normal" variant="outlined"/>
            )}
            value={item.language}
            onChange={(e) => {
              props.modifyPrivateItem({language: ['Russian', 'Ukrainian', 'English', 'Independent'][e.target.value]})
            }}
            getOptionLabel={(option) => option}
          />

          <Box m={1}/>
          <TextField
            id="outlined-basic"
            label="Time of round"
            variant="outlined"
            className={classes.textInput}
            value={item.avgGameTime}
            onChange={(e) => props.modifyPrivateItem({avgGameTime: e.target.value})}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};


function mapStateToProps(state) {
  return {
    item: state.item.item,
    gameTags: state.item.gameTags,
  };
}

const actionCreators = {
  modifyPrivateItem: itemAdminActions.modifyPrivateItem,
};

export default connect(mapStateToProps, actionCreators)(AdditionalInfoPaper);
