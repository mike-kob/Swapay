import React from 'react';
import {connect} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  IconButton,
} from '@material-ui/core';
import Hamburger from '@material-ui/icons/Menu';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {useRouter} from 'next/router';

import {itemAdminActions} from '@/actionCreators';
import MobileDrawer from './MobileDrawer';
import NotificationMenu from './NotificationMenu';
import Link from '../utils/Link';

export const headerHeight = 70;

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'start',
    height: headerHeight + 'px',
  },
  logo: {},
  rightPanel: {
    marginLeft: 'auto',
  },
  addItemBtn: {
    color: '#6c2919',
    margin: theme.spacing(1),
  },
}));


const MobileHeader = (props) => {
  const [state, setState] = React.useState({
    right: false,
  });
  const anchor = 'right';
  const classes = useStyles();
  const router = useRouter();
  const lang = router.query.lang;
  const {user} = props;

  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({...state, [anchor]: open});
  };

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
        <Link href={'/'}>
          <a><img src="/small-logo.svg" className={classes.logo} /></a>
        </Link>

        <div className={classes.rightPanel}>
          <IconButton onClick={handleAddItem} size="medium">
            <AddCircleIcon className={classes.addItemBtn} fontSize="large" />
          </IconButton>
          <NotificationMenu />
          <IconButton onClick={toggleDrawer(anchor, true)} size="medium">
            <Hamburger fontSize="large" />
          </IconButton>
        </div>
      </Toolbar>
      <MobileDrawer {...{anchor, state, toggleDrawer, user: props.user}} {...props} />
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

export default connect(mapStateToProps, actionCreators)(MobileHeader);
