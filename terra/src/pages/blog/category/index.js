import React from 'react';
import Header from '../../../components/Header';
import Breadcrumbs from '../../../components/Breadcrumbs';
import {FormattedMessage} from 'react-intl';
import {Card, CardMedia, makeStyles, Typography} from '@material-ui/core';
import BlogPostSlot from '../common/BlogPostSlot';
import Router, {useRouter} from 'next/router';
import Head from 'next/head';

import '../common.css';

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
    'minHeight': '200px',
    'maxHeight': '200px',
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
  blogImage: {
    height: '100%',
    width: '100%',
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
  },
  categoryContent: {
    margin: theme.spacing(4, 1),
  },
  categoryPosts: {
    margin: theme.spacing(2, 1),
  },
  picture: {
    position: 'absolute',
    [theme.breakpoints.up('sm')]: {
      top: '-200%',
    },
  },
}));


const BlogCategory = (props) => {
  const classes = useStyles();
  const router = useRouter();
  const {category} = props;

  const keyGeneral = 'Swapay';
  const keyBlog = (
    <FormattedMessage
      id="blog.blog"
      defaultMessage="Блог"
    />
  );

  return (
    <>
      <Head>
        <title>{category.title} - Swapay</title>
        <meta name="description" content={category.metaDescription}/>

        <meta property="og:title" content={category.title}/>
        <meta property="og:type" content="website"/>
        <meta property="og:description" content={category.metaDescription}/>
        <meta property="og:site_name" content="Swapay"/>
        <meta property="og:url" content={`https://swapay.co.ua/${router.query.lang}/blog/${category.slug}`}/>
        <meta property="og:image" content={category.image350}/>

      </Head>
      <Header onLanguageChange={(lang) => Router.push(`/${lang}/blog`)}/>
      <Breadcrumbs
        separator={'>'}
        aria-label="breadcrumb"
        style={{lineHeight: '5px'}}
        links={[
          [keyGeneral, '/'],
          [keyBlog, '/blog'],
          [category.title],
        ]}
      />
      <Card className={classes.header}>
        <CardMedia
          className={classes.media}
          component={(props) => (
            <picture className={classes.picture}>
              {/* Big screen Webp */}
              <source srcSet={(category.image || '').replace('.jpeg', '.webp')} type="image/webp"
                media="(min-width: 430px)"/>
              {/* Small screen Webp */}
              <source srcSet={(category.image350 || '').replace('.jpeg', '.webp')} type="image/webp"
                media="(max-width: 430px)"/>
              {/* Big screen Jpeg */}
              <source srcSet={category.image} media="(min-width: 430px)"/>
              {/* Small screen Jpeg*/}
              <img {...props} src={category.image350} alt={category.title} className={classes.blogImage}
                style={{marginRight: '10px'}}/>
            </picture>
          )
          }
          height="140"
          image={
            category.image
          }
          alt={category.title}
        />
        <div className={classes.title}>
          <Typography component="h1" className={classes.bigTitle}>
            {category.title}
          </Typography>
          <Typography className={classes.subTitle}>
            {category.preview}
          </Typography>
        </div>
      </Card>
      <div
        className={classes.content}
      >
        <div id="category-content" className={classes.categoryContent}
          dangerouslySetInnerHTML={{__html: category.content}}/>
        <div className={classes.categoryPosts}>
          {category.posts.map((post) => (<BlogPostSlot key={post.slug} post={post}/>))}
        </div>
      </div>
    </>
  );
};

export default BlogCategory;
