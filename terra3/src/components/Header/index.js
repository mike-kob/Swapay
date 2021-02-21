import React from 'react';
import {
  useTheme,
  useMediaQuery,
} from '@material-ui/core';

import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';

const Header = (props) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));


  return matches ? <DesktopHeader {...props}/> : <MobileHeader {...props}/>;
};

export default Header;
