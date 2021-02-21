import {publicItemConstants} from '../constants';

const initialState = {
  currentItem: {
    owner: {},
    types: [],
    photos: [],
    reviews: [],
    tags: [],
  },
};

export function publicItem( state = initialState, action ) {
  switch ( action.type ) {
    case publicItemConstants.GET_PUBLIC_ITEM_INFO_SUCCESS:
      return {
        ...state,
        currentItem: action.data,
      };

    case publicItemConstants.WRITE_PUBLIC_ITEM_REVIEW_SUCCESS:
      return {
        ...state,
        currentItem: {
          ...state.currentItem,
          reviews: [
            ...state.currentItem.reviews,
            action.data,
          ],
        },
      };

    default:
      return state;
  }
}
