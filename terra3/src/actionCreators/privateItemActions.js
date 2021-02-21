import {itemConstants} from '@/constants';
import {graphql} from '@/utils';
import {
  ACTIVATE_ITEM_MUTATION,
  CREATE_ITEM_MUTATION,
  DELETE_ITEM_MUTATION,
  UPDATE_ITEM_MUTATION,
  GET_PRIVATE_ITEMS_QUERY,
  ADD_ITEM_PHOTO_MUTATION,
  UPDATE_ITEM_PHOTO_MUTATION,
  DELETE_ITEM_PHOTO_MUTATION,
  GET_ITEM_INFO_QUERY,
  GAME_TAGS_QUERY,
} from '@/gql/privateItem';

function getPrivateItemInfo(id, onSuccess, onError) {
  return (dispatch) => {
    dispatch( {type: itemConstants.GET_ITEM_INFO_REQUEST} );

    graphql.post( '', {query: GET_ITEM_INFO_QUERY, variables: JSON.stringify( {'id': id} )} )
        .then( (response) => {
          if (response.data.data && response.data.data.privateItem) {
            const data = response.data.data.privateItem;
            dispatch({type: itemConstants.GET_ITEM_INFO_SUCCESS, data: data});
            if (onSuccess) {
              onSuccess(data);
            }
          } else {
            const errors = response.errors || response.data.errors;
            dispatch({type: itemConstants.GET_ITEM_INFO_ERROR, data: errors});
            if (onError) {
              onError(errors);
            }
          }
        } );
  };
}

function getPrivateItems(onSuccess, onError) {
  return (dispatch) => {
    dispatch( {type: itemConstants.GET_PRIVATE_ITEMS_REQUEST} );

    graphql.post( '', {query: GET_PRIVATE_ITEMS_QUERY} )
        .then( (response) => {
          if ( response.data.data ) {
            const data = response.data.data.privateItems;
            dispatch({type: itemConstants.GET_PRIVATE_ITEMS_SUCCESS, data: data});
            if (onSuccess) {
              onSuccess(data);
            }
          } else {
            const errors = response.errors || response.data.errors;
            dispatch({type: itemConstants.GET_PRIVATE_ITEMS_ERROR, data: errors});
            if (onError) {
              onError(errors);
            }
          }
        } );
  };
}

function createPrivateItem(onSuccess, onError) {
  return (dispatch) => {
    dispatch({type: itemConstants.CREATE_ITEM_REQUEST});
    const params = {
      title: 'My new game',
    };

    graphql.post('', {query: CREATE_ITEM_MUTATION, variables: JSON.stringify(params)})
        .then((response) => {
          if (response.data.data && response.data.data.createItem.ok) {
            dispatch({type: itemConstants.CREATE_ITEM_SUCCESS, data: response.data.data.createItem.item});

            if (onSuccess) {
              onSuccess(response.data.data.createItem.item.id);
            }
          } else {
            const errors = response.errors || response.data.errors || response.data.data.createItem.errors;
            dispatch({type: itemConstants.CREATE_ITEM_ERROR, data: errors});
            if (onError) {
              onError(errors);
            }
          }
        } );
  };
}

function createItemPhoto(item, public_id, onSuccess, onError) {
  return (dispatch) => {
    dispatch({type: itemConstants.CREATE_ITEM_PHOTO_REQUEST});
    const params = {
      'guid': public_id,
      'item': item,
    };

    graphql.post('', {query: ADD_ITEM_PHOTO_MUTATION, variables: JSON.stringify(params)})
        .then( (response) => {
          if ( response.data.data && response.data.data.createItemPhoto.ok ) {
            const data = response.data.data.createItemPhoto.itemPhoto;
            dispatch({type: itemConstants.CREATE_ITEM_PHOTO_SUCCESS, data: data});
            if (onSuccess) {
              onSuccess(data);
            }
          } else {
            const errors = response.errors || response.data.errors || response.data.data.createItemPhoto.errors;
            dispatch({type: itemConstants.CREATE_ITEM_PHOTO_ERROR, data: errors});
            if (onError) {
              onError(errors);
            }
          }
        });
  };
}

function deleteItemPhoto(id, onSuccess, onError) {
  return (dispatch) => {
    dispatch({type: itemConstants.DELETE_ITEM_PHOTO_REQUEST});

    const params = {
      'id': id,
    };

    graphql.post('', {query: DELETE_ITEM_PHOTO_MUTATION, variables: JSON.stringify(params)})
        .then((response) => {
          if (response.data.data && response.data.data.deleteItemPhoto.ok) {
            dispatch( {type: itemConstants.DELETE_ITEM_PHOTO_SUCCESS, data: id} );

            if (onSuccess) {
              onSuccess(id);
            }
          } else {
            const errors = response.errors || response.data.errors || response.data.data.deleteItemPhoto.errors;
            dispatch({type: itemConstants.DELETE_ITEM_PHOTO_ERROR, data: errors});
            if (onError) {
              onError(errors);
            }
          }
        });
  };
}

