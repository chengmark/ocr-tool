import { useContext } from 'react';
import { ProcessorContext } from '../context/ProcessorContext';
const useProcessor = () => useContext(ProcessorContext);

export default useProcessor;
