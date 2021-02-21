import React, {useState} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
  Typography,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {useRouter} from 'next/router';
import {connect} from 'react-redux';
import Link from 'next/link';

import {graphql} from '@/utils';
import {CREATE_SWAP_MUTATION} from '@/gql/mySwaps';


const useStyles = makeStyles((theme) => ({
  radio: {
    margin: theme.spacing(1, 0.5),
  },
  title: {
    marginBottom: '0',
  },
}));

const RequestDialog = (props) => {
  const router = useRouter();
  const classes = useStyles(props);
  const [message, setMessage] = useState('');
  const [error, setError] = useState();
  const {sendRequest, setSendRequest, game, selectedType, setSelectedType, user, isQuestActive} = props;

  const handleSave = async () => {
    const params = {
      'item': game.id,
      'type': selectedType,
      'message': message,
    };

    graphql.post('', {query: CREATE_SWAP_MUTATION, variables: JSON.stringify(params)})
        .then((response) => {
          if (response.data.data && response.data.data.createSwap.ok) {
            const data = response.data.data.createSwap.swap;
            router.push(`/${router.query.lang}/profile/swap/${data.id}`);
          } else {
            const errors = response.errors || response.data.errors || response.data.data.createSwap.errors;
            setError(errors);
          }
        });
  };

  return (
    <Dialog
      open={sendRequest}
      onClose={async () => setSendRequest(false)}
      aria-labelledby="form-dialog-title"
      maxWidth={'sm'}
      fullWidth
    >
      <DialogTitle
        className={classes.title}
        id="form-dialog-title"
      >Send swap request</DialogTitle>
      <DialogContent>
        {user.id ?
          <>
            <TextField
              id="standard-full-width"
              label=""
              multiline
              rows="4"
              placeholder={'Write short message to owner'}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{shrink: false}}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <FormControl component="fieldset">
              <FormLabel component="legend">Swap type</FormLabel>
              <RadioGroup
                row aria-label="position"
                name="position"
                value={selectedType || game.types[0]}
                onChange={(e, val) => setSelectedType(val)}>
                {game.types.includes('E') ?
                  <FormControlLabel
                    className={classes.radio}
                    value="E"
                    control={<Radio color="default"/>}
                    label="Exchange"
                    labelPlacement="top"
                  /> : <React.Fragment/>
                }
                {game.types.includes('P') ?
                  <FormControlLabel
                    className={classes.radio}
                    value="P"
                    control={<Radio color="default"/>}
                    label="Buy"
                    labelPlacement="top"
                  /> : <React.Fragment/>
                }
                {game.types.includes('R') ?
                  <FormControlLabel
                    className={classes.radio}
                    value="R"
                    control={<Radio color="default"/>}
                    label="Rent"
                    labelPlacement="top"
                  /> : <React.Fragment/>
                }
              </RadioGroup>
            </FormControl>
            {error && <p>{error}</p>}
          </> : <Typography>
            Please,
            <Link href={`${router.query.lang}/login?next=${encodeURIComponent(router.asPath)}`}>
              <a>login</a>
            </Link> to continue
          </Typography>}
      </DialogContent>

      {user.id && <DialogActions>
        <Button
          variant="contained"
          component="label"
          color="secondary"
          onClick={() => setSendRequest(false)}>
          Скасувати
        </Button>
        <Button
          variant="contained"
          component="label"
          onClick={handleSave}
        >
          Надіслати
        </Button>
      </DialogActions>}
    </Dialog>
  );
};

function mapStateToProps(state) {
  return {
    user: state.privateProfile.privateProfile,
  };
}

export default connect(mapStateToProps)(RequestDialog);
