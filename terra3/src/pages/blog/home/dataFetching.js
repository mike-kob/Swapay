import {ssrQueryStatic} from '../../../utils/graphqlSsr';
import {BLOG_HOME_QUERY} from '../../../gql/static';

export const getStaticPaths = async () => {
  return {
    paths: [
      {params: {lang: 'uk'}},
      {params: {lang: 'ru'}},
    ],
    fallback: false,
  };
};

export const getStaticProps = async ({params}) => {
  const data = await ssrQueryStatic(BLOG_HOME_QUERY, {limit: 3});
  return {
    props: {
      categories: data.data.blogCategories.filter((category) => category.language.toLowerCase() === params.lang),
    },
  };
};
