import {Box, Button, Typography} from '@material-ui/core';
import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Link from 'next/link';
import Router from 'next/router';
import {FormattedMessage} from 'react-intl';

const useStyles = makeStyles((theme) => ({
  blogTitle: {
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '18px',
    lineHeight: '21px',
    display: 'flex',
    alignItems: 'center',
    color: '#000000',
    margin: 0,
    marginBottom: 5,
    padding: 0,
  },
  blogSub: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '16px',
    display: 'flex',
    alignItems: 'center',
    color: ' #A4A4A4',
    margin: 0,
    marginBottom: 15,
    padding: 0,
  },
  blogButton: {
    'height': '35px',
    'background': '#FF8C66',
    'borderRadius': '8px',
    'fontStyle': 'normal',
    'fontWeight': 600,
    'fontSize': '16px',
    'lineHeight': '19px',
    'display': 'flex',
    'alignItems': 'center',
    'textTransform': 'none',
    'marginTop': 'auto',
    'marginLeft': 'auto',
    'maxWidth': theme.spacing(20),
    '&:hover': {
      background: '#DF6C46',
    },
  },
  blogInfoWrapper: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '60%',
    },
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
  },
  blogImage: {
    width: '100%',
    height: '100%',
  },
  blogImageBox: {
    width: '40%',
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  postRoot: {
    display: 'flex',
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(1),
    overflow: 'hidden',
    maxHeight: theme.spacing(25),
  },
}));


const BlogPostSlot = (props) => {
  const classes = useStyles(props);
  const {post} = props;

  const url = `/${post.language.toLowerCase()}/blog/${post.category.slug}/${post.slug}`;

  return (
    <Paper elevation={2} className={classes.postRoot}>
      <div className={classes.blogImageBox}>
        <picture>
          <source srcSet={(post.image350 || '').replace('.jpeg', '.webp')} type="image/webp"/>
          <img src={post.image350} alt={post.title} className={classes.blogImage} style={{marginRight: '10px'}}/>
        </picture>
      </div>
      <Box direction='column' className={classes.blogInfoWrapper}>
        <Link href={url}>
          <a>
            <Typography className={classes.blogTitle} component='h3'>{post.title}</Typography>
          </a>
        </Link>
        <Typography className={classes.blogSub} component='p'>{post.preview}</Typography>
        <Button
          className={classes.blogButton}
          variant="contained"
          color="primary"
          disableElevation
          onClick={() => Router.push(url)}
        >
          <FormattedMessage id="blog.readNext" defaultMessage="Читати далі"/>
        </Button>
      </Box>
    </Paper>
  );
};

export default BlogPostSlot;
