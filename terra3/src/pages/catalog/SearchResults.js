import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

import GameSlot from '../../components/GameSlot';

const useStyles = makeStyles((theme) => ({
  searchResultsRoot: {
    margin: theme.spacing(1),
    display: 'flex',
    flexWrap: 'wrap',
  },
}));

const SearchResults = (props) => {
  const {games, sourceType} = props;
  const classes = useStyles(props);

  return (
    <div className={classes.searchResultsRoot}>
      {games.map((game) => (
        <GameSlot key={game.id} game={game} sourceType={sourceType}/>
      ))}
    </div>
  );
};

export default SearchResults;
