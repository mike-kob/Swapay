import {userConstants} from '../constants';

const initialState = {
  currentUser: {
    city: {},
    firstName: '',
    lastName: '',
    items: [],
    username: '',
  },
};

export function user( state = initialState, action ) {
  switch ( action.type ) {
    case userConstants.GET_USER_SUCCESS:
      return {
        ...state,
        currentUser: action.data,
      };

    default:
      return state;
  }
}
