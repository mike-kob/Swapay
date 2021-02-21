import React from 'react';
import {connect} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Button,
} from '@material-ui/core';
import clsx from 'clsx';
import {useRouter} from 'next/router';
import {FormattedMessage} from 'react-intl';

import {itemAdminActions} from '@/actionCreators';
import DesktopMenu from './DesktopMenu';
import NotificationMenu from './NotificationMenu';
import Link from '../utils/Link';

export const headerHeight = 70;

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'start',
    height: headerHeight + 'px',
    padding: '10px',
    [theme.breakpoints.up('xl')]: {
      height: (headerHeight - 10) + 'px',
    },
    [theme.breakpoints.up('sm')]: {
      height: (headerHeight - 20) + 'px',
    },
  },
  leftPanel: {
    lineHeight: '42px',
    marginLeft: 'auto',
    display: 'flex',
    ['@media (max-width:576px)']: {
      display: 'none',
    },
  },
  rightPanel: {
    paddingLeft: '10px',
  },
  rightPanelItem: {
    fontSize: '16px',
    fontWeight: '500',
    color: 'white!important',
    cursor: 'pointer',
    paddingLeft: '25px',
  },
  nav: {
    position: 'relative',
    zIndex: 1,
  },
  changeLanguage: {
    marginRight: theme.spacing(3),
  },
  activeLanguage: {},
  targetLanguage: {
    color: '#982D09',
    cursor: 'pointer',
  },
  addItemButton: {
    'border': '2px solid white',
    'color': 'white',
    'marginRight': theme.spacing(3),
    '&:hover': {
      background: 'white',
      border: '2px solid white',
      color: theme.palette.primary.main,
    },
  },
}));


const DesktopHeader = (props) => {
  const {user} = props;
  const router = useRouter();
  const lang = router.query.lang;
  const ruProps = {};
  const ukProps = {};
  if (lang === 'uk') {
    if (props.onLanguageChange) {
      ruProps.onClick = () => props.onLanguageChange('ru');
    } else {
      ruProps.onClick = () => router.push(router.route.replace('[lang]', 'ru'));
    }
  } else {
    if (props.onLanguageChange) {
      ukProps.onClick = () => props.onLanguageChange('uk');
    } else {
      ukProps.onClick = () => router.push(router.route.replace('[lang]', 'uk'));
    }
  }
  const classes = useStyles();

  const handleAddItem = () => {
    if (user && user.id) {
      props.createPrivateItem((id) => {
        router.push(`/${lang}/profile/game/${id}`);
      });
    } else {
      router.push(`/${lang}/login?next=${encodeURIComponent(`/${lang}/profile/games`)}`);
    }
  };

  return (
    <AppBar position="static" color="primary" elevation={0} className={classes.nav}>
      <Toolbar className={classes.header}>
        <Link href={'/'}><a>
          <img src={'/small-logo.svg'} className={classes.logo}/></a>
        </Link>

        <div className={classes.rightPanel}>
          <Link href={'/catalog'}>
            <a className={classes.rightPanelItem}>
              <FormattedMessage
                id="general.catalog"
                defaultMessage="Catalog"
              />
            </a>
          </Link>
          <Link href="/blog">
            <a className={classes.rightPanelItem}>
              <FormattedMessage
                id="blog.blog"
                defaultMessage="Blog"
              />
            </a>
          </Link>
        </div>
        <div className={classes.leftPanel}>
          <div>
            <Button className={classes.addItemButton} onClick={handleAddItem}>
              <FormattedMessage
                id="general.addItem"
                defaultMessage="Add game"
              />
            </Button>
          </div>
          <div className={classes.changeLanguage}>
            <span
              className={clsx(lang === 'en' ? classes.activeLanguage : classes.targetLanguage)} {...ruProps}>EN</span>
            {' | '}
            <span
              className={clsx(lang === 'uk' ? classes.activeLanguage : classes.targetLanguage)} {...ukProps}>UK</span>
          </div>
          {user && user.id ?
            <>
              <NotificationMenu/>
              <DesktopMenu/>
            </> :
            <>
              <Link href="/login">
                <a className={classes.rightPanelItem}>
                  <FormattedMessage
                    id="header.login"
                    defaultMessage="Login"
                  />
                </a>
              </Link>
              <Link href="/signup">
                <a className={classes.rightPanelItem}>
                  <FormattedMessage
                    id="header.signup"
                    defaultMessage="Sign up"
                  />
                </a>
              </Link>
            </>
          }
        </div>
      </Toolbar>
    </AppBar>
  );
};


function mapStateToProps(state) {
  return {
    user: state.privateProfile.privateProfile,
  };
}

const actionCreators = {
  createPrivateItem: itemAdminActions.createPrivateItem,
};

export default connect(mapStateToProps, actionCreators)(DesktopHeader);
