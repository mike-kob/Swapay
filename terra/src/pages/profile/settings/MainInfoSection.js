import React, {useState} from 'react';
import {
  Avatar,
  Box,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';

const MainInfoSection = (props) => {
  const {changeProfile, setChangeProfile, classes, privateProfile} = props;
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!changeProfile) {
    return (
      <Box border={1}
        boxShadow={2}
        borderRadius="borderRadius"
        borderColor="#CDCDCD"
        className={classes.padding}
      >
        <Grid spacing={2} container direction={'row'}>
          <Grid item className={classes.containerAvatar}>
            <Avatar className={classes.avatar}
              alt={privateProfile?.username}
              src={privateProfile?.avatar}
            >
            </Avatar>
          </Grid>
          <Grid container item xs={12} sm={8} direction={'column'} className={classes.align}>
            <Typography variant={'h5'}>
              {privateProfile?.firstName + ' ' + privateProfile?.lastName}
            </Typography>
            <Typography variant={'h6'}>
              {'@' + privateProfile?.username}
            </Typography>
            <Grid className={classes.buttons} container item direction={'row'}
              alignContent={'center'}>
              <Grid item xs={12} sm={7}>
                <Button className={clsx(classes.orangeButton, classes.button)}
                  onClick={() => setChangeProfile(true)}
                  variant="contained">
                  Edit profile
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box border={1}
      boxShadow={2}
      borderRadius="borderRadius"
      borderColor="#CDCDCD"
      className={classes.padding}>

      <Grid container>
        <Grid container item>
          <Grid item xs={6}>
            <Typography className={classes.bold} variant="h5">Profile</Typography>
          </Grid>

          <Grid item xs={6} className={classes.edit}>
            <Typography>
              <Link className={classes.link}
                onClick={() => {
                  setChangeProfile(false);
                  props.getPrivateProfile();
                }}
              >Cancel</Link>
            </Typography>
          </Grid>
        </Grid>

        <Box m={0.5}/>

        <Grid container alignItems={'center'} item>
          <Grid item sm={6} xs={12}>
            <Typography className={classes.bold}>Name</Typography>
          </Grid>

          <Grid item sm={6} xs={12}>
            <TextField value={privateProfile.firstName}
              style={{width: '100%'}}
              variant="outlined"
              onChange={(event) => {
                props.modifyPrivateProfile({firstName: event.target.value});
              }}/>
          </Grid>
        </Grid>

        <Box m={0.5}/>

        <Grid container alignItems={'center'} item>
          <Grid item sm={6} xs={12}>
            <Typography className={classes.bold}>Surname: </Typography>
          </Grid>

          <Grid item sm={6} xs={12}>
            <TextField value={privateProfile.lastName}
              style={{width: '100%'}}
              variant="outlined"
              onChange={(event) => {
                props.modifyPrivateProfile({lastName: event.target.value});
              }}/>
          </Grid>
        </Grid>

        <Box m={0.5}/>

        <Grid container alignItems={'center'} item>
          <Grid item sm={6} xs={12}>
            <Typography className={classes.bold}>Username: </Typography>
          </Grid>

          <Grid item sm={6} xs={12}>
            <TextField value={privateProfile.username}
              style={{width: '100%'}}
              variant="outlined"
              error={Boolean(props.errors.username)}
              helperText={props.errors.username ? props.errors.username : ''}
              onChange={(event) => {
                props.modifyPrivateProfile({username: event.target.value});
              }}/>
          </Grid>
        </Grid>

        <Box m={0.5}/>

        <Grid container alignItems={'center'} item>
          <Grid item sm={4} xs={12}>
            <Button style={{width: '100%'}}
              onClick={() => {
                props.editPrivateProfile(privateProfile, () => {
                  props.showSnackbar('Saved');
                  setChangeProfile(false);
                }, () => {
                  props.showSnackbar('Error occurred');
                });
              }}
              className={classes.saveButton}>Save</Button>
          </Grid>
        </Grid>

      </Grid>
    </Box>
  );
};

export default MainInfoSection;
