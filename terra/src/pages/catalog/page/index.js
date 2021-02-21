import React, {useState} from 'react';
import {
  Divider,
  Button,
  Drawer,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import {makeStyles} from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import Router from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import Header from '../../../components/Header';
import Breadcrumbs from '../../../components/Breadcrumbs';
import Error from '../../../../pages/404';
import SearchField from '../SearchField';
import {ssrQuery} from '../../../utils/graphqlSsr';
import {SEARCH_QUERY} from '../../../gql/publicCatalog';
import {GAME_TAGS_QUERY} from '../../../gql/privateItem';
import SearchResults from '../SearchResults';
const Filters = dynamic(() => import('../Filters'), {ssr: false});
import {metaDescriptions} from '../seoContent';
import DesktopSearchField from '../DesktopSearchField';

const URL_TYPES = {
  'rent': 'Оренда',
  'buy': 'Покупка',
  'exchange': 'Обмін',
};

const REVERSE_TYPES = {
  'rent': 'R',
  'buy': 'P',
  'exchange': 'E',
};


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
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      flexDirection: 'row',
    },
  },
  results: {
    [theme.breakpoints.up('sm')]: {
      width: '65%',
    },
  },
}));

const CatalogType = (props) => {
  if (props.err) {
    return (<Error statusCode={404}/>);
  }
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('xs'));
  const [openFilters, setOpenFilters] = useState(false);
  const {type, search, gameTags, vars} = props;

  const [params, setParams] = useState({
    price: [0, 100],
    tags: vars.tags || [],
    city: vars.city || undefined,
    page: vars.p || 1,
    keywords: vars.k || '',
  });
  const typeName = URL_TYPES[type];
  const classes = useStyles(props);

  const applySearch = (page) => {
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
    if (type === 'buy' && params.price) {
      // data.price = params.price.join('-');
    }

    const url = '/catalog/' + type + '?' + new URLSearchParams(data).toString();
    Router.push(url);
  };

  return (
    <>
      <Head>
        <title>{typeName} - Swapay</title>
        <meta name={'description'} content={metaDescriptions[type]}/>
      </Head>
      <Header/>
      {matches &&
      <SearchField params={params} setParams={setParams} applySearch={applySearch}/>}
      <Breadcrumbs links={[['Каталог', '/'], [typeName]]}/>
      <Divider className={classes.divider}/>
      <Button
        onClick={() => setOpenFilters(true)}
        className={classes.button}
        startIcon={<FilterListIcon/>}
      >Фільтри</Button>
      <div className={classes.desctopContent}>
        {matches ?
          <Drawer
            anchor={'left'}
            open={openFilters}
            onClose={() => setOpenFilters(false)}
            className={classes.drawer}
            classes={{paper: classes.paper}}
            variant={'persistent'}
          >
            <Filters
              open={openFilters} setOpen={setOpenFilters}
              params={params} setParams={setParams}
              gameTags={gameTags}
              showPrice={false}
              applySearch={applySearch}
            />
          </Drawer> :
          <Filters
            open={openFilters} setOpen={setOpenFilters}
            params={params} setParams={setParams}
            gameTags={gameTags}
            showPrice={false}
            applySearch={applySearch}
          />
        }
        <Divider className={classes.divider}/>
        <div className={classes.results}>
          {!matches && <DesktopSearchField params={params} setParams={setParams} applySearch={applySearch}/>}
          <SearchResults games={search.results} sourceType={type}/>
          <div className={classes.paginationSection}>
            <Pagination
              onChange={(e, val) => {
                setParams({...params, page: val});
                applySearch(val);
              }}
              shape="rounded"
              page={parseInt(params.page)}
              count={search.pages}
              size={'small'}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  if (!URL_TYPES[context.query.type]) {
    return {
      props: {err: true},
    };
  }

  const vars = {
    k: context.query.k || '',
    p: context.query.p || 1,
    swapType: REVERSE_TYPES[context.query.type],
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
        type: context.query.type,
        vars: vars,
      },
    };
  } else {
    return {
      props: {
        games: [],
        gameTags: [],
        type: context.query.type,
        vars: vars,
      },
    };
  }
}

export default CatalogType;
