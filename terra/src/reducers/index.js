import {combineReducers} from 'redux';

import {authentication, registration, resetPassword} from './authReducer';
import {snackbar} from './snack_reducer';
import {search} from './public_search_reducer';
import {swaps} from './privateSwapsReducer';
import {item} from './privateItemReducer';
import {publicItem} from './public_item_reducer';
import {user} from './user_reducer';
import {privateProfile} from './privateProfileReducer';

const rootReducer = combineReducers({
  authentication,
  privateProfile,
  registration,
  resetPassword,
  search,
  snackbar,
  swaps,
  item,
  publicItem,
  user,
});

export default rootReducer;
