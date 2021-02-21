import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import CachedIcon from '@material-ui/icons/Cached';
import {useRouter} from 'next/router';
import clsx from 'clsx';
import Link from 'next/link';

import {useIntl} from 'react-intl';
import {Image} from 'cloudinary-react';

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: theme.spacing(1),
    marginTop: theme.spacing(1),
    height: theme.spacing(16),
    cursor: 'pointer',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginRight: theme.spacing(1),
    },
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(2),
      marginRight: theme.spacing(2),
      height: theme.spacing(25),
    },
    [theme.breakpoints.up('lg')]: {
      maxWidth: '70%',
    },
  },
  cardPhoto: {
    height: theme.spacing(16),
    width: theme.spacing(14),
    flexGrow: '0',
    flexShrink: '0',
    [theme.breakpoints.up('md')]: {
      height: theme.spacing(25),
      width: theme.spacing(25),
    },
  },
  smallCardPhoto: {
    [theme.breakpoints.up('md')]: {
      height: theme.spacing(20),
      width: theme.spacing(20),
    },
  },
  cardContent: {
    padding: theme.spacing(0.5, 1) + '!important',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(1.5, 2) + '!important',
    },
  },
  title: {
    fontSize: '16px',
    [theme.breakpoints.up('md')]: {
      fontSize: '18px',
    },
  },
  chips: {},
  chip: {
    borderRadius: theme.spacing(0.5),
    height: theme.spacing(2),
    marginRight: theme.spacing(0.5),
    fontSize: '11px',
    backgroundColor: theme.palette.primary.mild,
    color: 'white',
  },
  swapType: {
    marginTop: theme.spacing(0.5),
  },
  swapTypeText: {
    fontSize: '10px',
    [theme.breakpoints.up('sm')]: {
      fontSize: '14px',
    },
  },
  preview: {
    display: 'none',
    color: 'gray',
    fontSize: '14px',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  swapIcon: {
    verticalAlign: 'middle',
    marginRight: theme.spacing(0.5),
  },
  priceSection: {
    marginTop: 'auto',
  },
  price: {
    marginRight: theme.spacing(0.5),
    fontSize: '21px',
    fontWeight: '400',
    [theme.breakpoints.up('md')]: {
      fontSize: '37px',
    },
  },
  priceHrn: {
    fontSize: '12px',
    [theme.breakpoints.up('md')]: {
      fontSize: '23px',
    },
  },
  smallCard: {
    [theme.breakpoints.up('md')]: {
      width: theme.spacing(47),
      height: theme.spacing(20),
    },
    [theme.breakpoints.down('sm')]: {
      ['&:nth-child(n+6)']: {
        display: 'none',
      },
    },
    [theme.breakpoints.down('md')]: {
      ['&:nth-child(n+9)']: {
        display: 'none',
      },
    },
  },
  userGameCard: {
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(55),
    },
  },
  linkTitle: {
    color: 'black',
    textDecoration: 'none',
  },
}));

const Picture = (props) => {
  const {photo, classNamePicture, classNameImg, alt} = props;
  const url = `https://res.cloudinary.com/swapay/image/upload/c_scale,h_600/${photo.publicId}`
  return (
    <img className={clsx(classNamePicture, classNameImg)} src={url} alt={alt}/>
  );
};

const GameSlot = (props) => {
  const classes = useStyles(props);
  const router = useRouter();
  const intl = useIntl();
  const {game, sourceType} = props;
  const lang = router.query.lang;

  const image = game.photos.find((p) => p.main) || game.photos[0] || {};

  const TYPES = {
    'R': intl.formatMessage({id: 'general.rent', defaultMessage: 'Rent'}),
    'P': intl.formatMessage({id: 'general.buy', defaultMessage: 'Buy'}),
    'E': intl.formatMessage({id: 'general.exchange', defaultMessage: 'Exchange'}),
  };

  let gameTitle = game.title || '';
  if (game[`${lang}Title`]) {
    gameTitle = game[`${lang}Title`];
  }

  if (gameTitle.length > 30) {
    gameTitle = gameTitle.substring(0, 30) + '...';
  }

  const ImageClasses = clsx(
      classes.cardPhoto,
      (sourceType === 'general' ? classes.smallCardPhoto : ''),
  );

  return (
    <Card className={clsx(classes.cardRoot,
      sourceType === 'general' ? classes.smallCard : '',
      sourceType === 'user' ? classes.userGameCard : '',
      'game-card')}>
      <CardMedia
        component={(props) => (
            <Picture photo={image} alt={`Photo of ${gameTitle}`} classNamePicture={ImageClasses} classNameImg={ImageClasses}/>
        )}
        alt={game.title}
        onClick={() => {
          router.push(`/${lang}/game/${game.id}`);
        }}
      />
{/*<Image className={classes.cover} cloudName="swapay" publicId={image ? image.publicId: ''} width="300" />*/}
      <CardContent
        className={classes.cardContent}
        onClick={async () => {
          router.push(`/${lang}/game/${game.id}`);
        }}
      >
        <Typography variant="h4" className={classes.title}>
          <Link href={`/${lang}/game/${game.id}`}>
            <a className={classes.linkTitle}>{gameTitle}</a>
          </Link>
        </Typography>
        <div className={classes.chips}>
          {game.tags.map((tag) => (
            <Chip
              key={tag.id}
              size={'small'}
              className={classes.chip}
              label={tag[`${lang}Name`]}
            />
          ))}
        </div>
        {['general', 'tag'].includes(sourceType) &&
        <div className={classes.swapType}>
          <span className={classes.swapIcon}><CachedIcon/></span>
          <Typography className={classes.swapTypeText}
            variant={'caption'}>{game.types.map((t) => TYPES[t]).join(', ')}</Typography>
        </div>
        }

        {['tag'].includes(sourceType) &&
        <div className={classes.swapType}>
          <Typography variant={'caption'} className={classes.preview}>{game[`${lang}Preview`]}</Typography>
        </div>
        }

        <div className={classes.priceSection}>
          {sourceType === 'general' && game.types[0] === 'P' || sourceType === 'buy' &&
          <>
            <Typography
              component={'span'}
              className={classes.price}
            >{game.sellPrice}</Typography>
            <Typography
              component={'span'}
              className={classes.priceHrn}
            >грн</Typography>
          </>}
          {sourceType === 'general' && game.types[0] === 'R' || sourceType === 'rent' &&
          <>
            <Typography
              component={'span'}
              className={classes.price}
            >{game.rentPrice}</Typography>
            <Typography
              component={'span'}
              className={classes.priceHrn}
            >грн/день</Typography>
          </>}
        </div>
      </CardContent>

    </Card>

  );
};

export default GameSlot;
