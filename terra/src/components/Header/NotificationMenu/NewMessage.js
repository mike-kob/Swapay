import React from 'react';
import {
  MenuItem,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import {makeStyles} from '@material-ui/core/styles';
import Router from 'next/router';

const useStyles = makeStyles((theme) => ({
  info: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const NewMessage = (props) => {
  const classes = useStyles(props);
  const {notification, user} = props;

  return (
    <MenuItem onClick={() => Router.push(`/profile/swap/${notification.swap.id}`)}>
      <ListItemIcon>
        <MailOutlineIcon fontSize="large"/>
      </ListItemIcon>
      <ListItemText
        primary="Нове повідомлення"
        secondary={
          <>
            {user.id === notification.swap.client ?
              <span>Від @{notification.swap.owner.username}</span> :
              <span>Від @{notification.swap.client.username}</span>
            }
            <span>На {
              notification.swap.item.title.length > 17 ?
              notification.swap.item.title.slice(0, 17) + '...' :
              notification.swap.item.title
            }</span>
          </>
        }
        classes={{secondary: classes.info}}
      />
    </MenuItem>
  );
};

export default NewMessage;
