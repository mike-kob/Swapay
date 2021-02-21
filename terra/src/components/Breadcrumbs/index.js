import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {
  Breadcrumbs as MuiBreadcrumbs,
  Typography,
} from '@material-ui/core';
import Link from '../utils/Link';

const useStyles = makeStyles((theme) => ({
  breadcrumbs: {
    padding: theme.spacing(1, 2),
  },
  link: {
    color: '#A4A4A4',
    textDecoration: 'none',
  },
}));

const Breadcrumbs = (props) => {
  const {links} = props;
  const classes = useStyles(props);

  const asLinks = links.slice(0, -1);
  const asText = links[links.length - 1];
  return (
    <MuiBreadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}
      classes={{separator: classes.link}}>
      {asLinks.map(([txt, link]) => (
        <Link href={link} key={link}>
          <a className={classes.link}>{txt}</a>
        </Link>
      ))}
      <Typography color="textPrimary" className={classes.link}>{asText}</Typography>
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
