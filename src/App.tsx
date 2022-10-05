import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import Uploader from './components/Uploader';
import { AuthProvider } from './context/AuthContext';
import useAuth from './hook/useAuth';
import Authenticator from './components/Authenticator';
import { SnackbarProvider } from 'notistack';

const theme = createTheme();

const Content = () => {
  const auth = useAuth();

  if (auth?.user) return <Uploader />;

  return <Authenticator />;
};

const App = () => {
  return (
    <SnackbarProvider
      autoHideDuration={5000}
      anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
    >
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Content />
        </AuthProvider>
      </ThemeProvider>
    </SnackbarProvider>
  );
};

export default App;
