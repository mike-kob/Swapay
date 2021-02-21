import {searchConstants} from '../constants';

const initialState = {
  filters: {
    types: ['E', 'R', 'P'],
    city: 'Kyiv',
    k: '',
  },
  results: [],
  stats: {
    maxRentPrice: 1000,
    minRentPrice: 0,
    maxSellPrice: 1000,
    minSellPrice: 0,
  },
  cities: [],
  pages: 0,
  page: 0,
  total: 0,
};

export function search( state = initialState, action ) {
  switch ( action.type ) {
    case searchConstants.SEARCH_ITEMS_SUCCESS:
      return {
        ...state,
        ...action.data,
      };

    case searchConstants.MODIFY_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.data,
        },
      };
    case searchConstants.GET_CITIES_SUCCESS:
      return {
        ...state,
        cities: action.data,
      };

    default:
      return state;
  }
}
