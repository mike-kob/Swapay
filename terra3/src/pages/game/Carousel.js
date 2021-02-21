import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  thumbnailList: {
    display: 'flex',
    flexDirection: 'column',
    width: '20%',
    height: '100%',
    overflow: 'scroll',
  },
  mainImage: {
    width: '80%',
  },
  img: {
    width: '100%',
    padding: '3px',
  },
  cursor: {
    cursor: 'pointer',
  },
}));

const Picture = (props) => {
  const {className, photo, onClick} = props;
  const url = `https://res.cloudinary.com/swapay/image/upload/c_scale,h_600/${photo.publicId}`

  return (
    <img
      className={className}
      src={url}
      onClick={onClick}
      alt="Alt Text!"
    />
  );
};

const Carousel = (props) => {
  const {photos} = props;
  const classes = useStyles(props);
  const [selectedPhoto, setSelectedPhoto] = useState(photos[0]);

  return (
    <div className={classes.root}>
      <div className={classes.thumbnailList}>
        {photos.map((photo) => (
          <Picture
            key={photo.id}
            className={clsx(classes.img, classes.cursor)}
            photo={photo}
            onClick={() => setSelectedPhoto(photo)}
          />
        ))}
      </div>
      <div className={classes.mainImage}>
        <Picture
          className={classes.img}
          photo={selectedPhoto}
        />
      </div>
    </div>
  );
};

export default Carousel;
