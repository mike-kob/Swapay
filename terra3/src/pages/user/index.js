import React from 'react';
import {
  Grid,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

import UserCard from './UserCard';
import Header from '../../components/Header';
import Breadcrumbs from '../../components/Breadcrumbs';
import {ssrQuery} from '../../utils/graphqlSsr';
import {PROFILES_QUERY} from '../../gql/publicUser';
import Error from '../../../pages/404';
import GameSlot from '../../components/GameSlot';
import {SWITCH_IS_ACTIVE_QUERY} from '../../gql/control';
import Head from 'next/head';
import {useIntl} from 'react-intl';


const useStyles = makeStyles((theme) => ({
  main: {
    width: '80%',
    margin: 'auto',
  },
  item: {
    margin: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      width: theme.spacing(60),
    },
    ['@media (max-width:900px)']: {
      maxWidth: '70%',
    },
    ['@media (max-width:700px)']: {
      maxWidth: '80%',
    },
    ['@media (max-width:425px)']: {
      maxWidth: '90%',
    },
  },
}));


const User = (props) => {
  if (props.err) {
    return (<Error statusCode={404}/>);
  }
  const classes = useStyles(props);
  const intl = useIntl();
  const {user} = props;

  return (
    <>
      <Head>
        <title>Користувач - {user.username} - Swapay</title>
        <meta name="description" content={intl.formatMessage({id: 'seo.user.description'}) + user.username}/>
        <meta name="robots" content="noindex"/>
      </Head>
      <Header/>
      <Breadcrumbs links={[user.username]}/>
      <UserCard user={user}/>
      <Grid
        container
        direction="row"
        justify="start"
        alignItems="flex-start" wrap="wrap"
        className={classes.main}
      >
        {user.items && user.items.map((game) => (
          <div key={game.id} className={classes.item}>
            <GameSlot game={game} sourceType={'user'}/>
          </div>
        ))}</Grid>
    </>
  );
};

export async function getServerSideProps(context) {
  const data = await ssrQuery(PROFILES_QUERY, {'ids': [context.query.id]}, context);
  let isQuestActive = {};
  if (context.query.id === '2') {
    isQuestActive = await ssrQuery(SWITCH_IS_ACTIVE_QUERY, {'name': 'quest_1'}, context);
  }

  if (!data.data || !data.data.profiles || !data.data.profiles[0]) {
    return {
      props: {err: true},
    };
  }
  const user = data.data.profiles[0];

  return {
    props: {
      user: user,
      isQuestActive: isQuestActive.data ? isQuestActive.data.switchIsActive : false,
    },
  };
}

export default User;
