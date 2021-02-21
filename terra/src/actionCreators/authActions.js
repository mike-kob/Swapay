import {authConstants} from '../constants';
import {graphql} from '../utils';
import {
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  G_LOGIN_MUTATION,
  SIGNUP_MUTATION,
  G_SIGNUP_MUTATION,
  CHANGE_EMAIL_REQUEST_MUTATION,
  CHANGE_EMAIL_CONFIRM_MUTATION,
  CHANGE_PASSWORD_MUTATION,
  FORGOT_PASSWORD_REQUEST_MUTATION,
  FORGOT_PASSWORD_CONFIRM_MUTATION,
} from '../gql/auth';

function login(data, onSuccess, onError) {
  return (dispatch) => {
    dispatch({type: authConstants.LOGIN_REQUEST});

    const params = {
      'username': data.username,
      'password': data.password,
    };

    graphql.post('', {query: LOGIN_MUTATION, variables: JSON.stringify(params)})
        .then((response) => {
          if (response.data.data && response.data.data.login.ok) {
            localStorage.setItem('loggedIn', 'true');
            dispatch({type: authConstants.LOGIN_SUCCESS});
            if (onSuccess) {
              onSuccess();
            }
          } else {
            const errors = response.errors || response.data.data.login.errors;
            dispatch({type: authConstants.LOGIN_ERROR, data: errors});
            if (onError) {
              onError(errors);
            }
          }
        });
  };
}

function googleLogin(idToken, onSuccess, onError) {
  return (dispatch) => {
    dispatch({type: authConstants.LOGIN_REQUEST});

    const params = {
      'idToken': idToken,
    };

    graphql.post('', {query: G_LOGIN_MUTATION, variables: JSON.stringify(params)})
        .then((response) => {
          if (response.data.data && response.data.data.googleLogin.ok) {
            localStorage.setItem('loggedIn', 'true');
            dispatch({type: authConstants.LOGIN_SUCCESS});
            if (onSuccess) {
              onSuccess();
            }
          } else {
            const errors = response.errors || response.data.data.googleLogin.errors;
            dispatch({type: authConstants.LOGIN_ERROR, data: errors});
            if (onError) {
              onError(errors);
            }
          }
        });
  };
}

function logout(onSuccess) {
  return (dispatch) => {
    dispatch({type: authConstants.LOGOUT_REQUEST});

    graphql.post('', {query: LOGOUT_MUTATION})
        .then((response) => {
          if (response.data.data && response.data.data.logout.ok) {
            localStorage.removeItem('loggedIn');
            dispatch({type: authConstants.LOGOUT_SUCCESS});
            if (onSuccess) {
              onSuccess();
            }
          } else {
            dispatch({type: authConstants.LOGOUT_ERROR, data: response.errors});
          }
        });
  };
}

function signup(data, onSuccess, onError) {
  return (dispatch) => {
    dispatch({type: authConstants.REGISTER_REQUEST});

    const params = {
      'username': data.username,
      'email': data.email,
      'password1': data.password1,
      'password2': data.password2,
    };

    graphql.post('', {query: SIGNUP_MUTATION, variables: JSON.stringify(params)})
        .then((response) => {
          if (response.data.data && response.data.data.signup.ok) {
            localStorage.setItem('loggedIn', 'true');
            dispatch({type: authConstants.REGISTER_SUCCESS});
            if (onSuccess) {
              onSuccess();
            }
          } else {
            const errors = response.errors || JSON.parse(response.data.data.signup.errorsJson);
            dispatch({type: authConstants.REGISTER_ERROR, data: errors});
            if (onError) {
              onError(errors);
            }
          }
        });
  };
}

function googleSignup(idToken, onSuccess, onError) {
  return (dispatch) => {
    dispatch({type: authConstants.REGISTER_REQUEST});

    const params = {
      'idToken': idToken,
    };

    graphql.post('', {query: G_SIGNUP_MUTATION, variables: JSON.stringify(params)})
        .then((response) => {
          if (response.data.data && response.data.data.googleSignup.ok) {
            localStorage.setItem('loggedIn', 'true');
            dispatch({type: authConstants.REGISTER_SUCCESS});
            if (onSuccess) {
              onSuccess();
            }
          } else {
            const errors = response.errors || response.data.data.googleSignup.errors;
            dispatch({type: authConstants.REGISTER_ERROR, data: errors});
            if (onError) {
              onError(errors);
            }
          }
        });
  };
}

