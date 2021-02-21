import React from 'react';
import {connect} from 'react-redux';
import {
  Paper,
  Typography,
  Grid,
  FormControlLabel,
  Switch,
  Box,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import clsx from 'clsx';

import {itemAdminActions} from '@/actionCreators';


const useStyles = makeStyles((theme) => ({

}));


const StatusPaper = (props) => {
  const classes = useStyles(props);
  const {item, parentClasses} = props;

  return (
    <Paper className={clsx(parentClasses.paper, classes.sidePanel)} style={{minHeight: '150px'}}>

      <Grid container spacing={2}>
        <Typography variant="h6" gutterBottom className={parentClasses.headers}>
          Status
        </Typography>
        <Box m={1}/>
        <FormControlLabel
          control={
            <Switch
              checked={item.activated}
              onChange={(e) => props.modifyPrivateItem({activated: e.target.checked})}
              name="activated"
              color="primary"
            />
          }
          label={item.activated ?
            'Active' :
            'Inactive'
          }
        />
        <Typography variant="body2" gutterBottom>
          {item.activated ?
            'Game item is activated, everybody can find it in catalog' :
            'Game item is inactive. It\'s inaccessible from catalog.'
          }
        </Typography>
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
  updatePrivateItem: itemAdminActions.updatePrivateItem,
  activatePrivateItem: itemAdminActions.activatePrivateItem,
};

export default connect(mapStateToProps, actionCreators)(StatusPaper);
