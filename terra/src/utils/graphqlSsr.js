import axios from 'axios';
import cookie from 'cookie';

export async function ssrQuery(query, vars, ctx) {
  console.log('SSR QUERY');
  const cookies = cookie.parse(ctx.req.headers.cookie || '');
  const token = cookies['csrftoken'];

  const headers = !token ? {
    'X-SSRPublic': 'true',
  } : {
    'X-CSRFToken': token,
    'Cookie': ctx.req.headers.cookie || '',
  };

  const res = await axios.post(
      `${process.env.PROXY_HOST}/gql/`,
      {query: query, variables: JSON.stringify(vars)},
      {
        headers: headers,
      });


  return res.data;
}

export async function ssrQueryStatic(query, vars) {
  console.log('SSR STATIC QUERY');

  const headers = {
    'X-SSRPublic': 'true',
  };

  const res = await axios.post(
      process.env.STATIC_HOST + '/gql/',
      {query: query, variables: JSON.stringify(vars)},
      {
        headers: headers,
      });


  return res.data;
}
