import React from 'react';
import {
  MenuItem,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import {makeStyles} from '@material-ui/core/styles';
import Router from 'next/router';

const useStyles = makeStyles((theme) => ({
  info: {
    display: 'flex',
    flexDirection: 'column',
    whiteSpace: 'normal',
  },
}));

const CustomText = (props) => {
  const classes = useStyles(props);
  const {textPrimary, textSecondary, link, icon} = props;

  return (
    <MenuItem onClick={async () => {
      Router.push(link);
    }}>
      <ListItemIcon>
        {icon ?
          <img src={icon} alt={textPrimary} width="32px"/> :
          <InfoOutlinedIcon fontSize="large"/>
        }
      </ListItemIcon>
      <ListItemText
        primary={textPrimary || ''}
        secondary={textSecondary || ''}
        classes={{secondary: classes.info}}
      />
    </MenuItem>
  );
};

export default CustomText;
