import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useMediaQuery, useTheme} from '@material-ui/core';
import Head from 'next/head';

import MainCard from './MainCard';
import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProfileNav from '@/components/ProfileNav';


const useStyles = makeStyles((theme) => ({
  mainCard: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'start',
    justifyContent: 'space-around',
    padding: theme.spacing(3),
  },
}));

const ProfileDefault = (props) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles(props);
  return (
    <>
      <Head>
        <title>Налаштування - Swapay</title>
      </Head>
      <Header/>
      {matches ? <Breadcrumbs links={[['Profile', '/profile/settings'], 'Settings']}/> :
        <ProfileNav/>}
      <div className={classes.mainCard}>
        <MainCard {...props}/>
      </div>
    </>
  );
}

export default ProfileDefault;
