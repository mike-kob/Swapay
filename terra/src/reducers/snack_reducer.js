import {snackConstants} from '../constants';

const initState = {
  message: '',
  open: false,
};

export function snackbar( state = initState, action ) {
  switch ( action.type ) {
    case snackConstants.SHOW_SNACKBAR:
      return {
        ...state,
        message: action.data,
        open: true,
      };
    case snackConstants.HIDE_SNACKBAR:
      return {
        ...state,
        message: '',
        open: false,
      };

    default:
      return state;
  }
}
