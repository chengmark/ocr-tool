import { Button, ButtonGroup, Dialog, DialogContent } from '@mui/material';
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useSnackbar } from 'notistack';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { PUNCTUATION_MARKS } from '../utils';
const PunctuationPopupButton = styled(Button)`
  position: fixed;
  bottom: 15px;
  left: 15px;
  padding: 6px;
  min-width: 32px;
`;
const PunctuationButton = styled(Button)`
  color: white;
  border-color: rgba(255, 255, 255, 0.12);
  &:hover {
    border-color: rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.08);
    border-right-color: rgba(255, 255, 255, 0.12);
  }
`;

const PunctuationSelector = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);

  const copyPunctuation = async (punctuation: string) => {
    await navigator.clipboard.writeText(punctuation);
    enqueueSnackbar(`Copied punctuation: ${punctuation}`, { variant: 'success' });
  };

  return (
    <>
      <Dialog
        onClose={() => {
          setOpen(!open);
        }}
        open={open}
      >
        <DialogContent
          dividers
          sx={{
            background: '#383838',
            color: 'white',
            borderColor: '#505050',
            '.MuiButtonGroup-grouped:not(:last-of-type):hover': {
              borderRightColor: 'rgba(255, 255, 255, 0.12) !important',
            },
            overflowX: 'hidden',
          }}
        >
          <ButtonGroup variant="outlined" aria-label="outlined button group" color="info">
            {Object.keys(PUNCTUATION_MARKS).map((punctuation: string) => (
              <PunctuationButton
                onClick={() => {
                  copyPunctuation(punctuation);
                }}
              >
                {punctuation}
              </PunctuationButton>
            ))}
          </ButtonGroup>
        </DialogContent>
      </Dialog>
      <PunctuationPopupButton
        variant="contained"
        value="check"
        onClick={() => {
          setOpen(true);
        }}
      >
        <FormatQuoteIcon />
      </PunctuationPopupButton>
    </>
  );
};

export default PunctuationSelector;
