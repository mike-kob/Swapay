import {userConstants} from '../constants';
import {graphql} from '../utils';
import {
  GET_PRIVATE_PROFILE_QUERY,
  GET_NOTIFICATIONS_QUERY,
  EDIT_PRIVATE_PROFILE_MUTATION,
  CHANGE_PASSWORD_MUTATION,
} from '../gql/privateProfile';

function getPrivateProfile(onSuccess, onError) {
  return (dispatch) => {
    dispatch( {type: userConstants.GET_PRIVATE_PROFILE_REQUEST} );

    graphql.post( '', {query: GET_PRIVATE_PROFILE_QUERY} )
        .then( (response) => {
          if ( response.data.data ) {
            const data = response.data.data.user;
            dispatch( {type: userConstants.GET_PRIVATE_PROFILE_SUCCESS, data: data} );
            if (onSuccess) {
              onSuccess(data);
            }
          } else {
            dispatch( {type: userConstants.GET_PRIVATE_PROFILE_ERROR, data: response.errors} );
            if (onError) {
              onError(response.errors);
            }
          }
        } );
  };
}

function getNotifications(onSuccess, onError) {
  return (dispatch) => {
    dispatch( {type: userConstants.GET_NOTIFICATIONS_REQUEST} );

    graphql.post( '', {query: GET_NOTIFICATIONS_QUERY} )
        .then( (response) => {
          if ( response.data.data ) {
            const data = response.data.data.user.notifications;
            dispatch( {type: userConstants.GET_NOTIFICATIONS_SUCCESS, data: data} );
            if (onSuccess) {
              onSuccess(data);
            }
          } else {
            dispatch( {type: userConstants.GET_NOTIFICATIONS_ERROR, data: response.errors} );
            if (onError) {
              onError(response.errors);
            }
          }
        } );
  };
}

function editPrivateProfile(data, onSuccess, onError) {
  return (dispatch) => {
    dispatch( {type: userConstants.UPDATE_PRIVATE_PROFILE_REQUEST} );

    const params = {
      'phone': data.phone,
      'username': data.username,
      'firstName': data.firstName,
      'lastName': data.lastName,
      'city': data.city,
    };
    if (data.photo && data.photo.info) {
      params['photo'] = JSON.parse(data.photo.info)['id'];
    } else if (data.photoFile) {
      params['photoFile'] = data.photoFile;
    }
    graphql.post( '', {query: EDIT_PRIVATE_PROFILE_MUTATION, variables: JSON.stringify( params )} )
        .then( (response) => {
          if ( response.data.data && response.data.data.updateUser.ok ) {
            const data = response.data.data.updateUser.user;
            dispatch( {
              type: userConstants.UPDATE_PRIVATE_PROFILE_SUCCESS,
              data: data,
            } );
            if (onSuccess) {
              onSuccess(data);
            }
          } else {
            const errors = response.errors || response.data.errors ||
						JSON.parse(response.data.data.updateUser.errorsJson);
            dispatch({type: userConstants.UPDATE_PRIVATE_PROFILE_ERROR, data: errors});
            if (onError) {
              onError(errors);
            }
          }
        } );
  };
}

function changePassword(data, onSuccess, onError) {
  return (dispatch) => {
    dispatch( {type: userConstants.CHANGE_PASSWORD_REQUEST} );

    graphql.post('', {query: CHANGE_PASSWORD_MUTATION, variables: JSON.stringify(data)})
        .then( (response) => {
          if ( response.data.data && response.data.data.changePassword.ok ) {
            dispatch( {type: userConstants.CHANGE_PASSWORD_SUCCESS} );
            if (onSuccess) {
              onSuccess();
            }
          } else {
            const errors = response.errors || response.data.errors ||response.data.data.changePassword.errors;
            dispatch({type: userConstants.CHANGE_PASSWORD_ERROR, data: errors});
            if (onError) {
              onError(response.errors);
            }
          }
        } );
  };
}

function modifyPrivateProfile(data) {
  return {type: userConstants.MODIFY_PRIVATE_PROFILE, data: data};
}

export const privateProfileActions = {
  getPrivateProfile,
  getNotifications,
  editPrivateProfile,
  changePassword,
  modifyPrivateProfile,
};
