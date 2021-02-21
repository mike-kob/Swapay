import Router from 'next/router';


export default (url, as = undefined, options = {}) => {
  if (!as) {
    as = `/${Router.query.lang}${url}`;
  }
  Router.push(url, as, options);
};
