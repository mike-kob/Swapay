import {authConstants} from '../constants';
import Cookies from 'js-cookie';

const user = Cookies.get('csrftoken');
const initialState = user ? {loggedIn: true} : {};

export function authentication(state = initialState, action) {
  switch (action.type) {
    case authConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
      };

    case authConstants.LOGOUT_SUCCESS:
      return {
        loggedIn: false,
      };

    default:
      return state;
  }
}

const initialRegState = {errors: {}};

export function registration(state = initialRegState, action) {
  switch (action.type) {
    case authConstants.REGISTER_SUCCESS:
      return {
        ...state,
        errors: {},
        success: true,
      };
    case authConstants.REGISTER_ERROR:
      return {
        ...state,
        success: false,
        errors: action.data,
      };
    default:
      return state;
  }
}


const initialResetState = {success: '', error: ''};

export function resetPassword(state = initialResetState, action) {
  switch (action.type) {
    case authConstants.RESET_PASSWORD_REQUEST:
      return state;
    case authConstants.RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        success: true,
      };
    case authConstants.REGISTER_FAILURE:
      return {
        ...state,
        success: false,
        error: action.error,
      };

    default:
      return state;
  }
}
