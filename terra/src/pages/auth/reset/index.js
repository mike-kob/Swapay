import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
} from '@material-ui/core';

import {authActions, snackActions} from '@/actionCreators';
import Header from '@/components/Header';

const headerHeight = 70;

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: '350px',
    margin: 'auto',
    [theme.breakpoints.up(768)]: {
      maxWidth: '400px',
    },
    [theme.breakpoints.up(992)]: {
      maxWidth: '350px',
    },
    [theme.breakpoints.up(1100)]: {
      maxWidth: '400px',
    },
  },
  confirmContainer: {
    maxWidth: '350px',
    [theme.breakpoints.up(768)]: {
      maxWidth: '400px',
    },
    [theme.breakpoints.up(992)]: {
      maxWidth: '500px',
    },
    [theme.breakpoints.up(1100)]: {
      maxWidth: '600px',
    },
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justify: 'center',
    textAlign: 'center',
  },
  root: {
    display: 'flex',
    justify: 'center',
    alignItems: 'center',
    height: 'calc(100vh - ' + headerHeight + 'px)',
    width: '100%',
    backgroundImage: 'url("/bgdesign.png")',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  },
  orangeButton: {
    background: 'linear-gradient(90deg, #F46036 0%, #FF965B 100%)',
    color: 'white!important',
  },
  confirmButton: {
    background: 'linear-gradient(90deg, #F46036 0%, #FF965B 100%)',
    color: 'white!important',
    width: '60%',
  },
}));


const ResetPassword = (props) => {
  const classes = useStyles(props);
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      props.showSnackbar('Enter email');
      return;
    }
    props.forgotPasswordRequest(email, () => {
      setSuccess(true);
    });
  };

  if (success) {
    return (
      <>
        <Header/>

        <div className={classes.root}>
          <Container className={classes.confirmContainer}>
            <div className={classes.paper}>
              <Typography component="h1" variant="h6">
                If you're registered with this email address, you'll receive email with reset instructions
              </Typography>
              <Box m={1}/>
              <Button
                href={'/login'}
                variant="contained"
                className={classes.confirmButton}
              >Увійти</Button>
            </div>
          </Container>
        </div>
      </>
    );
  }

  return (
    <>
      <Header/>

      <div className={classes.root}>
        <Container className={classes.container}>
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Forgot password?
            </Typography>
            <Typography component="p" variant="h6">
              Enter your email
            </Typography>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className={classes.orangeButton}
                onClick={handleSubmit}
              >
                Reset password
              </Button>
            </form>
          </div>
        </Container>
      </div>
    </>
  );
};

function mapStateToProps(state) {
  return state.resetPassword;
}

const actionCreators = {
  forgotPasswordRequest: authActions.forgotPasswordRequest,
  showSnackbar: snackActions.showSnackbar,
};

export default connect(mapStateToProps, actionCreators)(ResetPassword);
