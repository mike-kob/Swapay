import React, {Component} from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {withStyles} from "@material-ui/core";
import {connect} from "react-redux";
import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  Grid,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dropzone from "react-dropzone";

import {snackActions} from "@/actionCreators";

const styles = theme => ({
  dropzone: {
    borderRadius: '5px',
    borderColor: 'red',
    borderWidth: '3px',
    borderStyle: 'solid',
    textAlign: 'center',
    cursor: 'pointer',
    minHeight: '100px'
  },
  image: {
    height: '100%',
    width: 'auto'
  }
});


class AddPhotosPopup extends Component {

  constructor() {
    super();
    this.state = {
      src: null,
      crop: {
        unit: "%",
        width: 30,
        aspect: 1
      },
      croppedImageUrl: null,
      loader: false
    }
  }

  handleClose = () => {
    this.setState({croppedImageUrl: null, src: null})
    this.props.setOpen(false);
  };


  onDrop = async acceptedFiles => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      this.setState({src: fileReader.result})
    };
    fileReader.readAsDataURL(acceptedFiles[0])
  };


  savePhoto = async () => {
    const formData = new FormData();
    formData.append('file', this.state.croppedImage);
    formData.append('upload_preset', 'dmbwayee');
    this.setState({loader: true});
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/swapay/upload`, {
        method: 'POST',
        body: formData,
      });
      const image = await res.json();
      if (res.status === 200) {
        this.props.showSnackbar("Added");
      } else {
        this.props.showSnackbar("Error occurred");
      }
      if (this.props.onSuccess) {
        this.props.onSuccess(image)
      }
    } catch (e) {
      this.props.showSnackbar("Error occurred");

    }
    this.setState({loader: false});
    this.handleClose();
  };

  onImageLoaded = image => {
    this.imageRef = image
  };

  onCropChange = (crop) => {
    this.setState({crop});
  };

  onCropComplete = (crop, pixelCrop) => {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = this.getCroppedImg(this.imageRef, crop, pixelCrop)
      this.setState({croppedImageUrl})
    }
  };

  getCroppedImg(image, crop, pctCrop) {
    const canvas = document.createElement("canvas");
    const ratioW = image.naturalWidth / 100;
    const ratioH = image.naturalHeight / 100;
    canvas.width = pctCrop.width * ratioW;
    canvas.height = pctCrop.height * ratioH;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      pctCrop.x * ratioW,
      pctCrop.y * ratioH,
      pctCrop.width * ratioW,
      pctCrop.height * ratioH,
      0,
      0,
      pctCrop.width * ratioW,
      pctCrop.height * ratioH
    );

    const reader = new FileReader();
    canvas.toBlob(blob => {
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        this.dataURLtoFile(reader.result, 'cropped.jpg')
      }
    })
  }

  dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    let croppedImage = new File([u8arr], filename, {type: mime});
    this.setState({croppedImage: croppedImage})
  };

  render() {
    const {crop, croppedImageUrl, src} = this.state;
    const {open} = this.props;

    return (
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={open}
        onClose={this.handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle onClose={this.handleClose} id="max-width-dialog-title">Upload
          {this.state.loader && <CircularProgress size={30} style={{float: 'right'}}/>}
        </DialogTitle>
        <DialogContent>
          {
            (!src) ?
              <Dropzone onDrop={this.onDrop}>
                {({getRootProps, getInputProps}) => (
                  <section>
                    <div type="file"
                         className={this.props.classes.dropzone} {...getRootProps()}>
                      <input {...getInputProps()} accept=".png, .jpg, .jpeg"/>

                      <p>Drag `n` drop or click here</p>
                    </div>
                  </section>
                )}
              </Dropzone> :
              <Grid container direction={"column"} alignItems={"center"}>
                <ReactCrop
                  className={this.props.classes.image}
                  src={src}
                  crop={crop}
                  ruleOfThirds
                  onImageLoaded={this.onImageLoaded}
                  onComplete={this.onCropComplete}
                  onChange={this.onCropChange}
                />
                <Button onClick={this.savePhoto}>
                  Save
                </Button>
              </Grid>
          }
        </DialogContent>
      </Dialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    item: state.item.item
  };
}

const actionCreators = {
  showSnackbar: snackActions.showSnackbar,
};


export default withStyles(styles)(connect(mapStateToProps, actionCreators)(AddPhotosPopup));