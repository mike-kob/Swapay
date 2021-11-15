import React, {useState} from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import {
  SwipeableDrawer,
  List,
  Divider,
  ListItem,
  ListItemText,
  Avatar,
  Collapse,
  ListItemIcon,
} from '@material-ui/core';
import {ExpandLess, ExpandMore} from '@material-ui/icons';
import {FormattedMessage, useIntl} from 'react-intl';

import Link from '../utils/Link';
import routerPush from '../../utils/routerPush';
import {useRouter} from 'next/router';


const useStyles = makeStyles((theme) => ({
  textCenter: {
    textAlign: 'center',
  },
  list: {
    width: 250,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  fullList: {
    width: 'auto',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  bottomList: {
    marginTop: 'auto',
  },
  sectionHeader: {
    fontWeight: '600',
  },
  link: {
    color: 'black',
    textDecoration: 'none',
  },
  changeLanguage: {
    margin: 'auto',
    marginTop: theme.spacing(2),
    fontSize: theme.spacing(2.5),
  },
  activeLanguage: {},
  targetLanguage: {
    color: '#982D09',
    cursor: 'pointer',
  },
}));

const ListItemLink = (props) => (
  <ListItem className={props.className}>
    <Link href={props.href}>
      <a className={props.classes.link}>{props.text}</a>
    </Link>
  </ListItem>
);

export default function SwipeableTemporaryDrawer(props) {
  const [open, setOpen] = useState(true);
  const [openProfile, setOpenProfile] = useState(true);
  const classes = useStyles();
  const router = useRouter();
  const intl = useIntl();
  const {anchor, state, toggleDrawer, user} = props;
  const avatarSrc = user.avatar ? {src: user.avatar} : {};

  const lang = router.query.lang;
  const ruProps = {};
  const ukProps = {};
  if (lang === 'uk') {
    if (props.onLanguageChange) {
      ruProps.onClick = () => props.onLanguageChange('en');
    } else {
      ruProps.onClick = () => router.push(router.route.replace('[lang]', 'en'));
    }
  } else {
    if (props.onLanguageChange) {
      ukProps.onClick = () => props.onLanguageChange('uk');
    } else {
      ukProps.onClick = () => router.push(router.route.replace('[lang]', 'uk'));
    }
  }

  return (
    <React.Fragment key={anchor}>
      <SwipeableDrawer
        anchor={anchor}
        open={state[anchor]}
        onClose={toggleDrawer(anchor, false)}
        onOpen={toggleDrawer(anchor, true)}
      >
        <div
          className={clsx(classes.list)}
          role="presentation"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >
          {user.id &&
          <>
            <List disablePadding>
              <ListItem button onClick={(e) => {
                e.stopPropagation();
                setOpenProfile(!openProfile);
              }}>
                <ListItemText
                  classes={{primary: classes.sectionHeader}}
                  primary={intl.formatMessage({id: 'profile.profile', defaultMessage: 'Profile'})}
                />
                {openProfile ? <ExpandLess/> : <ExpandMore/>}
              </ListItem>
              <Divider/>

              <Collapse in={openProfile} collapsedHeight={0}>
                <List component="div" disablePadding>
                  <ListItemLink
                    className={classes.nested}
                    text={intl.formatMessage({id: 'profile.mySwaps', defaultMessage: 'My swaps'})}
                    href="/profile/swaps"
                    classes={classes}
                  />
                  <ListItemLink
                    className={classes.nested}
                    text={intl.formatMessage({id: 'profile.myGames', defaultMessage: 'My games'})}
                    href="/profile/games"
                    classes={classes}
                  />
                  <ListItemLink
                    className={classes.nested}
                    text={intl.formatMessage({id: 'profile.settings', defaultMessage: 'Settings'})}
                    href="/profile/settings"
                    classes={classes}
                  />
                </List>
              </Collapse>
            </List>
            <Divider/>
          </>
          }
          <List disablePadding>
            <ListItem button onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}>
              <ListItemText
                classes={{primary: classes.sectionHeader}}
                primary={<FormattedMessage id="general.catalog" defaultMessage="Catalog"/>}
              />
              {open ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Divider/>

            <Collapse in={open}>
              <List component="div" disablePadding>
                <ListItemLink
                  className={classes.nested}
                  text={<FormattedMessage id="general.general" defaultMessage="Home"/>}
                  href="/"
                  classes={classes}
                />
                <ListItemLink
                  className={classes.nested}
                  text={<FormattedMessage id="general.catalog" defaultMessage="Catalog"/>}
                  href="/catalog"
                  classes={classes}
                />
              </List>
            </Collapse>
          </List>
          <div className={classes.changeLanguage}>
            <span
              className={clsx(lang === 'en' ? classes.activeLanguage : classes.targetLanguage)} {...ruProps}>EN</span>
            {' | '}
            <span
              className={clsx(lang === 'uk' ? classes.activeLanguage : classes.targetLanguage)} {...ukProps}>UK</span>
          </div>
          {user.id ?
            <List className={classes.bottomList}>
              <ListItem onClick={() => Router.push('/logout')}>
                <ListItemIcon><Avatar {...avatarSrc}/></ListItemIcon>
                <ListItemText primary={`${intl.formatMessage({id: 'header.logout', defaultMessage: 'Logout'})} (@${user.username})`}/>
              </ListItem>
            </List> :
            <List className={classes.bottomList}>
              <ListItem>
                <ListItemText
                  classes={{primary: classes.textCenter}}
                  primary={intl.formatMessage({id: 'header.login', defaultMessage: 'Login'})}
                  onClick={() => routerPush('/login')}
                />
                <ListItemText
                  classes={{primary: classes.textCenter}}
                  primary={intl.formatMessage({id: 'header.signup', defaultMessage: 'Sign up'})}
                  onClick={() => routerPush('/signup')}
                />
              </ListItem>
            </List>
          }
        </div>
      </SwipeableDrawer>
    </React.Fragment>
  );
}
