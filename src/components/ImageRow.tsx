import { ImageListType } from 'react-images-uploading';
import { makeStyles } from '@material-ui/core/styles';
import ImageCard from './ImageCard';
import useProcessor from '../hook/useProcessor';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '306px',
  },
}));

interface Props {
  images: ImageListType;
  removeImage: (i: number) => void;
}

const ImageRow = ({ images, removeImage }: Props) => {
  const classes = useStyles();
  const proccessor = useProcessor();

  return (
    <div className={classes.root}>
      {images.map((image, i) => (
        <ImageCard
          image={image}
          remove={() => {
            removeImage(i);
          }}
          processing={proccessor?.processList[i].processing as boolean}
        />
      ))}
    </div>
  );
};

export default ImageRow;
