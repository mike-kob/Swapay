import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';

const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware,
    ),
);

if (process.browser) {
  window._store = store;
}

export default store;
