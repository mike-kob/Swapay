import {searchConstants} from '../constants';
import {SEARCH_QUERY, CITY_QUERY} from '../gql/publicCatalog';
import {graphql} from '../utils';

function getSearchItems(data, onSuccess, onError) {
  return (dispatch) => {
    dispatch({type: searchConstants.SEARCH_ITEMS_REQUEST});

    graphql.post( '', {query: SEARCH_QUERY, variables: JSON.stringify(data)} )
        .then( (response) => {
          if ( response.data ) {
            dispatch( {type: searchConstants.SEARCH_ITEMS_SUCCESS, data: response.data.data.search} );
            if (onSuccess) {
              onSuccess();
            }
          } else {
            const errors = response.errors || response.data.errors;
            dispatch( {type: searchConstants.SEARCH_ITEMS_ERROR, data: errors} );
            if (onError) {
              onError(errors);
            }
          }
        } );
  };
}

function getCities(data, onSuccess, onError) {
  return (dispatch) => {
    dispatch({type: searchConstants.GET_CITIES_REQUEST});

    graphql.post( '', {query: CITY_QUERY} )
        .then( (response) => {
          if ( response.data.data ) {
            dispatch( {type: searchConstants.GET_CITIES_SUCCESS, data: response.data.data.city} );
            if (onSuccess) {
              onSuccess();
            }
          } else {
            const errors = response.errors || response.data.errors;
            dispatch( {type: searchConstants.GET_CITIES_ERROR, data: errors} );
            if (onError) {
              onError(errors);
            }
          }
        } );
  };
}

function modifyFilters(data) {
  return {type: searchConstants.MODIFY_FILTERS, data: data};
}

export const searchActions = {
  getSearchItems,
  getCities,
  modifyFilters,
};
