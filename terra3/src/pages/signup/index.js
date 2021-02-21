import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {GoogleLogin} from 'react-google-login';
import {
  Button,
  Container,
  TextField,
  Typography,
  Grid,
  Link as UILink,
} from '@material-ui/core';
import {useRouter} from 'next/router';
import Link from 'next/link';

import {
  authActions,
  snackActions,
} from '../../actionCreators';
import Header from '../../components/Header';

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
    color: 'white!important',
    marginBottom: theme.spacing(1),
  },
  googleButton: {
    borderColor: '#FF7D54',
    color: '#FF7D54!important',
  },
  link: {
    color: '#A4A4A4!important',
    textDecoration: 'underline',
  },
  register: {
    '&::before': {
      content: 'bla ',
    },
  },
  rules: {
    margin: '15px 0',
  },
}));


function SignUp(props) {
  const classes = useStyles();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const onSuccess = () => {
    if (router.query.next) {
      window.location.href = router.query.next;
    } else {
      window.location.href = `/${router.query.lang}/profile/settings`;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.signup({
      username,
      email,
      password1,
      password2,
    }, () => {
      onSuccess();
      props.showSnackbar('Successfully signed up');
    }, (error) => {
      props.showSnackbar('Error occurred. ' + error);
    });
    setPassword2('');
  };

  const handleGoogleSubmit = (googleUser) => {
    const tokenId = googleUser.getAuthResponse().id_token;
    props.googleSignup(tokenId, () => {
      onSuccess();
      props.showSnackbar('Successfully signed up');
    }, (error) => {
      props.showSnackbar('Error occurred. ' + error);
    });
  };

  const handleGoogleError = (err) => {
    console.error(err);
    props.showSnackbar('Error occurred. ' + err);
  };

  if (props.success) {
    return (
      <div className={classes.root}>
        <Container className={classes.container}>
          <div className={classes.paper}>
            <Typography component="h5" variant="h6">
              We sent to the email you provided. Follow the link from email to finish registration.
            </Typography>
            <Button
              href={'/login'}
              fullWidth
              variant="contained"
              className={classes.orangeButton}
            >Login</Button>
          </div>
        </Container>
      </div>
    );
  }
  return (
    <>
      <Header/>
      <div className={classes.root}>
        <Container className={classes.container}>
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Вітаємо у Swapay!
            </Typography>
            <form className={classes.form} noValidate>

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Username"
                name="username"
                autoComplete="off"
                autoFocus
                error={!props.success && props.errors.username}
                helperText={!props.success && props.errors.username}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="E-mail"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                error={!props.success && props.errors.email}
                helperText={!props.success && props.errors.email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password1"
                label="Password"
                type="password"
                id="password1"
                autoComplete="current-password"
                value={password1}
                error={!props.success && props.errors.password1}
                helperText={!props.success && props.errors.password1}
                onChange={(e) => setPassword1(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password2"
                label="Repeat password"
                type="password"
                id="password2"
                autoComplete="current-password"
                error={password2 !== '' && password1 !== password2}
                helperText={password2 !== '' && password1 !== password2 ?
                  'Паролі не збігаються' : ''}
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />

              <Button
                disabled={
                  !(password2) ||
                  !(password1) ||
                  !(username) ||
                  !(email) ||
                  password1 !== password2
                }
                type="submit"
                fullWidth
                variant="contained"
                className={classes.orangeButton}
                onClick={handleSubmit}
              >
                Sing up
              </Button>
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
                    Sign up with Google
                  </Button>
                )}
                buttonText="Login"
                onSuccess={handleGoogleSubmit}
                onFailure={handleGoogleError}
                cookiePolicy={'single_host_origin'}
              />
              <Grid container justify={'center'} wrap={'wrap'} direction={'row'} className={classes.rules}>
                <Grid item>
                  <Typography variant={'h6'}>
                    {'By registering on our site, you agree to our '}
                    <UILink href="/p/terms-and-conditions" target="_blank">
                      Terms and conditions
                    </UILink>
                    {' and to '}
                    <UILink href="/p/privacy-policy" target="_blank">
                      Privacy policy
                    </UILink>
                  </Typography>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item>
                  <Link className={classes.link} href={'/en/login' + (process.browser ? window.location.search : '')}>
                    <a className={classes.link}>Have account? Login</a>
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
      </div>
    </>
  );
}

function mapStateToProps(state) {
  return {
    loggedIn: state.authentication.loggedIn,
    errors: state.registration.errors,
  };
}

const actionCreators = {
  signup: authActions.signup,
  googleLogin: authActions.googleLogin,
  googleSignup: authActions.googleSignup,
  showSnackbar: snackActions.showSnackbar,
};

export default connect(mapStateToProps, actionCreators)(SignUp);
