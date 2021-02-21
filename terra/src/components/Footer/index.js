import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Button} from '@material-ui/core';
import InstagramIcon from '@material-ui/icons/Instagram';
import FacebookIcon from '@material-ui/icons/Facebook';
// import TelegramIcon from '@material-ui/icons/Telegram';
import clsx from 'clsx';
import {FormattedMessage} from 'react-intl';

import Link from '../utils/Link';

const useStyles = makeStyles((theme) => ({
  footer: {
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
    padding: theme.spacing(3),
    backgroundColor: '#320400',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    flexFlow: 'wrap',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
  },
  colHalf: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      width: '50%',
    },
  },
  colRow: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    },
  },
  half: {
    width: '50%',
  },
  header: {
    fontSize: '16px',
    fontWeight: 'bold',
    padding: theme.spacing(1.5, 0),
  },
  link: {
    textDecoration: 'none',
    color: 'white',
    padding: theme.spacing(0, 1, 1, 0),
  },
  mid: {
    verticalAlign: 'middle',
  },
  button: {
    color: 'white',
    borderColor: 'white',
    width: theme.spacing(22),
    margin: theme.spacing(1, 0),
  },
  footerEnd: {
    padding: theme.spacing(3),
    backgroundColor: '#1A0200',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      padding: theme.spacing(1),
    },
  },
  swapay: {
    padding: theme.spacing(1, 0),
    [theme.breakpoints.up('sm')]: {
      padding: 0,
    },
  },
  linkSpace: {
    [theme.breakpoints.up('sm')]: {
      marginRight: theme.spacing(2),
    },
  },
}));


const Footer = () => {
  const classes = useStyles();

  return <footer>
    <div className={classes.footer}>
      <div className={classes.row}>
        <div className={clsx(classes.col, classes.half)}>
          <div className={classes.header}>
            <FormattedMessage
              id="footer.mapHeader"
              defaultMessage="Sitemap"
            />
          </div>
          <Link href={'/'} key={'/'}>
            <a className={classes.link}>
              <FormattedMessage
                id="footer.catalogLink"
                defaultMessage="Catalog"
              />
            </a>
          </Link>
          <Link href={'/blog'}>
            <a className={classes.link}>
              <FormattedMessage
                id="blog.blog"
                defaultMessage="Blog"
              />
            </a>
          </Link>
        </div>

        <div className={classes.col}>
          <div className={classes.header}>
            <FormattedMessage
                id="footer.aboutUs"
                defaultMessage="About us"
              />
          </div>
          <Link href={'/blog/info/rules'}>
            <a className={classes.link}>
              <FormattedMessage
                id="footer.swapRules"
                defaultMessage="Swap rules"
              />
            </a>
          </Link>
          <Link href={'/blog/info/about'}>
            <a className={classes.link}>
              <FormattedMessage
                id="footer.whoWeAre"
                defaultMessage="Who we are?"
              />
            </a>
          </Link>
          <a href={'mailto:swapay.service@gmail.com'} className={classes.link}>
            <FormattedMessage
              id="footer.help"
              defaultMessage="Help"
            /></a>
        </div>
      </div>

      <div className={classes.colRow}>
        <div className={classes.colHalf}>
          <div className={classes.header}>
            <FormattedMessage
              id="footer.socialHeader"
              defaultMessage="Social"
            />
          </div>
          <div className={classes.row}>
            <a href={'https://www.instagram.com/swapay/'} className={classes.link}><InstagramIcon
              className={classes.mid}/>Instagram</a>
            <a href={'https://www.facebook.com/SwapayClub'} className={classes.link}><FacebookIcon
              className={classes.mid}/>Facebook</a>
            {/*<a rel="nofollow" href={'https://t.me/swapay_bot'} className={classes.link}><TelegramIcon className={classes.mid}/>Telegram*/}
            {/*  Bot</a>*/}
          </div>
        </div>

        <div className={classes.colHalf}>
          <div className={classes.header}>
            <FormattedMessage
              id="footer.contactsHeader"
              defaultMessage="Contacts"
            />
          </div>
          <div>swapay.service@gmail.com</div>
          <Button
            className={classes.button}
            variant="outlined"
            component={'a'}
            href={'mailto:swapay.service@gmail.com'}
          ><FormattedMessage
              id="footer.emailUs"
              defaultMessage="Email Us"
            /></Button>
        </div>
      </div>
    </div>

    <div className={classes.footerEnd}>
      <div className={clsx(classes.swapay, classes.linkSpace)}>© {(new Date()).getFullYear()} Swapay</div>
      <a href={'/p/privacy-policy/'} className={clsx(classes.link, classes.linkSpace)}>
        <FormattedMessage
          id="footer.privacyPolicy"
          defaultMessage="Privacy policy"
        />
      </a>
      <a href={'/p/terms-and-conditions/'} className={clsx(classes.link, classes.linkSpace)}>
        <FormattedMessage
          id="footer.terms"
          defaultMessage="Terms and conditions"
        />
      </a>
    </div>
  </footer>;
};

export default Footer;
