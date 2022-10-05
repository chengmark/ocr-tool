import { makeStyles } from '@material-ui/core/styles';
import useAuth from '../hook/useAuth';
import { Button } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const Authenticator = () => {
  const classes = useStyles();
  const auth = useAuth();

  return (
    <div className={classes.root}>
      <Button color="primary" variant="contained" onClick={auth?.signInWithGoogle}>
        LOGIN
      </Button>
    </div>
  );
};

export default Authenticator;
