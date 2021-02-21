import React from 'react';
import {
  Box,
  Button,
  Grid, IconButton,
  TextField,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import clsx from 'clsx';


const EmailSection = (props) => {
  const {changeEmail, setChangeEmail, classes, privateProfile} = props;

  if (!changeEmail) {
    return (
      <Box
        border={1} boxShadow={2}
        borderRadius="borderRadius"
        borderColor="#CDCDCD"
        className={clsx(classes.padding, classes.card)}
      >
        <Grid container>
          <Grid container item>
            <Typography className={classes.bold} variant="h5">E-mail</Typography>
            <IconButton onClick={() => setChangeEmail(true)} className={classes.editButton}>
              <EditIcon fontSize={'small'}/>
            </IconButton>
          </Grid>

          <Grid item>
            <Typography>{privateProfile?.email}</Typography>
          </Grid>

        </Grid>
      </Box>
    );
  }

  return (
    <Box border={1} boxShadow={2} borderRadius="borderRadius"
      borderColor="#CDCDCD" className={clsx(classes.padding, classes.card)}>
      <Grid container item>
        <Grid item xs={12}>
            <Typography className={classes.bold} variant="h5">E-mail</Typography>
        </Grid>
        <IconButton onClick={() => {
          props.getPrivateProfile();
          setChangeEmail(false);
        }} className={classes.editButton}>
          <CloseIcon fontSize={'small'}/>
        </IconButton>

        <Grid container item sm={8} xs={12} style={{margin: '15px 0'}}>
          <Typography variant={'body1'}>
            After saving you'll receive email with instructions.
            Only after confirming new address, it will be shown in profile.
          </Typography>
        </Grid>

        <Grid container alignItems={'center'} item>
          <Grid item sm={8} xs={12}>
            <TextField value={privateProfile.email}
              style={{width: '100%'}}
              variant="outlined"
              autoComplete="email"
              className={classes.input}
              size="small"
              onChange={(event) => {
                props.modifyPrivateProfile({email: event.target.value});
              }}/>
          </Grid>
        </Grid>

        <Box m={1}/>

        <Grid container alignItems={'center'} item>
          <Grid item sm={4} xs={12}>
            <Button style={{width: '100%'}}
              onClick={() => {
                props.changeEmailRequest(privateProfile.email, () => {
                  setChangeEmail(false);
                  props.showSnackbar('Confirmation mail was sent to new email');
                }, (error) => {
                  props.showSnackbar(`Error occurred. ${error}`);
                });
              }}
              className={classes.saveButton}>Save</Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmailSection;
