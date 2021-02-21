import React, {useEffect, useRef, useState} from 'react';
import {
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  IconButton,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NewSwap from './NewSwap';
import NewMessage from './NewMessage';
import {privateProfileActions} from '../../../actionCreators';
import CustomText from './CustomText';

const useStyles = makeStyles((theme) => ({
  avatar: {
    cursor: 'pointer',
    backgroundColor: '#982D09',
  },
  popper: {
    marginTop: '3px',
    width: '250px',
  },
  notification: {
    width: '15px',
    backgroundColor: 'white',
    height: '15px',
    borderRadius: '50%',
    position: 'absolute',
    top: '4px',
    right: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
}));


const DesktopMenu = (props) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const classes = useStyles();
  const {user} = props;

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const tick = () => {
    if (localStorage && localStorage.getItem('loggedIn')) {
      props.getNotifications();
    }
  };

  useEffect(() => {
    tick();

    const intervalID = setInterval(
        tick, 60000,
    );
    return () => clearInterval(intervalID);
  }, []);

  let userNotifications = user.notifications;
  if (process.browser && window.location.pathname === '/user/2' && window._control && window._control.quest_1) {
    userNotifications = [
      ...user.notifications,
      {
        type: 'CUSTOM',
        customLink: '/game/83',
        customTitle: 'Привіт шукачам!',
        customText: '#cards|of|conflct',
      },
    ];
  }


  return (
    <>
      <IconButton
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={(e) => {
          setOpen((prevOpen) => !prevOpen);
        }}
        style={{padding: 0, marginRight: 10}}
      >
        {userNotifications.length !== 0 ?
          <NotificationsIcon style={{fontSize: 30, fill: 'white'}}/> :
          <NotificationsIcon style={{fontSize: 30}}/>
        }
        {userNotifications.length !== 0 &&
        <span className={classes.notification}>{userNotifications.length}</span>
        }
      </IconButton>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        placement={'bottom-end'}
        className={classes.popper}
      >
        {({TransitionProps, placement}) => (
          <Grow
            {...TransitionProps}
            style={{transformOrigin: 'center top'}}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList disablePadding autoFocusItem={open} id="menu-list-grow">
                  {userNotifications.length !== 0 ?
                    userNotifications.map((n, i) => {
                      switch (n.type) {
                        case 'NEW_MSG':
                          return <NewMessage key={i} notification={n} user={user}/>;
                        case 'NEW_SWAP':
                          return <NewSwap key={i} notification={n}/>;
                        case 'CUSTOM':
                          return <CustomText
                            key={i}
                            link={n.customLink}
                            textPrimary={n.customTitle}
                            textSecondary={n.customText}
                            icon={n.customIcon}
                          />;
                        default:
                          return <div/>;
                      }
                    }) :
                    <MenuItem disabled>
                      Немає нових сповіщень
                    </MenuItem>
                  }
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};


function mapStateToProps(state) {
  return {
    user: state.privateProfile.privateProfile,
  };
}

const actionCreators = {
  getNotifications: privateProfileActions.getNotifications,
};

export default connect(mapStateToProps, actionCreators)(DesktopMenu);
