import React, {useState} from 'react';
import {
  Divider,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import {useRouter} from 'next/router';
import Head from 'next/head';
import {FormattedMessage, useIntl} from 'react-intl';

import Header from '../../../components/Header';
import Breadcrumbs from '../../../components/Breadcrumbs';
import SearchResults from '../SearchResults';
import {ssrQuery} from '../../../utils/graphqlSsr';
import {SEARCH_QUERY} from '../../../gql/publicCatalog';
import {GAME_TAGS_QUERY} from '../../../gql/privateItem';
import Link from '../../../components/utils/Link';


const useStyles = makeStyles((theme) => ({
  button: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  paginationSection: {
    margin: theme.spacing(1, 'auto'),
    width: 'fit-content',
  },
  drawer: {
    width: '100%',
  },
  paper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      width: '35%',
      top: '70px',
    },
  },
  divider: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  desctopContent: {
    margin: theme.spacing(1, 2),
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      flexDirection: 'row-reverse',
    },
  },
  results: {
    [theme.breakpoints.up('sm')]: {
      width: '100%',
    },
  },
  categoriesSection: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    },
  },

  tagList: {},
  tagItem: {
    color: theme.palette.primary.main,
    fontSize: '16px',
  },
  tagLink: {
    color: theme.palette.primary.main,
  },
  desktopCategorySection: {
    [theme.breakpoints.up('sm')]: {
      width: '30%',
      flexShrink: '0',
    },
    [theme.breakpoints.up('md')]: {
      width: '20%',
      flexShrink: '0',
    },
    [theme.breakpoints.up('lg')]: {
      width: '15%',
      flexShrink: '0',
    },
  },
  subtitle: {
    fontWeight: '600',
    fontSize: '18px',
    marginTop: theme.spacing(2),
  },
}));

const Catalog = (props) => {
  // const theme = useTheme();
  // const matches = useMediaQuery(theme.breakpoints.down('xs'));
  // const [openFilters, setOpenFilters] = useState(false);
  const {search, vars, gameTags} = props;
  const router = useRouter();
  const intl = useIntl();

  const [params, setParams] = useState({
    price: [0, 100],
    tags: vars.tags || [],
    city: vars.city || undefined,
    page: vars.p || 1,
    keywords: vars.k || '',
  });
  const classes = useStyles(props);

  const applySearch = async (page) => {
    const data = {};
    if (params.city) {
      data.city = params.city;
    }
    if (page) {
      data.p = page;
    } else {
      data.p = 1;
    }
    if (params.tags && params.tags.length) {
      data.tags = params.tags.join(',');
    }
    if (params.keywords) {
      data.k = params.keywords;
    }

    const url = `/${router.query.lang}/catalog?${new URLSearchParams(data).toString()}`;
    router.push(url);
  };
  const keyGeneral = 'Swapay';
  const keyCatalog = (
    <FormattedMessage
      id="general.catalog"
      defaultMessage="Каталог"
    />
  );
  return (
    <>
      <Head>
        <title>{intl.formatMessage({id: 'seo.catalog.title'})}</title>
        <meta name={'description'} content={intl.formatMessage({id: 'seo.catalog.description'})}/>
      </Head>
      <Header/>
      <Breadcrumbs links={[
        [keyGeneral, `/`],
        [keyCatalog],
      ]}/>
      <Divider className={classes.divider}/>
      <div className={classes.desctopContent}>
        <Divider className={classes.divider}/>
        <div className={classes.results}>
          <SearchResults games={search.results} sourceType={'general'}/>
          <div className={classes.paginationSection}>
            <Pagination
              onChange={async (e, val) => {
                setParams({...params, page: val});
                await applySearch(val);
              }}
              shape="rounded"
              page={parseInt(params.page)}
              count={search.pages}
              size={'small'}
            />
          </div>
        </div>
        <div className={classes.desktopCategorySection}>
          <Typography className={classes.subtitle} variant={'h3'}>
            <FormattedMessage
              id="home.categories"
              defaultMessage="Категорії"
            />
          </Typography>
          <div className={classes.categoriesSection}>
            <List dense className={classes.tagList} disablePadding>
              {gameTags.map((tag) => (
                <ListItem
                  key={tag.id}
                  className={classes.tagItem}
                >
                  <Link href={`/catalog/${tag[`${router.query.lang}Slug`]}`}>
                    <a className={classes.tagLink}>{tag[`${router.query.lang}Name`]}</a>
                  </Link>
                </ListItem>
              ))}
            </List>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const vars = {
    k: context.query.k || '',
    p: context.query.p || 1,
    city: context.query.city || '',
    tags: context.query.tags ? context.query.tags.split(',') : [],
  };

  const data = await ssrQuery(SEARCH_QUERY, vars, context);
  const dataTags = await ssrQuery(GAME_TAGS_QUERY, {}, context);

  if (data.data && data.data.search && dataTags.data.gameTags) {
    return {
      props: {
        search: data.data.search,
        gameTags: dataTags.data.gameTags,
        vars: vars,
      },
    };
  } else {
    return {
      props: {
        games: [],
        gameTags: [],
        vars: vars,
      },
    };
  }
}

export default Catalog;
