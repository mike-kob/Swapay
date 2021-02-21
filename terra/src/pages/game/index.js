import React from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {FormattedMessage} from 'react-intl';

import {ssrQuery} from '../../utils/graphqlSsr';
import {GET_PUBLIC_ITEM_INFO_QUERY} from '../../gql/publicItem';
import Error from '../../../pages/404';
import Header from '../../components/Header';
import Breadcrumbs from '../../components/Breadcrumbs';
import GamePage from './GamePage';

const REVERSE_TYPES = {
  'rent': 'R',
  'buy': 'P',
  'exchange': 'E',
};

export default function Game(props) {
  if (props.err) {
    return (<Error statusCode={404}/>);
  }

  const {game, initType} = props;
  const router = useRouter();
  const lang = router.query.lang;

  const keyGeneral = 'Swapay';
  const keyCatalog = (
    <FormattedMessage
      id="general.catalog"
      defaultMessage="Catalog"
    />
  );


  const image = (game.photos.filter((p) => p.main)[0] || game.photos[0])?.publicId;
  const imageUrl = `https://res.cloudinary.com/swapay/image/upload/c_scale,h_250/${image}`

  return (
    <>
      <Head>
        <title>{game[`${lang}Title`]} - Swapay</title>
        <meta name="description" content={game[`${lang}Preview`]}/>

        {/*  OpenGraph */}
        <meta property="og:title" content={game[`${lang}Title`]}/>
        <meta property="og:type" content="website" />
        <meta property="og:description" content={game[`${lang}Preview`]}/>
        <meta property="og:site_name" content="Swapay"/>
        <meta property="og:image" content={imageUrl}/>
      </Head>

      <Header onLanguageChange={(lang) => router.push(`/${lang}/game/${game.id}`)}/>
      <Breadcrumbs links={[
        [keyGeneral, `/`],
        [keyCatalog, `/catalog`],
        [game[`${router.query.lang}Title`]],
      ]}/>
      <GamePage game={game} initType={initType}/>
    </>
  );
};

export async function getServerSideProps(context) {
  const data = await ssrQuery(GET_PUBLIC_ITEM_INFO_QUERY, {'id': context.query.id}, context);
  if (!data.data.publicItem || !data.data.publicItem.id) {
    return {
      props: {err: true},
    };
  }
  const game = data.data.publicItem;
  const t = REVERSE_TYPES[context.query.st];
  return {
    props: {
      game: game,
      initType: t && game.types && game.types.includes(t) ? t : game.types ? game.types[0] : 'R',
    },
  };
}
