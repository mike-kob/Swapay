import React from 'react';

import GameForm from './GameForm';
import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';

const EditGame = () => {
  return (
    <>
      <Header/>
      <Breadcrumbs links={[['Профіль', '/profile/settings'], ['My games', '/profile/games'], 'Game']}/>
      <GameForm/>
    </>
  );
};


export default EditGame;