function forgotPasswordRequest(email, onSuccess, onError) {
  return (dispatch) => {
    dispatch({type: authConstants.FORGOT_PASSWORD_REQUEST_REQUEST});

    const params = {
      'email': email,
    };

    graphql.post('', {query: FORGOT_PASSWORD_REQUEST_MUTATION, variables: JSON.stringify(params)})
        .then((response) => {
          if (response.data.data && response.data.data.forgotPasswordRequest.ok) {
            dispatch({type: authConstants.FORGOT_PASSWORD_REQUEST_SUCCESS});
            if (onSuccess) {
              onSuccess();
            }
          } else {
            const errors = response.errors || response.data.data.forgotPasswordRequest.errors;
            dispatch({type: authConstants.FORGOT_PASSWORD_REQUEST_ERROR, data: errors});
            if (onError) {
              onError(errors);
            }
          }
        });
  };
}

function forgotPasswordConfirm(data, onSuccess, onError) {
  return (dispatch) => {
    dispatch({type: authConstants.FORGOT_PASSWORD_CONFIRM_REQUEST});

    const params = {
      'token': data.token,
      'password1': data.password1,
      'password2': data.password2,
    };

    graphql.post('', {query: FORGOT_PASSWORD_CONFIRM_MUTATION, variables: JSON.stringify(params)})
        .then((response) => {
          if (response.data.data && response.data.data.forgotPasswordConfirm.ok) {
            dispatch({type: authConstants.FORGOT_PASSWORD_CONFIRM_SUCCESS});
            if (onSuccess) {
              onSuccess();
            }
          } else {
            const errors = response.errors || response.data.data.forgotPasswordConfirm.errors;
            dispatch({type: authConstants.FORGOT_PASSWORD_CONFIRM_ERROR, data: errors});
            if (onError) {
              onError(errors);
            }
          }
        });
  };
}

function changePassword(data, onSuccess, onError) {
  return (dispatch) => {
    dispatch({type: authConstants.CHANGE_PASSWORD_REQUEST});

    const params = {
      'oldPassword': data.oldPassword,
      'password1': data.password1,
      'password2': data.password2,
    };

    graphql.post('', {query: CHANGE_PASSWORD_MUTATION, variables: JSON.stringify(params)})
        .then((response) => {
          if (response.data.data && response.data.data.changePassword &&
						response.data.data.changePassword.ok) {
            dispatch({type: authConstants.CHANGE_PASSWORD_SUCCESS});
            if (onSuccess) {
              onSuccess();
            }
          } else {
            const errors = response.errors ||	response.data.errors ||
						JSON.parse(response.data.data.changePassword.errorsJson);
            let errorText = '';

            if (errors.length) {
              errorText = errors[0].message;
            }
            dispatch({type: authConstants.CHANGE_PASSWORD_ERROR, data: errors});
            if (onError) {
              onError(errorText);
            }
          }
        });
  };
}

function changeEmailRequest(email, onSuccess, onError) {
  return (dispatch) => {
    dispatch({type: authConstants.CHANGE_EMAIL_REQUEST_REQUEST});

    const params = {
      'email': email,
    };

    graphql.post('', {query: CHANGE_EMAIL_REQUEST_MUTATION, variables: JSON.stringify(params)})
        .then((response) => {
          if (response.data.data && response.data.data.changeEmailRequest.ok) {
            dispatch({type: authConstants.CHANGE_EMAIL_REQUEST_SUCCESS});
            if (onSuccess) {
              onSuccess();
            }
          } else {
            const errors = response.errors || response.data.data.changeEmailRequest.errors;
            dispatch({type: authConstants.CHANGE_EMAIL_REQUEST_ERROR, data: errors});
            if (onError) {
              onError(errors);
            }
          }
        });
  };
}

function changeEmailConfirm(data, onSuccess, onError) {
  return (dispatch) => {
    dispatch({type: authConstants.CHANGE_EMAIL_CONFIRM_REQUEST});

    const params = {
      'token': data.token,
    };

    graphql.post('', {query: CHANGE_EMAIL_CONFIRM_MUTATION, variables: JSON.stringify(params)})
        .then((response) => {
          if (response.data.data && response.data.data.changeEmailConfirm.ok) {
            dispatch({type: authConstants.CHANGE_EMAIL_CONFIRM_SUCCESS});
            if (onSuccess) {
              onSuccess();
            }
          } else {
            const errors = response.errors || response.data.data.changeEmailConfirm.errors;
            dispatch({type: authConstants.CHANGE_EMAIL_CONFIRM_ERROR, data: errors});
            if (onError) {
              onError(errors);
            }
          }
        });
  };
}


export const authActions = {
  login,
  googleLogin,
  logout,
  signup,
  googleSignup,
  forgotPasswordRequest,
  forgotPasswordConfirm,
  changePassword,
  changeEmailRequest,
  changeEmailConfirm,
};
