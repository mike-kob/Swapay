import React, {useState} from 'react';
import {
  Typography,
  Card,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Chip,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import dynamic from 'next/dynamic';
import Tooltip from '@material-ui/core/Tooltip';
import {useRouter} from 'next/router';
import PersonIcon from '@material-ui/icons/Person';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import LanguageIcon from '@material-ui/icons/Language';

import {FormattedMessage} from 'react-intl';
import Carousel from './Carousel';
import routerPush from '../../utils/routerPush';

const RequestDialog = dynamic(() => import('./RequestDialog'), {ssr: false});

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(0, 3),
    },
  },
  carouselPaper: {
    padding: theme.spacing(0.5),
    alignSelf: 'center',
    width: '300px',
    // height: (300 + 2 * theme.spacing(1)) + 'px',
    [theme.breakpoints.up('sm')]: {
      width: '50%',
      padding: theme.spacing(1),
      // height: (400 + 2 * theme.spacing(1)) + 'px',
    },
    [theme.breakpoints.up('lg')]: {
      width: '50%',
      padding: theme.spacing(1),
      // height: (550 + 2 * theme.spacing(1)) + 'px',
    },
  },
  carousel: {
    width: '100%',
    height: '300px',
  },
  photo: {
    width: '300px',
    [theme.breakpoints.up('sm')]: {
      width: '400px',
      maxHeight: '400px',
    },
    [theme.breakpoints.up('lg')]: {
      width: '550px',
      maxHeight: '550px',
    },
  },
  desktopRow: {
    display: 'flex',
    margin: theme.spacing(0, 2),
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  secondDesktopRow: {
    display: 'flex',
    padding: theme.spacing(2),
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  gameInfo: {
    [theme.breakpoints.up('md')]: {
      width: '50%',
    },
  },
  mainInfoPanel: {},
  ctaPanel: {
    marginTop: theme.spacing(2),
  },
  buttonRow: {
    marginTop: theme.spacing(1),
  },
  infoPanel: {
    marginTop: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      width: '50%',
      marginTop: '0',
      marginLeft: theme.spacing(4),
    },
  },
  requestDialog: {
    width: '30%',
  },
  title: {
    fontWeight: 'bold',
    fontSize: '25px',
  },
  subtitle: {
    fontWeight: 500,
    fontSize: '20px',
  },
  city: {
    fontWeight: '600',
    fontSize: '25px',
    paddingLeft: '10px',
  },
  price: {
    fontSize: '30px',
  },
  priceText: {
    fontWeight: '400',
    fontSize: '25px',
    color: '#A4A4A4',
    paddingTop: '10px',
    paddingLeft: 5,
  },
  exchangeDescriptionText: {
    fontSize: '18px',
    color: '#A4A4A4',
  },
  button: {
    background: 'linear-gradient(90deg, #F46036 0%, #FF965B 100%), #FF7D54;',
    color: '#FFFFFF',
    border: 'none',
    width: '155px',
    textTransform: 'none',
    borderRadius: 10,
    margin: 0,
    fontSize: '25px',
    [theme.breakpoints.up('sm')]: {
      width: '250px',
    },
  },
  formControl: {
    height: '53px',
    marginLeft: '10px',
    [theme.breakpoints.up('sm')]: {
      width: '150px',
    },
  },
  owner: {
    fontSize: '20px',
  },
  ownerLink: {
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  ownerBox: {
    paddingTop: theme.spacing(2),
  },
  descText: {
    fontWeight: 400,
    fontSize: 18,
    whiteSpace: 'pre-line',
    margin: theme.spacing(2, 0),
  },
  commentAuthor: {
    fontWeight: 600,
    fontSize: '18px',
    marginBottom: theme.spacing(1),
  },
  commentSection: {
    marginTop: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      maxWidth: '50%',
      marginLeft: theme.spacing(4),
    },
  },
  commentTitle: {},
  commentCard: {
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.15)',
    borderRadius: theme.spacing(0.5),
    marginTop: '10px',
    padding: theme.spacing(1),
  },
  commentText: {
    fontSize: '14px',
    overflowWrap: 'break-word',
  },
  commentDate: {
    float: 'right',
    color: 'grey',
  },
  iconPanel: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: theme.spacing(1, 0),
  },
  iconBlock: {
    display: 'flex',
    direction: 'row',
    paddingRight: theme.spacing(1),
  },
  iconText: {
    fontSize: '14px',
    paddingLeft: theme.spacing(0.5),
  },
}));

