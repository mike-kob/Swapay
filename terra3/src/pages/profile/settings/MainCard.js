import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {
  Box,
  Grid,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

import {
  privateProfileActions,
  snackActions,
  authActions,
} from '../../../actionCreators';
import MainInfoSection from './MainInfoSection';
import ContactSection from './ContactSection';
import EmailSection from './EmailSection';
import PasswordSection from './PasswordSection';
import TelegramSection from './TelegramSection';
import routerPush from '../../../utils/routerPush';

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      width: '60%',
    },
    [theme.breakpoints.up('md')]: {
      width: '50%',
    },
    width: '80%',
  },
  button: {
    margin: theme.spacing(0.5),
  },
  input: {
    margin: theme.spacing(0.5, 0),
  },
  editButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  label: {
    color: 'black',
    fontWeight: 'bold',
    alignSelf: 'flex-end',
    padding: '0 10px 0 0',
  },
  containerAvatar: {
    margin: 'auto',
    [theme.breakpoints.up(768)]: {
      margin: '0',
    },
  },
  card: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    cursor: 'pointer',
  },
  telegramButton: {
    color: '#279ed8',
    borderColor: '#279ed8',
  },
  padding: {
    padding: theme.spacing(2),
  },
  orangeButton: {
    background: 'linear-gradient(90deg, #F46036 0%, #FF965B 100%)',
    color: 'white',
    fontSize: '12px',
  },
  saveButton: {
    background: 'linear-gradient(90deg, #F46036 0%, #FF965B 100%)',
    color: 'white',
  },
  outlinedButton: {
    borderColor: '#FF7D54',
    color: '#FF7D54!important',
    fontSize: '12px',
  },
  buttons: {
    marginTop: 'auto',
    textAlign: 'center',
    [theme.breakpoints.up(768)]: {
      textAlign: 'flex-start',
    },
  },
  align: {
    alignItems: 'center',
    [theme.breakpoints.up(768)]: {
      alignItems: 'flex-start',
    },
  },
  edit: {
    alignSelf: 'center',
    textAlign: 'end',
  },
  bold: {
    fontWeight: 'bold',
  },
  link: {
    color: '#FF7D54!important',
    cursor: 'pointer',
  },
  formCard: {
    margin: ' 0 20%',
    padding: '25px',
  },
  header: {
    textAlign: 'center',
  },
  height: {
    height: '50px',
  },
}));


const SettingsCard = (props) => {
  useEffect(() => props.getPrivateProfile(), []);
  useEffect(() => {
    if (!props.privateProfile) {
      localStorage.removeItem('loggedIn');
      routerPush('/login');
    }
  });
  const [changePassword, setChangePassword] = useState(false);
  const [changeContactInfo, setChangeContactInfo] = useState(false);
  const [changeEmail, setChangeEmail] = useState(false);
  const [changeProfile, setChangeProfile] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const classes = useStyles(props);
  const {privateProfile} = props;

  return (
    <Grid className={classes.root}>
      {/* CHANGE MAIN PROFILE SECTION */}
      <MainInfoSection {...{changeProfile, setChangeProfile, classes}} {...props}/>
      <Box m={2}/>

      {/* CONTACT SECTION */}
      <ContactSection {...{changeContactInfo, setChangeContactInfo, classes}} {...props}/>
      <Box m={2}/>

      {/* EMAIL SECTION */}
      <EmailSection {...{changeEmail, setChangeEmail, classes}} {...props}/>
      <Box m={2}/>

      {/* PASSWORD SECTION */}
      {(privateProfile ) &&
      <>
        <PasswordSection
          {...{oldPassword, setOldPassword, newPassword, setNewPassword, classes}}
          {...{confirmNewPassword, setConfirmNewPassword, changePassword, setChangePassword}}
          {...props}/>
        <Box m={2}/>
      </>
      }

      {/* TELEGRAM SECTION */}
      {/*{privateProfile &&*/}
      {/*  <TelegramSection*/}
      {/*    {...{telegram: privateProfile.telegram, classes}} {...props}*/}
      {/*  />*/}
      {/*}*/}

    </Grid>
  );
};


function mapStateToProps(state) {
  return {
    privateProfile: state.privateProfile.privateProfile,
    errors: state.privateProfile.errors,
  };
}

const actionCreators = {
  getPrivateProfile: privateProfileActions.getPrivateProfile,
  editPrivateProfile: privateProfileActions.editPrivateProfile,
  modifyPrivateProfile: privateProfileActions.modifyPrivateProfile,
  changeEmailRequest: authActions.changeEmailRequest,
  changePasswordAction: authActions.changePassword,
  showSnackbar: snackActions.showSnackbar,
};


export default connect(mapStateToProps, actionCreators)(SettingsCard);
