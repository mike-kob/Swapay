import React from 'react';
import {connect} from 'react-redux';
import {
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Router from 'next/router';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';

import {itemAdminActions, snackActions} from '@/actionCreators';
import routerPush from '@/utils/routerPush';

const useStyles = makeStyles((theme) => ({
  actionPaper: {
    marginTop: theme.spacing(-3),
  },
}));


const ActionPaper = (props) => {
  const classes = useStyles(props);
  const {item} = props;

  const handleSubmit = () => {
    const id = Router.query.id;

    props.updatePrivateItem(id, item, () => {
      props.activatePrivateItem(id, item.activated, () => {
        props.showSnackbar('Saved');
        routerPush('/profile/games');
      }, (error) => {
        props.showSnackbar(`Error occurred. ${error}`);
      });
    }, (error) => {
      props.showSnackbar(`Error occurred. ${error}`);
    });
  };

  return (
    <Paper className={classes.actionPaper}>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        className={classes.root}
        disablePadding

      >
        <ListItem button onClick={handleSubmit}>
          <ListItemIcon>
            <SaveIcon/>
          </ListItemIcon>
          <ListItemText primary="Save"/>
        </ListItem>
        <ListItem button onClick={() => routerPush('/profile/games')}>
          <ListItemIcon>
            <CloseIcon/>
          </ListItemIcon>
          <ListItemText primary="Cancel"/>
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
  showSnackbar: snackActions.showSnackbar,
};

export default connect(mapStateToProps, actionCreators)(ActionPaper);
