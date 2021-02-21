import React from 'react';
import {
  MenuItem,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import {makeStyles} from '@material-ui/core/styles';
import Router from 'next/router';

const useStyles = makeStyles((theme) => ({
  info: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const NewSwap = (props) => {
  const classes = useStyles(props);
  const {notification} = props;

  return (
    <MenuItem onClick={() => Router.push(`/profile/swap/${notification.swap.id}`)}>
      <ListItemIcon>
        <AddCircleOutlineIcon fontSize="large"/>
      </ListItemIcon>
      <ListItemText
        primary="Новий свап"
        secondary={
          <>
            <span>Від @{notification.swap.client.username}</span>
            <span>На {
              notification.swap.item.title.length > 20 ?
              notification.swap.item.title.slice(0, 20) + '...' :
              notification.swap.item.title
            }</span>
          </>
        }
        classes={{secondary: classes.info}}
      />
    </MenuItem>
  );
};

export default NewSwap;
