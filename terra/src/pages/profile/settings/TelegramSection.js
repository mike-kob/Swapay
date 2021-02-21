import React from 'react';
import {
  Box,
  Grid,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import Link from '@material-ui/core/Link';

const PasswordSection = (props) => {
  const {
    classes,
    telegram,
  } = props;

  return (
    <Box border={1} boxShadow={2} borderRadius="borderRadius"
      borderColor="#CDCDCD" className={clsx(classes.padding, classes.card)}>
      <Grid container>
        <Grid container item>
          <Typography className={classes.bold} variant="h5">Telegram</Typography>
        </Grid>
        <Grid item>
          <Box m={2}/>
          {telegram ?
            <Typography>Ви вже підключили Telegram</Typography> :
            <Link
              href="/tg/invite/"
              target="_blank"
              variant="button">Підключити</Link>
          }
        </Grid>

      </Grid>
    </Box>
  );
};

export default PasswordSection;
