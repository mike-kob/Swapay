import React from 'react';
import {
  Typography,
  List,
  ListItem,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {useRouter} from 'next/router';
import {FormattedMessage, useIntl} from 'react-intl';

import GameSlot from '../../../components/GameSlot';
import Link from '../../../components/utils/Link';
import Breadcrumbs from '../../../components/Breadcrumbs';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1, 2),
  },
  title: {
    fontSize: '28px',
  },
  subtitleInfo: {
    fontSize: '18px',
  },
  subtitle: {
    fontWeight: '600',
    fontSize: '18px',
    lineHeight: '2em',
  },
  buttonsSection: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(2),
  },
  typeButton: {
    margin: theme.spacing(0, 1),
    textTransform: 'none',
    borderRadius: theme.spacing(1),
    borderWidth: theme.spacing(0.25),
    borderColor: theme.palette.primary.main,
    fontSize: '17px',
    lineHeight: '24px',
    color: theme.palette.primary.main,
  },
  gamesSection: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginTop: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
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
  about: {
    marginTop: theme.spacing(1),
  },
  tagList: {},
  tagItem: {
    color: theme.palette.primary.main,
    fontSize: '16px',
  },
  tagLink: {
    color: theme.palette.primary.main,
  },
  showAllLink: {
    float: 'right',
    textDecoration: 'underline',
    color: theme.palette.primary.main,
    fontSize: '14px',
  },
  desktopMainSection: {
    minHeight: '70vh',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      flexDirection: 'row-reverse',
      justifyContent: 'flex-end',
    },
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
    tagContent: {
      margin: theme.spacing(2, 0),
    },
  },
}));

const TagCatalogPage = (props) => {
  const classes = useStyles(props);
  const router = useRouter();
  const intl = useIntl();
  const {tag, tags} = props;
  const tagName = tag[`${router.query.lang}Name`];

  const keyCatalog = intl.formatMessage({id: 'general.catalog'});

  return (
    <>
      <Breadcrumbs
        separator={'>'}
        aria-label="breadcrumb"
        style={{lineHeight: '5px'}}
        links={[
          ['Swapay', '/'],
          [keyCatalog, '/catalog'],
          [tagName],
        ]}
      />
      <div className={classes.root}>
        <div className={classes.desktopMainSection}>
          <div>
            <Typography className={classes.title} variant={'h1'}>
              {intl.formatMessage({id: 'catalog.tag.boardGames'})}
              {' - '}
              {tagName}
            </Typography>
            <div className={classes.gamesSection}>
              {tag.games.slice(0, 10).map((game) => (
                <GameSlot key={game.id} game={game} sourceType={'tag'}/>
              ))}
            </div>
            <div className={classes.tagContent}>
              <div dangerouslySetInnerHTML={{__html: tag[`${router.query.lang}Content`]}}/>
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
                {tags.map((tag) => (
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

      </div>
    </>
  );
};

export default TagCatalogPage;
