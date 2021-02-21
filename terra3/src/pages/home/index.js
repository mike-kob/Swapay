import React from 'react';
import Head from 'next/head';
import {useIntl} from 'react-intl';

import Header from '@/components/Header';
import GeneralCatalogPage from './GeneralCatalogPage';
import {ssrQuery} from '@/utils/graphqlSsr';
import {RECOMMENDED_QUERY} from '@/gql/publicCatalog';
import {GAME_TAGS_QUERY} from '@/gql/privateItem';


const GeneralCatalog = (props) => {
  const intl = useIntl();

  return (
    <>
      <Head>
        <title>
          {intl.formatMessage({
            id: 'general.general',
            defaultMessage: 'Home',
          })} - Swapay
        </title>
        <meta name="description" content={intl.formatMessage({id: 'seo.home.description'})}/>
      </Head>
      <Header/>
      <GeneralCatalogPage games={props.games} gameTags={props.gameTags}/>
    </>
  );
};

export async function getServerSideProps(context) {
  const data = await ssrQuery(RECOMMENDED_QUERY, {source: 'general', num: 9}, context);
  const dataTags = await ssrQuery(GAME_TAGS_QUERY, {}, context);

  if (data.data.recommendedGames && dataTags.data.gameTags) {
    return {
      props: {
        games: data.data.recommendedGames,
        gameTags: dataTags.data.gameTags,
      },
    };
  } else {
    return {
      props: {
        games: [],
        gameTags: [],
      },
    };
  }
}

export default GeneralCatalog;
