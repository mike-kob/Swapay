import React from 'react';
import {
  Box,
  Button,
  Grid, IconButton,
  TextField,
  Typography,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import clsx from 'clsx';
import CloseIcon from '@material-ui/icons/Close';

const PasswordSection = (props) => {
  const {
    changePassword, setChangePassword,
    oldPassword, setOldPassword,
    newPassword, setNewPassword,
    confirmNewPassword, setConfirmNewPassword,
    classes,
  } = props;

  if (!changePassword) {
    return (
      <Box border={1} boxShadow={2} borderRadius="borderRadius"
        borderColor="#CDCDCD" className={clsx(classes.padding, classes.card)}>
        <Grid container>
          <Grid container item>
            <Typography className={classes.bold} variant="h5">Password</Typography>

            <IconButton onClick={() => {
              setChangePassword(true);
              setOldPassword('');
              setNewPassword('');
              setConfirmNewPassword('');
            }} className={classes.editButton}>
              <EditIcon fontSize={'small'}/>
            </IconButton>

          </Grid>

          <Grid item>
            <Typography>It's recommended to change password once a year</Typography>
          </Grid>

        </Grid>
      </Box>
    );
  }

  return (
    <Box border={1} boxShadow={2} borderRadius="borderRadius"
      borderColor="#CDCDCD" className={clsx(classes.padding, classes.card)}>
      <Grid container>
        <Grid container item>

          <Typography className={classes.bold} variant="h5">Password</Typography>
          <IconButton onClick={() => {
            setChangePassword(false);
          }} className={classes.editButton}>
            <CloseIcon fontSize={'small'}/>
          </IconButton>

        </Grid>

        <Box m={0.5}/>

        <Grid container alignItems={'center'} item>
          <Grid item sm={4} xs={12}>
            <Typography className={classes.bold}>Old password: </Typography>
          </Grid>

          <Grid item sm={6} xs={12}>
            <TextField type={'password'}
              style={{width: '100%'}}
              variant="outlined"
              autoComplete="current-password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={classes.input}
              size="small"
            />
          </Grid>
        </Grid>

        <Box m={0.5}/>

        <Grid container alignItems={'center'} item>
          <Grid item sm={4} xs={12}>
            <Typography className={classes.bold}>New password: </Typography>
          </Grid>

          <Grid item sm={6} xs={12}>
            <TextField
              type={'password'}
              style={{width: '100%'}}
              variant="outlined"
              autoComplete="new-password"
              value={newPassword}
              error={Boolean(props.errors.password1)}
              helperText={props.errors.password1 ? props.errors.password1 : ''}
              onChange={(e) => setNewPassword(e.target.value)}
              className={classes.input}
              size="small"
            />
          </Grid>
        </Grid>

        <Box m={0.5}/>

        <Grid container alignItems={'center'} item>
          <Grid item sm={4} xs={12}>
            <Typography className={classes.bold}>Repeat new password: </Typography>
          </Grid>

          <Grid item sm={6} xs={12}>
            <TextField
              type={'password'}
              style={{width: '100%'}}
              variant="outlined"
              autoComplete="new-password"
              value={confirmNewPassword}
              error={confirmNewPassword !== newPassword}
              helperText={confirmNewPassword !== newPassword && 'Паролі не збігаються'}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className={classes.input}
              size="small"
            />
          </Grid>
        </Grid>

        <Box m={0.5}/>

        <Grid container alignItems={'center'} item>
          <Grid item sm={4} xs={12}>
            <Button style={{width: '100%'}}
              onClick={() => {
                props.changePasswordAction({
                  oldPassword: oldPassword,
                  password1: newPassword,
                  password2: confirmNewPassword,
                }, () => {
                  props.showSnackbar('Дані збережено');
                  setChangePassword(false);
                }, (error) => {
                  props.showSnackbar(`Виникла помилка. ${error}`);
                  setConfirmNewPassword('');
                });
              }}
              disabled={
                confirmNewPassword !== newPassword
              }
              className={classes.saveButton}>Save</Button>
          </Grid>
        </Grid>

      </Grid>
    </Box>
  );
};

export default PasswordSection;
