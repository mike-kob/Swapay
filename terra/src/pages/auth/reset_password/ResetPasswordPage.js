import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {
  Button,
  Container,
  TextField,
  Typography,
} from '@material-ui/core';

import {authActions, snackActions} from '../../../actionCreators';
import {useRouter} from 'next/router';

const headerHeight = 70;

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: '350px',
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
    height: 'calc(100vh - ' + headerHeight + 'px)',
    width: '100%',
    backgroundImage: 'url("/next-static/bgdesign.png")',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  },
  orangeButton: {
    background: 'linear-gradient(90deg, #F46036 0%, #FF965B 100%)',
    color: 'white!important',
  },
}));


function ResetPasswordPage(props) {
  const classes = useStyles();
  const router = useRouter();
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = router.query.token;
    props.forgotPasswordConfirm({
      token,
      password1,
      password2,
    }, () => setSuccess(true), (error) => {
      props.showSnackbar(error);
    });

    setPassword2('');
  };

  if (process.browser && localStorage.getItem('loggedIn')) {
    return router.push('/profile/items');
  }

  if (success) {
    return (
      <div className={classes.root}>
        <Container className={classes.container}>
          <div className={classes.paper}>
            <Typography component="h5" variant="h6">
              Your password was changed. Use it to login to your profile.
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
    <div className={classes.root}>
      <Container className={classes.container}>
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Password reset
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password1}
              error={props.success === false && props.error.password1}
              helperText={props.success === false && Array.isArray(props.error.password1) ?
                props.error.password1.join(',') : ''}
              onChange={(e) => setPassword1(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Confirm password"
              type="password"
              autoComplete="current-password"
              error={password2 !== '' && password1 !== password2}
              helperText={password2 !== '' && password1 !== password2 ?
                'Passwords don\'t match' : ''}
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
            <Button
              disabled={
                !(password2) ||
                !(password1) ||
                password1 !== password2
              }
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.orangeButton}
              onClick={handleSubmit}
            >
              Next
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    loggedIn: state.authentication.loggedIn,
  };
}

const actionCreators = {
  forgotPasswordConfirm: authActions.forgotPasswordConfirm,
  showSnackbar: snackActions.showSnackbar,
};

export default connect(mapStateToProps, actionCreators)(ResetPasswordPage);
