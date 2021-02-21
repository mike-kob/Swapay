import {ssrQueryStatic} from '../../../utils/graphqlSsr';
import {
  BLOG_CATEGORY_SLUGS_QUERY,
  BLOG_CATEGORY_QUERY,
} from '../../../gql/static';

export const getStaticPaths = async () => {
  const data = await ssrQueryStatic(BLOG_CATEGORY_SLUGS_QUERY, {});
  const paths = data.data.blogCategories.map((cat) => ({
    params: {
      category: cat.slug,
      lang: cat.language.toLowerCase(),
    }}));
  const fallback = false;

  return {paths, fallback};
};

export const getStaticProps = async ({params}) => {
  const data = await ssrQueryStatic(BLOG_CATEGORY_QUERY, {language: params.lang, slug: params.category, limit: 20});
  return {
    props: {
      category: data.data.blogCategory,
    },
  };
};
