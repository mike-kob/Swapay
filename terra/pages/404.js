import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Header from '@/components/Header';

const headerHeight = 70;

const useStyles = makeStyles((theme) => ({
  root: {
    height: 'calc(100vh - ' + headerHeight + 'px)',
    backgroundImage: 'url("/error404.webp")',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  },
  textPanel: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    padding: theme.spacing(1),
  },
  title: {
    fontWeight: 'bold',
    fontSize: '45px',
  },
  text: {
    fontSize: '27px',
  },
}));

const NotFound = (props) => {
  const classes = useStyles(props);

  return (
    <>
      <Header/>
      <div className={classes.root}>
        <div className={classes.textPanel}>
          <Typography className={classes.title}>Ouch, 404</Typography>
          <Typography className={classes.text}>
              Looks like we haven't found anything here
          </Typography>
        </div>
      </div>
    </>
  );
};

export default NotFound;
