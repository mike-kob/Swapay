import {ssrQueryStatic} from '../../../utils/graphqlSsr';
import {
  BLOG_POST_SLUGS_QUERY,
  BLOG_POST_QUERY,
} from '../../../gql/static';

export const getStaticPaths = async () => {
  const data = await ssrQueryStatic(BLOG_POST_SLUGS_QUERY, {});
  const paths = data.data.blogPosts.map((post) => ({
    params: {
      category: post.category.slug,
      slug: post.slug,
      lang: post.language.toLowerCase(),
    }}));
  const fallback = false;

  return {paths, fallback};
};

export const getStaticProps = async ({params}) => {
  const data = await ssrQueryStatic(BLOG_POST_QUERY, {language: params.lang, slug: params.slug});
  return {
    props: {
      post: data.data.blogPost,
    },
  };
};
