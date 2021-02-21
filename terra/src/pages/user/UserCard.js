import React from 'react';
import {
  Grid,
  Avatar,
  Box,
  Typography,
} from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import {makeStyles} from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  container: {
    width: '550px',
    ['@media (max-width:600px)']: {
      width: '100%',
    },
    margin: 'auto',
    padding: '50px 0',
  },
  avatar: {
    width: 120,
    height: 120,
    cursor: 'pointer',
    ['@media (max-width:600px)']: {
      margin: 'auto',
    },
  },
  button: {
    borderColor: '#FF7438',
    color: '#FF7438',
    margin: '5px',
  },
  regButton: {
    backgroundColor: '#FF7438',
    color: 'white',
    margin: '5px',

  },
  center: {
    ['@media (max-width:600px)']: {
      textAlign: 'center',
    },
  },
  city: {
    ['@media (max-width:600px)']: {
      textAlign: 'center',
    },
  },
  text: {
    fontSize: '17px',
  },
}));


const UserCard = (props) => {
  const classes = useStyles(props);
  const {user} = props;

  return (
    <Box className={classes.container}>
      <Grid container className="center">
        <Grid item xs={12} md={4}>
          <Avatar
            className={classes.avatar}
            src={user.avatar}/>
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography
            variant="h5"
            className={classes.center}
          >{user.firstName + ' ' + user.lastName}</Typography>
          <Typography variant="h6" className={classes.center}>{' @ ' + user.username}</Typography>
          <div className={classes.city}>
            <LocationOnIcon style={{fill: 'red'}}/>
            <Typography
              className={classes.text}
              variant="caption"
            >{user.city ? user.city.name : ''}</Typography>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserCard;
