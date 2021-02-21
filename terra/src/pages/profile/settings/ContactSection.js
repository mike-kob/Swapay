import React from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  IconButton,
} from '@material-ui/core';
import clsx from 'clsx';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';

import ChooseCity from '@/components/ChooseCity';

const ContactSection = (props) => {
  const {changeContactInfo, setChangeContactInfo, classes, privateProfile} = props;

  if (!changeContactInfo) {
    return (
      <Box border={1}
        boxShadow={2}
        borderRadius="borderRadius"
        borderColor="#CDCDCD"
        className={clsx(classes.padding, classes.card)}>
        <Grid container>
          <Grid container item>
            <Typography className={classes.bold} variant="h5">Contact details</Typography>

            <IconButton onClick={() => setChangeContactInfo(true)} className={classes.editButton}>
              <EditIcon fontSize={'small'}/>
            </IconButton>
          </Grid>

          <Box m={0.5}/>

          <Grid container item>
            <Grid item sm={2} xs={6}>
              <Typography className={classes.bold}>City: </Typography>
            </Grid>

            <Grid item sm={10} xs={6}>
              <Typography>
                {privateProfile?.city ? privateProfile.city.name : ''}
              </Typography>
            </Grid>
          </Grid>
          <Box m={0.5}/>
          <Grid container item>
            <Grid item sm={2} xs={6}>
              <Typography className={classes.bold}>Phone: </Typography>
            </Grid>

            <Grid item sm={10} xs={6}>
              <Typography>
                {privateProfile?.phone || ''}
              </Typography>
            </Grid>
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
          <Typography className={classes.bold} variant="h5">Contact details</Typography>

          <IconButton onClick={() => {
            props.getPrivateProfile();
            setChangeContactInfo(false);
          }} className={classes.editButton}>
            <CloseIcon fontSize={'small'}/>
          </IconButton>

        </Grid>

        <Box m={0.5}/>

        <Grid container alignItems={'center'} item>
          <Grid item sm={2} xs={12}>
            <Typography className={classes.bold}>City: </Typography>
          </Grid>

          <Grid item sm={6} xs={12}>
            <ChooseCity
              city={privateProfile?.city}
              freeSolo={true}
              onChange={(e, newValue) => {
                if (newValue.inputValue) {
                  props.modifyPrivateProfile({'city': {id: null, name: newValue.inputValue}});
                } else {
                  props.modifyPrivateProfile({'city': newValue});
                }
              }}
            />
          </Grid>
        </Grid>

        <Box m={0.5}/>

        <Grid container alignItems={'center'} item>
          <Grid item sm={2} xs={12}>
            <Typography className={classes.bold}>Contacts: </Typography>
          </Grid>

          <Grid item sm={6} xs={12}>
            <TextField
              value={privateProfile?.phone || ''}
              style={{width: '100%'}}
              variant="outlined"
              size="small"
              className={classes.input}
              label="Phone, telegram, etc"
              helperText="IMPORTANT. This info will be shown to swap initiator after your confirmation"
              onChange={(event) => {
                props.modifyPrivateProfile({phone: event.target.value});
              }}/>
          </Grid>
        </Grid>
        <Box m={0.5}/>
        <Grid container alignItems={'center'} item>
          <Grid item sm={2} xs={12}>

          </Grid>

          <Grid item sm={4} xs={12}>
            <Button
              className={classes.saveButton}
              style={{width: '100%'}}
              onClick={() => {
                props.editPrivateProfile(privateProfile, () => {
                  props.showSnackbar('Saved');
                  setChangeContactInfo(false);
                });
              }}
            >Save</Button>
          </Grid>
        </Grid>

      </Grid>
    </Box>
  );
};

export default ContactSection;
