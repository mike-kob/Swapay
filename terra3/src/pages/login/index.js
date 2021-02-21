import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {useRouter} from 'next/router';
import {GoogleLogin} from 'react-google-login';
import {
  Button,
  Container,
  TextField,
  Grid,
  Typography,
  Box,
} from '@material-ui/core';
import {useIntl} from 'react-intl';

import {
  authActions,
  snackActions,
} from '@/actionCreators';
import Header from '@/components/Header';
import Link from '@/components/utils/Link';

const headerHeight = 70;

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: '350px',
    margin: 'auto',
    [theme.breakpoints.up(768)]: {
      maxWidth: '400px',
    },
    [theme.breakpoints.up(992)]: {
      maxWidth: '400px',
    },
    [theme.breakpoints.up(1100)]: {
      maxWidth: '400px',
    },
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  root: {
    display: 'flex',
    justify: 'center',
    alignItems: 'center',
    position: 'relative',
    height: 'calc(100vh - ' + headerHeight + 'px)',
    width: '100%',
    backgroundImage: 'url("/bgdesign.png")',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  },
  orangeButton: {
    background: 'linear-gradient(90deg, #F46036 0%, #FF965B 100%)',
    color: 'white',
  },
  googleButton: {
    borderColor: '#ff7d54',
    color: '#FF7D54!important',
    marginBottom: '10px',
  },
  link: {
    color: '#A4A4A4!important',
    textDecoration: 'underline',
  },
}));

const SignIn = (props) => {
  const classes = useStyles();
  const router = useRouter();
  const intl = useIntl();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSuccess = () => {
    if (router.query.next) {
      window.location.href = router.query.next;
    } else {
      window.location.href = '/' + router.query.lang;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.login({username, password}, onSuccess, () => {
      props.showSnackbar('Невірні дані');
      setPassword('');
    });
  };

  const handleGoogleSubmit = (googleUser) => {
    const tokenId = googleUser.getAuthResponse().id_token;
    props.googleLogin(tokenId, onSuccess, () => {
      props.showSnackbar(`Виникла помилка. Можливо ви незареєстровані.`);
    });
  };

  const handleGoogleError = (err) => {
    console.error(err);
  };

  return (
    <>
      <Header/>
      <div className={classes.root}>
        <Container className={classes.container}>
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              {intl.formatMessage({id: 'login.loginToProfile', defaultMessage: 'Login to profile'})}
            </Typography>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label={intl.formatMessage({id: 'login.username', defaultMessage: 'Username'})}
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label={intl.formatMessage({id: 'login.password', defaultMessage: 'Password'})}
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Box m={1}/>
              <Button
                type="submit"
                fullWidth
                className={classes.orangeButton}
                onClick={handleSubmit}
              >
                {intl.formatMessage({id: 'login.login', defaultMessage: 'Login'})}
              </Button>
              <Box m={1}/>
              <GoogleLogin
                clientId="50769518237-2rgia2022d3vparskri3t11iq53vmlip.apps.googleusercontent.com"
                render={(renderProps) => (
                  <Button
                    type="submit"
                    fullWidth
                    variant="outlined"
                    className={classes.googleButton}
                    onClick={renderProps.onClick}
                  >
                    {intl.formatMessage({id: 'login.googleLogin', defaultMessage: 'Login with Google'})}
                  </Button>
                )}
                buttonText="Login"
                onSuccess={handleGoogleSubmit}
                onFailure={handleGoogleError}
                cookiePolicy={'single_host_origin'}
              />

              <Grid container>
                <Grid item xs>
                  <Link href="/auth/reset">
                    <a className={classes.link}>{intl.formatMessage({
                      id: 'login.forgotPassword',
                      defaultMessage: 'Forgot passord?'
                    })}</a>
                  </Link>
                </Grid>
                <Grid item>
                  <Link href={'/signup' + (process.browser ? window.location.search : '')}>
                    <a className={classes.link}>
                      {intl.formatMessage({id: 'login.signUp', defaultMessage: 'Sign up'})}
                    </a>
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
      </div>
    </>
  );
};

function mapStateToProps(state) {
  return {
    loggedIn: state.authentication.loggedIn,
  };
}

const actionCreators = {
  login: authActions.login,
  googleLogin: authActions.googleLogin,
  showSnackbar: snackActions.showSnackbar,
};

export default connect(mapStateToProps, actionCreators)(SignIn);
