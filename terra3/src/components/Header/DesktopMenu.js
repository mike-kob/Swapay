import React, {useRef, useState} from 'react';
import {
  Avatar,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {useRouter} from 'next/router';
import {FormattedMessage} from 'react-intl';

const useStyles = makeStyles((theme) => ({
  avatar: {
    cursor: 'pointer',
    backgroundColor: '#982d09',
  },
  popper: {
    marginTop: '3px',
  },
}));


const DesktopMenu = (props) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const classes = useStyles();
  const router = useRouter();
  const {user} = props;

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };


  return (
    <>
      <Avatar
        alt={user.username}
        src={user.avatar}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={(e) => {
          setOpen((prevOpen) => !prevOpen);
        }} color="inherit"
        className={classes.avatar}/>

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
                <MenuList autoFocusItem={open} id="menu-list-grow">
                  <MenuItem onClick={() => {
                    router.push(`/${router.query.lang}/profile/swaps`);
                  }}>
                    <FormattedMessage
                      id="profile.mySwaps"
                      defaultMessage="My swaps"
                    />
                  </MenuItem>
                  <MenuItem onClick={() => {
                    router.push(`/${router.query.lang}/profile/games`);
                  }}>
                    <FormattedMessage
                      id="profile.myGames"
                      defaultMessage="My games"
                    />
                  </MenuItem>
                  <MenuItem onClick={() => {
                    router.push(`/${router.query.lang}/profile/settings`);
                  }}>
                    <FormattedMessage
                      id="profile.settings"
                      defaultMessage="Settings"
                    />
                  </MenuItem>
                  <MenuItem onClick={() => {
                    router.push(`/${router.query.lang}/logout`);
                  }}>
                    <FormattedMessage
                      id="header.logout"
                      defaultMessage="Logout"
                    />
                  </MenuItem>
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

const actionCreators = {};

export default connect(mapStateToProps, actionCreators)(DesktopMenu);
