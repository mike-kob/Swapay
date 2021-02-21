module.exports = {
  async rewrites() {
    return [{source: '/gql', destination: process.env.PROXY_HOST + '/gql/'}];
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: true,
        statusCode: 301,
      },
    ];
  },
};
