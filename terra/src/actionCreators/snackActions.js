import {snackConstants} from '../constants';

function showSnackbar(message) {
  return {type: snackConstants.SHOW_SNACKBAR, data: message};
}

function hideSnackbar() {
  return {type: snackConstants.HIDE_SNACKBAR};
}


export const snackActions = {
  showSnackbar,
  hideSnackbar,
};
