import React from 'react';
import {
  Typography,
  List,
  ListItem,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {useRouter} from 'next/router';
import {FormattedMessage} from 'react-intl';

import GameSlot from '@/components/GameSlot';
import Link from '@/components/utils/Link';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1, 2),
  },
  title: {
    fontSize: '28px',
  },
  subtitleInfo: {
    fontSize: '18px',
  },
  subtitle: {
    fontWeight: '600',
    fontSize: '18px',
    marginTop: theme.spacing(2),
  },
  buttonsSection: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(2),
  },
  typeButton: {
    margin: theme.spacing(0, 1),
    textTransform: 'none',
    borderRadius: theme.spacing(1),
    borderWidth: theme.spacing(0.25),
    borderColor: theme.palette.primary.main,
    fontSize: '17px',
    lineHeight: '24px',
    color: theme.palette.primary.main,
  },
  gamesSection: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginTop: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    },
  },
  categoriesSection: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    },
  },
  about: {
    marginTop: theme.spacing(1),
  },
  tagList: {},
  tagItem: {
    color: theme.palette.primary.main,
    fontSize: '16px',
  },
  tagLink: {
    color: theme.palette.primary.main,
  },
  showAllLink: {
    float: 'right',
    textDecoration: 'underline',
    color: theme.palette.primary.main,
    fontSize: '14px',
  },
  desktopMainSection: {
    minHeight: '70vh',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      flexDirection: 'row-reverse',
    },
  },
  desktopCategorySection: {
    [theme.breakpoints.up('sm')]: {
      width: '30%',
      flexShrink: '0',
    },
    [theme.breakpoints.up('md')]: {
      width: '20%',
      flexShrink: '0',
    },
    [theme.breakpoints.up('lg')]: {
      width: '15%',
      flexShrink: '0',
    },
  },
}));

const GeneralCatalogPage = (props) => {
  const classes = useStyles(props);
  const router = useRouter();
  const {games, gameTags} = props;

  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant={'h1'}>Swapay</Typography>
      <div className={classes.desktopMainSection}>
        <div>
          <Typography className={classes.subtitle} variant={'h3'}>
            <FormattedMessage
              id="home.newItems"
              defaultMessage="Newly added"
            />
            <Link href={'/catalog'}>
              <a className={classes.showAllLink}>
                <FormattedMessage
                  id="home.showMore"
                  defaultMessage="Show more"
                />
              </a>
            </Link>
          </Typography>
          <div className={classes.gamesSection}>
            {games.map((game) => (
              <GameSlot key={game.id} game={game} sourceType={'general'}/>
            ))}
          </div>
        </div>
        <div className={classes.desktopCategorySection}>
          <Typography className={classes.subtitle} variant={'h3'}>
            <FormattedMessage
              id="home.categories"
              defaultMessage="Categories"
            />
          </Typography>
          <div className={classes.categoriesSection}>
            <List dense className={classes.tagList} disablePadding>
              {gameTags.map((tag) => (
                <ListItem
                  key={tag.id}
                  className={classes.tagItem}
                >
                  <Link href={`/catalog/${tag[`${router.query.lang}Slug`]}`}>
                    <a className={classes.tagLink}>{tag[`${router.query.lang}Name`]}</a>
                  </Link>
                </ListItem>
              ))}
            </List>
          </div>
        </div>
      </div>
      {/* <Typography className={classes.subtitle} variant={'h3'}>Про ігри та про нас</Typography>*/}
      {/* <Typography variant={'body1'} className={classes.about}>*/}
      {/*  При звучанні слова «настільна гра» багатьом зразу уявляються просто шахи, шашки, нарди або Монополія чи УНО, але*/}
      {/*  це не зовсім правильне уявлення.*/}
      {/* </Typography>*/}
      {/* <Typography variant={'body1'} className={classes.about}>*/}
      {/*  Сучасні настільні ігри - це захоплива тематика, різноманітна механіка, креативне, стратегічне мислення і тепла*/}
      {/*  атмосфера в компанії людей будь-якого віку.*/}
      {/* </Typography>*/}
      {/* <Typography variant={'body1'} className={classes.about}>*/}
      {/*  У 2016 році світовий ринок настільних ігор був на рівні $3,2 млрд, а за прогнозами експертів, до 2021 року він*/}
      {/*  досягне $8,5 млрд. Тож індустрія настільних ігор стрімко розвивається і стає подібною до індустрії комп’ютерних*/}
      {/*  ігор. Але на відміну від комп‘ютерних ігор, настільні дозволяють поєднати задоволення, отримане від гри, разом з*/}
      {/*  часом, проведеним з друзями і близькими. Ви навіть можете залучити всю свою сім‘ю, правильно обравши настільну*/}
      {/*  гру, яка може виявитися захопливою навіть для вашої бабусі!*/}
      {/* </Typography>*/}
      {/* <Typography variant={'body1'} className={classes.about}>*/}
      {/*  Наш сайт - ваш вірний помічник, адже ви зможете не лише отримати дуже вигідну можливість пограти в потрібну вам*/}
      {/*  гру, але і знайти однодумців і майбутніх друзів по грі.*/}
      {/* </Typography>*/}
    </div>
  );
};

export default GeneralCatalogPage;
