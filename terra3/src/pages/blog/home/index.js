import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {
  Box,
  Button,
  Card,
  CardMedia,
  Typography,
} from '@material-ui/core';
import Header from '../../../components/Header';
import BlogPostSlot from '../common/BlogPostSlot';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {FormattedMessage, useIntl} from 'react-intl';

import Breadcrumbs from '../../../components/Breadcrumbs';
import Head from 'next/head';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
      width: '60%',
    },
  },
  moreButton: {
    'float': 'right',
    'textTransform': 'none',
    'color': '#FF8C66',
    '&:hover': {
      color: '#DF6C46',
    },
  },
  blogListsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: '5px',
    marginTop: theme.spacing(2),
  },
  blogListTitle: {
    fontWeight: 600,
    marginBottom: '15px',
    color: 'black',
  },
  categoryPosts: {
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    'borderRadius': 0,
    'boxShadow': 'none',
    'position': 'relative',
    'minWidth': '200px',
    'minHeight': '200px',
    'maxHeight': '30%',
    'width': '100%',
    '&:after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      width: '100%',
      height: '100%',
      bottom: 0,
      zIndex: 2,
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
  picture: {
    position: 'absolute',
    top: '-200%',
  },
}));

const CategorySection = (props) => {
  const classes = useStyles(props);
  const {category} = props;

  const url = `/${category.language.toLowerCase()}/blog/${category.slug}`;

  return (
    <div>
      <Link href={url}>
        <a>
          <Typography className={classes.blogListTitle} variant='h5' component='h2'>
            {category.title}
          </Typography>
        </a>
      </Link>
      <div className={classes.categoryPosts}>
        {category.posts.filter((obj) => obj.featured).map((post) => (
          <BlogPostSlot key={post.slug} post={post}/>
        ))}
      </div>
      <Button
        className={classes.moreButton}
        onClick={() => Router.push(url)}
      ><FormattedMessage id="blog.more" defaultMessage="Більше..."/></Button>
    </div>
  );
};

const BlogMainPage = (props) => {
  const classes = useStyles(props);
  const intl = useIntl();
  const {categories} = props;
  const keyGeneral = 'Swapay';
  const keyBlog = (
    <FormattedMessage
      id="blog.blog"
      defaultMessage="Блог"
    />
  );
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{intl.formatMessage({id: 'seo.blog.title'})}</title>
        <meta name="description" content={intl.formatMessage({id: 'seo.blog.description'})}/>
        <link rel="alternate" hrefLang={'uk'} href={'https://swapay.co.ua/uk/blog'}/>
        <link rel="alternate" hrefLang={'ru'} href={'https://swapay.co.ua/ru/blog'}/>

        <meta property="og:title" content="Блог Swapay"/>
        <meta property="og:type" content="website" />
        <meta property="og:description" content={intl.formatMessage({id: 'seo.blog.description'})}/>
        <meta property="og:site_name" content="Swapay"/>
        <meta property="og:url" content={`https://swapay.co.ua/${router.query.lang}/blog`}/>
        <meta property="og:image" content={`https://swapay.co.ua/home430.jpeg`}/>

      </Head>
      <Header onLanguageChange={(lang) => router.push(`/${lang}/blog`)}/>
      <Breadcrumbs
        separator={'>'}
        aria-label="breadcrumb"
        style={{lineHeight: '5px'}}
        links={[
          [keyGeneral, '/'],
          [keyBlog],
        ]}
      />
      <Card className={classes.header}>
        <CardMedia
          className={classes.media}
          component={(props) => (
            <picture>
              {/* Big screen Webp */}
              <source srcSet={'/blog_home.webp'} type="image/webp" media="(min-width: 550px)"/>
              {/* Small screen Webp */}
              <source srcSet={'/home430.webp'} type="image/webp" media="(max-width: 550px)"/>
              {/* Big screen Jpeg */}
              <source srcSet={'/blog_home.jpg'} media="(min-width: 550px)"/>
              {/* Small screen Jpeg*/}
              <img {...props} src={'/home430.jpeg'} alt={'Swapay blog'} className={classes.blogImage}
                style={{marginRight: '10px'}}/>
            </picture>
          )}
          height="140"
          image="/blog_home.jpg"
          alt="Swapay Блог"
        />
      </Card>
      <Box
        className={classes.root}
        display='flex'
        direction='column'
        justifyContent='center'
        alignItems='center'
      >
        <div className={classes.blogListsWrapper}>
          {categories.filter((cat) => cat.posts.length).map((category) => (
            <CategorySection key={category.slug} category={category}/>
          ))}
        </div>
      </Box>
    </>
  );
};

export default BlogMainPage;
