import React from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {useIntl} from 'react-intl';

import Header from '../../../components/Header';
import TagCatalogPage from './TagCatalogPage';


const TagCatalog = (props) => {
  const router = useRouter();
  const intl = useIntl();
  const {tag, tags} = props;

  const urls = {
    'uk': `/uk/catalog/${tag.ukSlug}`,
    'ru': `/ru/catalog/${tag.ruSlug}`,
  };

  return (
    <>
      <Head>
        <title>
          {intl.formatMessage({id: 'seo.tag.gamesTitle'})}
          {' - '}
          {tag[`${router.query.lang}Name`]}
          {' - Swapay'}
        </title>
        <link rel="alternate" hrefLang={'uk'} href={'https://swapay.co.ua' + urls['uk']}/>
        <link rel="alternate" hrefLang={'ru'} href={'https://swapay.co.ua' + urls['ru']}/>
        <meta name="description" content={tag[`${router.query.lang}MetaDescription`]}/>

        <meta property="og:title" content={tag[`${router.query.lang}Name`]}/>
        <meta property="og:type" content="website"/>
        <meta property="og:description" content={tag[`${router.query.lang}MetaDescription`]}/>
        <meta property="og:site_name" content="Swapay"/>
        <meta property="og:url" content={`https://swapay.co.ua` + urls[router.query.lang]}/>

      </Head>
      <Header onLanguageChange={(lang) => router.push(urls[lang])}/>
      <TagCatalogPage tag={tag} tags={tags}/>
    </>
  );
};


export default TagCatalog;
