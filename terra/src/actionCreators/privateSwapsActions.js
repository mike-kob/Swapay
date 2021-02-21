import {swapsConstants} from '../constants';
import {
  MESSAGES_QUERY,
  POST_MESSAGE_MUTATION,
  GET_SWAPS_LIST_QUERY,
  EDIT_SWAP_MUTATION,
  CREATE_SWAP_MUTATION,
  GET_SWAP_QUERY,
} from '../gql/mySwaps';
import {graphql} from '../utils';


function getMsgList(swapId, onSuccess, onError) {
  return (dispatch) => {
    dispatch( {type: swapsConstants.GET_MSG_LIST_REQUEST} );

    graphql.post( '', {query: MESSAGES_QUERY, variables: JSON.stringify( {swapId: swapId} )} )
        .then( (response) => {
          if ( response.data.data ) {
            const data = response.data.data.messages;
            dispatch({type: swapsConstants.GET_MSG_LIST_SUCCESS, data: data});
            if (onSuccess) {
              onSuccess(data);
            }
          } else {
            dispatch({type: swapsConstants.GET_MSG_LIST_ERROR, data: response.data.errors});
            if (onError) {
              onError(response.data.errors);
            }
          }
        } );
  };
}

function getSwapsList(onSuccess, onError) {
  return (dispatch) => {
    dispatch({type: swapsConstants.GET_SWAPS_LIST_REQUEST});

    graphql.post('', {query: GET_SWAPS_LIST_QUERY})
        .then( (response) => {
          if ( response.data.data ) {
            const data = response.data.data.swaps;
            dispatch({type: swapsConstants.GET_SWAPS_LIST_SUCCESS, data: data});
            if (onSuccess) {
              onSuccess(data);
            }
          } else {
            dispatch({type: swapsConstants.GET_SWAPS_LIST_ERROR, data: response.data.errors});
            if (onError) {
              onError(response.data.errors);
            }
          }
        } );
  };
}

function getSwap(id, onSuccess, onError) {
  return (dispatch) => {
    dispatch( {type: swapsConstants.GET_SWAP_REQUEST} );

    graphql.post( '', {query: GET_SWAP_QUERY, variables: {id: id}} )
        .then( (response) => {
          if ( response.data.data ) {
            const data = response.data.data.swap;
            dispatch({type: swapsConstants.GET_SWAP_SUCCESS, data: data});
            if (onSuccess) {
              onSuccess(data);
            }
          } else {
            dispatch({type: swapsConstants.GET_SWAP_ERROR, data: response.data.errors});
            if (onError) {
              onError(response.data.errors);
            }
          }
        } );
  };
}

function postMessage(data, onSuccess, onError) {
  return (dispatch) => {
    dispatch( {type: swapsConstants.POST_MSG_LIST_REQUEST} );

    const params = {
      'swap': data.swap,
      'body': data.body,
    };

    graphql.post( '', {query: POST_MESSAGE_MUTATION, variables: JSON.stringify( params )} )
        .then( (response) => {
          if ( response.data && response.data.data.postMessage && response.data.data.postMessage.ok ) {
            const data = response.data.data.postMessage.message;
            dispatch({type: swapsConstants.POST_MSG_LIST_SUCCESS, data: data});
            if (onSuccess) {
              onSuccess(data);
            }
          } else {
            const errors = response.data.errors || response.data.data.postMessage.errors;
            dispatch({type: swapsConstants.POST_MSG_LIST_ERROR, data: errors});
            if (onError) {
              onError(errors);
            }
          }
        } );
  };
}

function editSwap(id, data, onSuccess, onError) {
  return (dispatch) => {
    dispatch( {type: swapsConstants.UPDATE_SWAP_REQUEST} );

    const params = {
      'id': id,
      'type': data.type,
      'accepted': data.accepted,
    };

    graphql.post( '', {query: EDIT_SWAP_MUTATION, variables: JSON.stringify( params )} )
        .then( (response) => {
          if ( response.data.data && response.data.data.updateSwap.ok ) {
            const data = response.data.data.updateSwap.swap;
            dispatch({
              type: swapsConstants.UPDATE_SWAP_SUCCESS,
              data: data,
            });
            if (onSuccess) {
              onSuccess(data);
            }
          } else {
            const errors = response.errors || response.data.errors || response.data.data.updateSwap.errors;

            dispatch({
              type: swapsConstants.UPDATE_SWAP_ERROR,
              data: errors,
            });
            if (onError) {
              onError(errors);
            }
          }
        } );
  };
}

function createSwap(itemId, type, onSuccess, onError) {
  return (dispatch) => {
    dispatch( {type: swapsConstants.CREATE_SWAP_REQUEST} );

    const params = {
      'item': itemId,
      'type': type,
    };

    graphql.post( '', {query: CREATE_SWAP_MUTATION, variables: JSON.stringify( params )} )
        .then( (response) => {
          if ( response.data.data && response.data.data.createSwap.ok ) {
            const data = response.data.data.createSwap.swap;
            dispatch({type: swapsConstants.CREATE_SWAP_SUCCESS, data: data});
            if (onSuccess) {
              onSuccess(data);
            }
          } else {
            const errors = response.errors || response.data.errors || response.data.data.createSwap.errors;
            dispatch({type: swapsConstants.CREATE_SWAP_ERROR, data: errors});
            if (onError) {
              onError(errors);
            }
          }
        } );
  };
}

function modifyCurrentSwap(data) {
  return {type: swapsConstants.MODIFY_CURRENT_SWAP, data: data};
}


export const swapsActions = {
  getMsgList,
  getSwap,
  getSwapsList,
  postMessage,
  editSwap,
  createSwap,
  modifyCurrentSwap,
};
