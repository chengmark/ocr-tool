import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytes } from 'firebase/storage';
import { ImageListType } from 'react-images-uploading';

interface Props {
  children?: ReactNode;
}

interface IProcess {
  processing: boolean;
  result: string;
}

interface IProcessorContext {
  processList: IProcess[];
  updateProcessingState: (n: number) => void;
  startProcessing: (files: File[]) => void;
}

export const ProcessorContext = createContext<IProcessorContext | null>(null);

export const ProcessorProvider = ({ children }: Props) => {
  const [processList, setProcessList] = useState<IProcess[]>([]);

  const updateProcessingState = (n: number) => {
    setProcessList(new Array(n).fill({ processing: false, result: '' }));
  };

  const startProcessing = (files: File[]) => {
    for (let file of files) {
      const formData = new FormData();
      formData.append('File', file as Blob);
      const imgRef = ref(storage, file.name);
      uploadBytes(imgRef, file as File).then((snapshot) => {
        console.log('File Uploaded.');
      });
    }
  };

  return (
    <ProcessorContext.Provider value={{ processList, updateProcessingState, startProcessing }}>
      {children}
    </ProcessorContext.Provider>
  );
};
