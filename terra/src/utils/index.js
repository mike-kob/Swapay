import axios from 'axios';
import Cookies from 'js-cookie';

export const graphql = axios.create(
    {
      baseURL: '/gql',
      withCredentials: true,
    },
);

graphql.interceptors.response.use( function( response ) {
  if ( response.data && response.data.errors ) {
    if ( response.data.errors.some( (err) => err.message === 'Unauthorized' ) ) {
      if (localStorage.getItem('loggedIn' )) {
        localStorage.removeItem('loggedIn');
        window.location.href = '/login?next=' + encodeURIComponent(window.location.pathname + window.location.search);
      }
    }
  }
  return response;
}, function( error ) {
  return Promise.reject( error );
} );

graphql.interceptors.request.use(
    (config) => {
      const token = Cookies.get( 'csrftoken' );
      if ( token ) {
        config.headers['X-CSRFToken'] = token;
      }

      return config;
    },
    (error) => Promise.reject( error ),
);
