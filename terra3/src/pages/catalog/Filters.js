import React from 'react';
import {
  FormGroup,
  FormControl,
  FormControlLabel,
  Checkbox,
  Slider,
  Box,
  Divider,
  Typography,
  Button,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

import ChooseCity from '../../components/ChooseCity';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(30),
    },
  },
  topRow: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  closeButton: {
    float: 'right',
  },
  subtitle: {
    fontWeight: '600',
    fontSize: '18px',
    margin: theme.spacing(1),
  },
  price: {
    width: '90%',
    alignSelf: 'center',
  },
  formControl: {
    margin: theme.spacing(0, 2),
    padding: theme.spacing(0, 0.5),
    maxHeight: theme.spacing(15),
    overflow: 'scroll',
    flexWrap: 'no-wrap',
    [theme.breakpoints.up('md')]: {
      maxHeight: theme.spacing(22),
    },
  },
  checkbox: {
    padding: theme.spacing(0.5),
  },
  citySection: {
    margin: theme.spacing(1),
  },
  popper: {
    backgroundColor: '#ffeae5',
  },
  applyButton: {
    marginTop: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(1),
    borderWidth: theme.spacing(0.25),
    borderColor: theme.palette.primary.main,
    fontSize: '17px',
    lineHeight: '24px',
    color: theme.palette.primary.main,
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(4),
    },
  },
  divider: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  cityRoot: {
    width: '300px',
    [theme.breakpoints.up('sm')]: {
      width: '200px',
      marginLeft: theme.spacing(1),
    },
  },

}));

const Filters = (props) => {
  const classes = useStyles(props);
  const {setOpen, params, setParams, gameTags, showPrice, applySearch} = props;
  const handleTagChange = (e) => {
    if (e.target.checked) {
      setParams({...params, tags: [...params.tags, e.target.value]});
    } else {
      setParams({...params, tags: params.tags.filter((t) => t !== e.target.value)});
    }
  };

  return (
    <div className={classes.root}>
      <Box className={classes.topRow}>
        <IconButton className={classes.closeButton} onClick={() => setOpen(false)}>
          <CloseIcon/>
        </IconButton>
      </Box>
      <Divider className={classes.divider}/>
      {showPrice &&
      <>
        <Typography className={classes.subtitle}>Ціна</Typography>
        <Slider
          className={classes.price}
          value={params.price}
          onChange={(e, val) => setParams({...params, price: val})}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"

        />
        <Divider/>
      </>}
      <Typography className={classes.subtitle}>Категорії</Typography>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormGroup>
          {gameTags.filter((tag) => tag.tagType === 'CATEGORY').map((tag) => (
            <FormControlLabel
              key={tag.id}
              control={<Checkbox
                className={classes.checkbox}
                checked={params.tags.includes(tag.id)}
                onChange={handleTagChange}
                value={tag.id}
              />}
              label={tag.translatedName}
            />
          ))}
        </FormGroup>
      </FormControl>
      <Divider/>
      <Typography className={classes.subtitle}>Тематики</Typography>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormGroup>
          {gameTags.filter((tag) => tag.tagType === 'TOPIC').map((tag) => (
            <FormControlLabel
              key={tag.id}
              control={<Checkbox
                className={classes.checkbox}
                checked={params.tags.includes(tag.id)}
                onChange={handleTagChange}
                value={tag.id}
              />}
              label={tag.translatedName}
            />
          ))}
        </FormGroup>
      </FormControl>
      <Divider/>
      <Typography className={classes.subtitle}>Місто</Typography>
      <div className={classes.citySection}>
        <ChooseCity
          freeSolo={false}
          propsClasses={{option: classes.popper, root: classes.cityRoot}}
          city={params.city}
          onChange={(e, val) => setParams({...params, city: val.id})}
        />
      </div>

      <Button
        color={'primary'}
        variant={'outlined'}
        onClick={() => applySearch()}
        className={classes.applyButton}
      >Застосувати</Button>
    </div>
  );
};

export default Filters;
