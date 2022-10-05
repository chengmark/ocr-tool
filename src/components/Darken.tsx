import { useColorScheme } from '@mui/joy';
import { useEffect } from 'react';
const Darken = () => {
  const { mode, setMode } = useColorScheme();
  useEffect(() => {
    if (mode !== 'dark') setMode('dark');
  }, [mode, setMode]);

  return <></>;
};
export default Darken;
