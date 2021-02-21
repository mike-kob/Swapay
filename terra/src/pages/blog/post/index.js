import React from 'react';
import {
  Box,
  Card,
  CardMedia,
  makeStyles,
  Typography,
} from '@material-ui/core';
import Head from 'next/head';
import {FormattedMessage} from 'react-intl';
import Router, {useRouter} from 'next/router';

import Header from '../../../components/Header';
import Breadcrumbs from '../../../components/Breadcrumbs';


const useStyles = makeStyles((theme) => ({
  breadcrumb: {
    fontStyle: 'normal',
    fontSize: '15px',
    fontWeight: 500,
    color: 'grey',
    lineHeight: '5px',
  },
  header: {
    'borderRadius': 0,
    'boxShadow': 'none',
    'position': 'relative',
    'minWidth': '200px',
    'height': '200px',
    'margin': 'auto',
    '&:after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      width: '100%',
      height: '100%',
      bottom: 0,
      zIndex: 2,
      background: 'rgba(50, 4, 0, 0.5)',
    },
  },
  media: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  title: {
    fontStyle: 'normal',
    position: 'absolute',
    zIndex: '3',
    bottom: '20px',
    left: '15px',
    color: 'white',
    width: '100%',
    maxWidth: '800px',
  },
  bigTitle: {
    fontWeight: 600,
    fontSize: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      fontSize: theme.spacing(5),
    },
  },
  subTitle: {
    fontWeight: 400,
    fontSize: '14px',
  },
  content: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '16px',
    lineHeight: '19px',
    width: '100%',
    maxWidth: '800px',
    margin: 'auto',
    padding: theme.spacing(2),
  },
  picture: {
    [theme.breakpoints.up('sm')]: {
      position: 'absolute',
      top: '-100%',
    },
  },
  blogImage: {
    height: '100%',
    width: '100%',
  },
}));

export const BlogPost = (props) => {
  const classes = useStyles();
  const {post} = props;
  const router = useRouter();
  const lang = router.query.lang;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://swapay.co.ua/${lang}/blog/${post.category.slug}/${post.slug}`,
    },
    'headline': post.title,
    'image': [
      post.image,
    ],
    'datePublished': post.created,
    'author': {
      '@type': 'Organization',
      'name': 'Swapay',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://d2rt9dkips8u3p.cloudfront.net/94ddf3b5-2766-4cb6-ab4e-30e116cafec0.jpeg',
      },
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Apple Fostering',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://d2rt9dkips8u3p.cloudfront.net/94ddf3b5-2766-4cb6-ab4e-30e116cafec0.jpeg',
      },
    },
    'articleBody': post.content,
    'description': post.preview,
  };

  const keyGeneral = 'Swapay';
  const keyBlog = (
    <FormattedMessage
      id="blog.blog"
      defaultMessage="Блог"
    />
  );

  return (
    <div>
      <Head>
        <title>{post.title} - Swapay</title>
        {post.metaDescription && <meta name="description" content={post.metaDescription}/>}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
        />
        <meta property="og:title" content={post.title}/>
        <meta property="og:type" content="article" />
        <meta property="og:description" content={post.preview}/>
        <meta property="og:site_name" content="Swapay"/>
        <meta property="og:url" content={`https://swapay.co.ua/${lang}/blog/${post.category.slug}/${post.slug}`}/>
        <meta property="og:image" content={post.image350}/>

      </Head>
      <Header onLanguageChange={(lang) => Router.push(`/${lang}/blog`)}/>
      <Box px={1.5}>
        <Breadcrumbs
          separator={'>'}
          aria-label="breadcrumb"
          style={{lineHeight: '5px'}}
          links={[
            [keyGeneral, '/'],
            [keyBlog, '/blog'],
            [post.category.title, '/blog/' + post.category.slug],
            [post.title],
          ]}
        />
      </Box>
      <Card className={classes.header}>
        <CardMedia
          className={classes.media}
          component={(props) => (
            <picture className={classes.picture}>
              {/* Big screen Webp */}
              <source
                srcSet={(post.image || '').replace('.jpeg', '.webp')} type="image/webp"
                media="(min-width: 450px)"/>
              {/* Small screen Webp */}
              <source
                srcSet={(post.image350 || '').replace('.jpeg', '.webp')} type="image/webp"
                media="(max-width: 450px)"/>
              {/* Big screen Jpeg */}
              <source
                srcSet={post.image} media="(min-width: 450px)"/>
              {/* Small screen Jpeg*/}
              <img
                {...props} src={post.image350} alt={post.title} className={classes.blogImage}
                style={{marginRight: '10px'}}/>
            </picture>
          )}
          height="140"
          image={
            post.image
          }
          alt={post.title}
        />
        <div className={classes.title}>
          <Typography component="h1" className={classes.bigTitle}>
            {post.title}
          </Typography>
          <Typography className={classes.subTitle}>
            {new Date(post.created).toLocaleDateString()}
          </Typography>
        </div>
      </Card>
      <main
        id="content"
        className={classes.content}
        dangerouslySetInnerHTML={{__html: post.content}}
      />
    </div>
  );
};

export default BlogPost;