const GamePage = (props) => {
  const router = useRouter();
  const {game, initType} = props;
  const classes = useStyles(props);
  const lang = router.query.lang;
  const [selectedType, setSelectedType] = useState(initType || game.types[0] || 'R');
  const [sendRequest, setSendRequest] = useState(false);

  return (
    <div className={classes.root}>
      <div className={classes.desktopRow}>
        <Paper elevation={1} className={classes.carouselPaper}>
          <Carousel photos={game.photos}/>
        </Paper>

        <div className={classes.infoPanel}>
          <div className={classes.mainInfoPanel}>
            <Typography className={classes.title} component={'h1'}>
              {game[`${lang}Title`] || game.ukTitle}
            </Typography>
            <div className={classes.iconPanel}>
              {game.age && <>
                <div className={classes.iconBlock}>
                  <Tooltip title="Age of audience">
                    <PersonIcon style={{fill: '#FF7D54'}}/>
                  </Tooltip>
                  <Typography className={classes.iconText} component="span">{game.age}</Typography>
                </div>
              </>}
              {game.avgGameTime && <>
                <div className={classes.iconBlock}>
                  <Tooltip title="Time of one round">
                    <WatchLaterIcon style={{fill: '#FF7D54'}}/>
                  </Tooltip>
                  <Typography className={classes.iconText} component="span">{game.avgGameTime}</Typography>
                </div>
              </>}
              {game.language && <>
                <div className={classes.iconBlock}>
                  <Tooltip title="Language">
                    <LanguageIcon style={{fill: '#FF7D54'}}/>
                  </Tooltip>
                  <Typography className={classes.iconText} component="span">{game.language}</Typography>
                </div>
              </>}
            </div>
            <div className={classes.subtitle}>
              {game.tags.map((tag) => (
                tag.published ?
                  <Chip
                    component={'a'}
                    href={`/${lang}/catalog/${tag[`${lang}Slug`]}`}
                    key={tag.id}
                    color="primary"
                    size="small"
                    label={tag[`${lang}Name`]}
                    style={{marginRight: '5px', cursor: 'pointer'}}
                  /> :
                  <Chip
                    key={tag.id}
                    color="primary"
                    size="small"
                    label={tag[`${lang}Name`]}
                    style={{marginRight: '5px'}}
                  />
              ))}
            </div>
          </div>

          <div className={classes.ctaPanel}>
            {selectedType === 'R' &&
            <>
              <Box
                component="div" display="inline"
                className={classes.price}
              >{game.rentPrice} UAH</Box>
              <Box
                component="div"
                display="inline"
                className={classes.priceText}
              >per day</Box>
            </>}

            {selectedType === 'P' &&
            <>
              <Box
                component="div" display="inline"
                className={classes.price}
              >{game.sellPrice} грн</Box>
            </>}

            {selectedType === 'E' &&
            <>
              <Box component="div" display="block">
                <Box
                  component="div" display="inline"
                  className={classes.exchangeDescriptionText}
                >{game.exchangeDescription}</Box>
              </Box>
            </>}

            <Box
              component="div" display="block"
              className={classes.buttonRow}
            >
              <Button
                id="main-cta-button"
                dataItemId={game.id}
                className={classes.button}
                variant="outlined"
                onClick={() => {
                  setSendRequest(true);
                }}
              >
                {
                  selectedType === 'R' && (<FormattedMessage
                    id="general.toRent"
                    defaultMessage="Rent"
                  />) ||
                  selectedType === 'P' && (<FormattedMessage
                    id="general.toBuy"
                    defaultMessage="Buy"
                  />) ||
                  selectedType === 'E' && (<FormattedMessage
                    id="general.toExchange"
                    defaultMessage="Exchange"
                  />)
                }
              </Button>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="swap-type-label">Swap type</InputLabel>
                <Select
                  labelId="swap-type-label"
                  id="swap-type"
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                  }}
                  label="Тип свапу"
                >
                  {game.types.includes('R') && <MenuItem value={'R'}>
                    <FormattedMessage
                      id="general.rent"
                      defaultMessage="Rent"
                    /></MenuItem>}
                  {game.types.includes('P') && <MenuItem value={'P'}>
                    <FormattedMessage
                      id="general.buy"
                      defaultMessage="Buy"
                    />
                  </MenuItem>}
                  {game.types.includes('E') && <MenuItem value={'E'}><FormattedMessage
                    id="general.exchange"
                    defaultMessage="Exchange"
                  /></MenuItem>}
                </Select>
              </FormControl>
            </Box>
          </div>
        </div>
      </div>

      <div className={classes.secondDesktopRow}>
        <div className={classes.gameInfo}>
          <div className={classes.ownerBox}>
            <Typography className={classes.owner}>
              Owner: <span
                className={classes.ownerLink}
                onClick={() => routerPush(`/user/${game.owner.id}`)}
              >@{game.owner.username}</span>
            </Typography>
            {selectedType === 'R' && game.deposit && <><Typography className={classes.owner}>
              Deposit: {game.deposit} UAH
            </Typography></>}
          </div>
          <Typography className={classes.descText}>
            {game[`${lang}Description`] || game.ukDescription}
          </Typography>
        </div>

        <div className={classes.commentSection}>
          <Typography variant={'h6'} className={classes.commentTitle}>
            Reviews
          </Typography>
          {game.reviews.map((review) => (
            <Card key={review.id} className={classes.commentCard}>
              <div className={classes.commentAuthor}>
                From <span onClick={() => routerPush(`/user/${review.userFrom.id}`)}>@{review.userFrom.username}</span>
              </div>
              <div className={classes.commentText}>
                {review.comments}
              </div>
              <div className={classes.commentDate}>
                {new Date(review.created * 1000).toLocaleDateString()}
              </div>
            </Card>
          ))}
        </div>
      </div>
      <RequestDialog {...{sendRequest, setSendRequest, game, selectedType, setSelectedType}}/>
    </div>
  );
};

export default GamePage;
