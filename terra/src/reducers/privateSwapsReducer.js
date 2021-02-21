import {swapsConstants} from '../constants';

const initialState = {
  swaps: [],
  messages: [],
  currentSwap: {
    'owner': {},
    'client': {},
    'item': {},
  },
};

export function swaps( state = initialState, action ) {
  switch ( action.type ) {
    case swapsConstants.GET_SWAPS_LIST_SUCCESS:
      return {
        ...state,
        swaps: action.data,
      };
    case swapsConstants.GET_SWAP_SUCCESS:
      return {
        ...state,
        currentSwap: action.data,
      };

    case swapsConstants.GET_MSG_LIST_SUCCESS:
      return {
        ...state,
        messages: action.data,
      };

    case swapsConstants.POST_MSG_LIST_SUCCESS:
      return {
        ...state,
        messages: [
          ...state.messages,
          action.data,
        ],
      };

    case swapsConstants.MODIFY_CURRENT_SWAP:
      return {
        ...state,
        currentSwap: {
          ...state.currentSwap,
          ...action.data,
        },
      };
    case swapsConstants.UPDATE_SWAP_SUCCESS:
      return {
        ...state,
        currentSwap: {
          ...state.currentSwap,
          ...action.data,
        },
      };

    default:
      return state;
  }
}
