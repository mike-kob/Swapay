import {userConstants, authConstants} from '../constants';

const initialState = {
  privateProfile: {
    notifications: [],
  },
  snackbar: '',
  errors: {},
};

export function privateProfile(state = initialState, action) {
  switch (action.type) {
    case userConstants.GET_PRIVATE_PROFILE_SUCCESS:
      return {
        ...state,
        privateProfile: action.data,
      };
    case authConstants.LOGOUT_SUCCESS:
      return {
        ...state,
        privateProfile: initialState.privateProfile,
      };

    case userConstants.GET_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        privateProfile: {
          ...state.privateProfile,
          notifications: action.data,
        },
      };

    case userConstants.UPDATE_PRIVATE_PROFILE_SUCCESS:
      return {
        ...state,
        errors: {},
        privateProfile: {
          ...state.privateProfile,
          ...action.data,
        },
      };
    case userConstants.UPDATE_PRIVATE_PROFILE_ERROR:
      return {
        ...state,
        errors: action.data,
      };
    case userConstants.MODIFY_PRIVATE_PROFILE:
      return {
        ...state,
        privateProfile: {
          ...state.privateProfile,
          ...action.data,
        },
      };
    case authConstants.CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        errors: {},
      };
    case authConstants.CHANGE_PASSWORD_ERROR:
      return {
        ...state,
        errors: action.data,
      };
    default:
      return state;
  }
}
