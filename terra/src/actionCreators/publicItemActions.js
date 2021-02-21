import {publicItemConstants} from '../constants';
import {graphql} from '../utils';
import {
  GET_PUBLIC_ITEM_INFO_QUERY,
  WRITE_PUBLIC_ITEM_REVIEW_MUTATION,
} from '../gql/publicItem';

function getPublicItemInfo( id, onSuccess ) {
  return (dispatch) => {
    dispatch( {type: publicItemConstants.GET_PUBLIC_ITEM_INFO_REQUEST} );

    graphql.post( '', {query: GET_PUBLIC_ITEM_INFO_QUERY, variables: JSON.stringify( {'id': id} )} )
        .then( (response) => {
          if ( response.data.data ) {
            dispatch( {type: publicItemConstants.GET_PUBLIC_ITEM_INFO_SUCCESS, data: response.data.data.publicItem} );
            if ( onSuccess ) {
              onSuccess( response.data.data.publicItem );
            }
          } else {
            dispatch( {type: publicItemConstants.GET_PUBLIC_ITEM_INFO_ERROR, data: response.errors || response.data.errors} );
          }
        } );
  };
}


function writePublicItemReview( itemId, data, callback ) {
  return (dispatch) => {
    dispatch( {type: publicItemConstants.WRITE_PUBLIC_ITEM_REVIEW_REQUEST} );
    const params = {
      'item': itemId,
      'stars': data.stars,
      'comment': data.comment,
    };

    graphql.post( '', {query: WRITE_PUBLIC_ITEM_REVIEW_MUTATION, variables: JSON.stringify( params )} )
        .then( (response) => {
          if ( response.data.data && response.data.data.writeItemReview.ok ) {
            dispatch( {type: publicItemConstants.WRITE_PUBLIC_ITEM_REVIEW_SUCCESS, data: response.data.data.writeItemReview.itemReview} );

            if ( callback ) {
              callback( response.data.data.writeItemReview.itemReview.id );
            }
          } else {
            dispatch( {
              type: publicItemConstants.WRITE_PUBLIC_ITEM_REVIEW_ERROR, data: response.errors ||
                            response.data.errors ||
                            response.data.data.writeItemReview.errors,
            } );
          }
        } );
  };
}

function selectPhoto( photo ) {
  return {type: publicItemConstants.SELECT_PHOTO, data: photo};
}

export const publicItemActions = {
  getPublicItemInfo,
  writePublicItemReview,
  selectPhoto,
};