function updatePrivateItem(id, data, onSuccess, onError) {
  return (dispatch) => {
    dispatch( {type: itemConstants.UPDATE_ITEM_REQUEST} );

    const params = {
      'id': id,
      'rentPrice': data.rentPrice,
      'sellPrice': data.sellPrice,
      'exchangeDescription': data.exchangeDescription,
      'ukDescription': data.ukDescription,
      'enDescription': data.enDescription,
      'ukTitle': data.ukTitle,
      'enTitle': data.enTitle,
      'ukPreview': data.ukPreview,
      'enPreview': data.enPreview,
      'age': data.age,
      'language': data.language,
      'avgGameTime': data.avgGameTime,
      'deposit': data.deposit,
      'types': data.types,
      'tags': data.tags.map((t) => t.id),
    };

    graphql.post('', {query: UPDATE_ITEM_MUTATION, variables: JSON.stringify(params)})
        .then((response) => {
          if ( response.data.data && response.data.data.updateItem.ok ) {
            const data = response.data.data.updateItem.item;
            dispatch({type: itemConstants.UPDATE_ITEM_SUCCESS, data: data});
            if (onSuccess) {
              onSuccess(data);
            }
          } else {
            const errors = response.errors || response.data.errors || response.data.data.updateItem.errors;
            dispatch({type: itemConstants.UPDATE_ITEM_ERROR, data: errors});
            if (onError) {
              onError(errors);
            }
          }
        });
  };
}

function updateItemPhoto(id, data, onSuccess, onError) {
  return (dispatch) => {
    dispatch({type: itemConstants.UPDATE_ITEM_PHOTO_REQUEST});

    const params = {
      'id': id,
      'main': data.main,
    };

    graphql.post('', {query: UPDATE_ITEM_PHOTO_MUTATION, variables: JSON.stringify(params)})
        .then((response) => {
          if ( response.data.data && response.data.data.updateItemPhoto.ok ) {
            const data = response.data.data.updateItemPhoto.itemPhoto;
            dispatch({type: itemConstants.UPDATE_ITEM_PHOTO_SUCCESS, data: data});
            if (onSuccess) {
              onSuccess(data);
            }
          } else {
            const errors = response.errors || response.data.errors || response.data.data.updateItem.errors;
            dispatch({type: itemConstants.UPDATE_ITEM_PHOTO_ERROR, data: errors});
            if (onError) {
              onError(errors);
            }
          }
        });
  };
}

function deletePrivateItem(id, onSuccess, onError) {
  return (dispatch) => {
    dispatch({type: itemConstants.DELETE_ITEM_REQUEST});

    graphql.post('', {query: DELETE_ITEM_MUTATION, variables: JSON.stringify({'id': id})})
        .then((response) => {
          if ( response.data && response.data.data.deleteItem.ok ) {
            dispatch( {type: itemConstants.DELETE_ITEM_SUCCESS, data: id} );
            if (onSuccess) {
              onSuccess(id);
            }
          } else {
            const errors = response.errors || response.data.errors || response.data.data.deleteItem.errors;
            dispatch({type: itemConstants.DELETE_ITEM_ERROR, data: errors});
            if (onError) {
              onError(errors);
            }
          }
        });
  };
}

function activatePrivateItem(id, activate, onSuccess, onError) {
  return (dispatch) => {
    dispatch({type: itemConstants.ACTIVATE_ITEM_REQUEST});

    graphql.post('', {query: ACTIVATE_ITEM_MUTATION, variables: JSON.stringify({'id': id, 'activate': activate})})
        .then((response) => {
          if (response.data && response.data.data.itemActivation.ok) {
            dispatch({type: itemConstants.ACTIVATE_ITEM_SUCCES, data: activate});
            if (onSuccess) {
              onSuccess();
            }
          } else {
            const errors = response.errors || response.data.errors || response.data.data.itemActivation.errors;
            dispatch({type: itemConstants.ACTIVATE_ITEM_ERROR, data: errors});
            if (onError) {
              onError(errors);
            }
          }
        });
  };
}

function getGameTags(onSuccess, onError) {
  return (dispatch) => {
    dispatch( {type: itemConstants.GET_GAME_TAGS_REQUEST} );

    graphql.post( '', {query: GAME_TAGS_QUERY} )
        .then( (response) => {
          if ( response.data.data ) {
            const data = response.data.data.gameTags;
            dispatch({type: itemConstants.GET_GAME_TAGS_SUCCESS, data: data});
            if (onSuccess) {
              onSuccess(data);
            }
          } else {
            const errors = response.errors || response.data.errors;
            dispatch({type: itemConstants.GET_GAME_TAGS_ERROR, data: errors});
            if (onError) {
              onError(errors);
            }
          }
        } );
  };
}


function modifyPrivateItem(data) {
  return {type: itemConstants.MODIFY_ITEM, data: data};
}

export const itemAdminActions = {
  getPrivateItemInfo,
  createPrivateItem,
  createItemPhoto,
  updateItemPhoto,
  deleteItemPhoto,
  updatePrivateItem,
  deletePrivateItem,
  modifyPrivateItem,
  activatePrivateItem,
  getPrivateItems,
  getGameTags,
};
