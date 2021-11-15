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
    'en': `/en/catalog/${tag.enSlug}`,
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
        <meta name="description" content={tag[`${router.query.lang}MetaDescription`]}/>

      </Head>
      <Header onLanguageChange={(lang) => router.push(urls[lang])}/>
      <TagCatalogPage tag={tag} tags={tags}/>
    </>
  );
};


export default TagCatalog;
