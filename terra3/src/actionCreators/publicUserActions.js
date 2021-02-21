import {userConstants} from '../constants';
import {graphql} from '../utils';
import {PROFILES_QUERY} from '../gql/publicUser';

function getUser(id, onSuccess, onError) {
  return (dispatch) => {
    dispatch({type: userConstants.GET_USER_REQUEST});

    graphql.post('', {query: PROFILES_QUERY, variables: JSON.stringify({ids: [id]})})
        .then((response) => {
          if (response.data) {
            const data = response.data.data.profiles[0];
            dispatch({type: userConstants.GET_USER_SUCCESS, data: data});
            if (onSuccess) {
              onSuccess(data);
            }
          } else {
            dispatch({type: userConstants.GET_USER_ERROR, data: response.errors});
            if (onError) {
              onError(response.errors);
            }
          }
        });
  };
}


export const publicUserActions = {
  getUser,
};
