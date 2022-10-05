import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { fixPunctuation } from '../utils';
import Textarea from '@mui/joy/Textarea';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import Darken from './Darken';

interface Props {
  content: { text: string; title: string };
  close: () => void;
  open: boolean;
}

const theme = extendTheme({
  colorSchemes: { dark: { palette: { primary: { 500: '#00000000' } } } },
});

const ContentPopup = ({ content, close, open }: Props) => {
  return (
    <Dialog onClose={close} open={open}>
      <DialogTitle sx={{ background: '#383838', color: 'white' }}>{content.title}</DialogTitle>
      <DialogContent
        dividers
        sx={{
          background: '#383838',
          color: 'white',
          borderColor: '#505050',
        }}
      >
        <CssVarsProvider theme={theme}>
          <Darken />
          <Textarea
            contentEditable={false}
            sx={{
              background: '#383838',
              border: '0px',
              '&:--Textarea-focusedHighlight': {
                border: '0px',
              },
            }}
            color="neutral"
            value={fixPunctuation(content.text).replaceAll('\\n', '\n')}
          />
        </CssVarsProvider>
      </DialogContent>
    </Dialog>
  );
};

export default ContentPopup;
