import {ssrQueryStatic} from '../../../utils/graphqlSsr';
import {GAME_TAGS_QUERY} from '../../../gql/privateItem';
import {CATALOG_TAG_QUERY} from '../../../gql/static';

export async function getStaticPaths(context) {
  const tags = await ssrQueryStatic(GAME_TAGS_QUERY, {}, context);
  const paths = [];

  for (const tag of tags.data.gameTags) {
    paths.push({
      params: {
        'lang': 'uk',
        'tag': tag.ukSlug,
      },
    });
    paths.push({
      params: {
        'lang': 'ru',
        'tag': tag.ruSlug,
      },
    });
  }

  const fallback = false;
  return {paths, fallback};
}

export async function getStaticProps({params}) {
  const tag = await ssrQueryStatic(CATALOG_TAG_QUERY, {language: params.lang, slug: params.tag});
  const tags = await ssrQueryStatic(GAME_TAGS_QUERY, {});
  return {
    props: {
      tag: tag.data.gameTag,
      tags: tags.data.gameTags.filter((t) => t.id !== tag.data?.gameTag?.id),
    },
  };
}
