import React from 'react';
import {connect} from 'react-redux';
import {
  Paper,
  Link as MuiLink,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

import {itemAdminActions} from '@/actionCreators';

const useStyles = makeStyles((theme) => ({
  actionPaper: {
    marginTop: theme.spacing(2),
  },
}));


const AnchorPaper = (props) => {
  const classes = useStyles(props);

  return (
    <Paper className={classes.actionPaper}>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        className={classes.root}
        disablePadding
      >

        <ListItem button component={MuiLink} href="#main">
          <ListItemText primary={'Main'}/>
        </ListItem>
        <ListItem button component={MuiLink} href="#photo">
          <ListItemText primary={'Photos'}/>
        </ListItem>
        <ListItem button component={MuiLink} href="#price">
          <ListItemText primary={'Price'}/>
        </ListItem>
        <ListItem button component={MuiLink} href="#additional">
          <ListItemText primary={'Additional'}/>
        </ListItem>
      </List>
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

export default connect(mapStateToProps, actionCreators)(AnchorPaper);
