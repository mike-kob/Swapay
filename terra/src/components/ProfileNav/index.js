import React, {useState} from 'react';
import {
  Tabs,
  Tab,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {useRouter} from 'next/router';

import routerPush from '../../utils/routerPush';


const useStyles = makeStyles((theme) => ({
  indicator: {
    backgroundColor: '#B62C00',
  },
  defaultStyle: {
    color: '#A4A4A4',
  },
  activeStyle: {
    color: '#B62C00',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

const ProfileNav = (props) => {
  const router = useRouter();
  const classes = useStyles(props);
  const value = router.pathname;

  let ind = 3;
  switch (value) {
    case '/[lang]/profile/settings':
      ind = 1;
      break;
    case '/[lang]/profile/games':
      ind = 2;
      break;
    case '/[lang]/profile/swaps':
      ind = 3;
      break;
  }

  if (value.includes('/profile/game')) {
    ind = 2;
  }
  if (value.includes('/profile/swap/')) {
    ind = 3;
  }

  const [activeIndex, setActiveIndex] = useState(ind);


  const getStyle = (isActive) => (
    isActive ? classes.activeStyle :
      classes.defaultStyle
  );

  return (
    <Tabs
      indicatorColor="primary"
      classes={{indicator: classes.indicator, flexContainer: classes.container}}
      value={value}
    >
      <Tab
        value="/[lang]/profile/swaps"
        label="My swaps"
        onClick={() => {
          setActiveIndex(3);
          routerPush('/profile/swaps');
        }}
        className={getStyle(activeIndex === 3)}
      />
      <Tab
        value="/[lang]/profile/games"
        label="My games"
        onClick={() => {
          setActiveIndex(2);
          routerPush('/profile/games');
        }}
        className={getStyle(activeIndex === 2)}
      />
      <Tab
        value="/[lang]/profile/settings"
        label="Profile"
        onClick={() => {
          setActiveIndex(1);
          routerPush('/profile/settings');
        }}
        className={getStyle(activeIndex === 1)}
      />
    </Tabs>
  );
};

export default ProfileNav;
