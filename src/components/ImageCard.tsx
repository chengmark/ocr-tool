import {
  Card,
  CardActionArea,
  CardActions,
  CardHeader,
  CardMedia,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ImageType } from 'react-images-uploading';

interface Props {
  image: ImageType;
  remove: () => void;
  processing: boolean;
}

const ImageCard = ({ image, remove, processing }: Props) => {
  return (
    <Card>
      <CardHeader subheader={image.file?.name} />
      <CardActionArea>
        <CardMedia component="img" height="194" image={image.dataURL} />
      </CardActionArea>
      <CardActions>
        {processing ? (
          <CircularProgress />
        ) : (
          <Tooltip title="Remove">
            <IconButton sx={{ marginLeft: 'auto' }} onClick={remove}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </CardActions>
    </Card>
  );
};

export default ImageCard;
