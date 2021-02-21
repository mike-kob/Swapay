import React from 'react';
import {connect} from 'react-redux';
import {
  Paper,
  Typography,
  Grid,
  FormControlLabel,
  Checkbox,
  TextField,
  InputAdornment,
  FormHelperText,
  OutlinedInput,
  FormControl,
} from '@material-ui/core';

import {itemAdminActions} from '@/actionCreators';


const types = {
  RENT_TYPE: 'R',
  SELL_TYPE: 'P',
  EXCHANGE_TYPE: 'E',
};


const PricePaper = (props) => {
  const {item, parentClasses} = props;

  const handleChecked = (event, isChecked) => {
    if (isChecked) {
      props.modifyPrivateItem({types: [...item.types, event.target.value]});
    } else {
      props.modifyPrivateItem({types: item.types.filter((type) => type !== event.target.value)});
    }
  };

  return (
    <Paper className={parentClasses.paper}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom className={parentClasses.headers}>
            What do you want to do?
          </Typography>

          <Grid container spacing={1}>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox
                  checked={item.types.includes(types.RENT_TYPE)}
                  color="primary"
                  name="type"
                  value={types.RENT_TYPE}/>}
                label="Rent"
                onChange={handleChecked}
              />
            </Grid>
            {item.types.includes(types.RENT_TYPE) ? <Grid item xs={12}>
              <FormControl>
                <OutlinedInput
                  className={parentClasses.fields}
                  size="small"
                  defaultValue="Small"
                  variant="outlined"
                  type="number"
                  placeholder="Price"
                  endAdornment={<InputAdornment position="end">₴</InputAdornment>}
                  value={item.rentPrice}
                  onChange={(e) => props.modifyPrivateItem({rentPrice: parseInt(e.target.value)})}
                />
                <FormHelperText id="outlined-weight-helper-text">Per day</FormHelperText>
              </FormControl>
              <FormControl>
                <OutlinedInput
                  className={parentClasses.fields}
                  size="small"
                  defaultValue="Small"
                  variant="outlined"
                  type="number"
                  placeholder="Deposit"
                  endAdornment={<InputAdornment position="end">₴</InputAdornment>}
                  value={item.deposit}
                  onChange={(e) => props.modifyPrivateItem({deposit: parseInt(e.target.value)})}
                />
              </FormControl>
            </Grid> : <></>
            }
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox
                  checked={item.types.includes(types.SELL_TYPE)}
                  color="primary"
                  name="type"
                  value={types.SELL_TYPE}/>}
                label="Sell"
                onChange={handleChecked}
              />
              {item.types.includes(types.SELL_TYPE) ?
                <Grid item xs={12}>
                  <OutlinedInput
                    className={parentClasses.fields}
                    size={'small'}
                    variant="outlined"
                    endAdornment={<InputAdornment position="end">₴</InputAdornment>}
                    type="number"
                    value={item.sellPrice}
                    placeholder="For ..."
                    onChange={(e) => props.modifyPrivateItem({sellPrice: parseInt(e.target.value)})}
                  />
                </Grid> : <></>}
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox
                  checked={item.types.includes(types.EXCHANGE_TYPE)}
                  color="primary"
                  name="type"
                  value={types.EXCHANGE_TYPE}/>}
                label="Exchange"
                onChange={handleChecked}
              />
              {item.types.includes(types.EXCHANGE_TYPE) ?
                <Grid item xs={12}>
                  <TextField
                    variant={'outlined'}
                    rows={3}
                    fullWidth
                    multiline
                    className={parentClasses.fields}
                    value={item.exchangeDescription}
                    placeholder="On ..."
                    onChange={(e) => props.modifyPrivateItem({exchangeDescription: e.target.value})}
                  />
                </Grid> : <></>}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};


function mapStateToProps(state) {
  return {
    item: state.item.item,
  };
}

const actionCreators = {
  modifyPrivateItem: itemAdminActions.modifyPrivateItem,
};

export default connect(mapStateToProps, actionCreators)(PricePaper);
