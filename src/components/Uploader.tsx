import {
  CircularProgress,
  Fade,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Slide,
  Typography,
} from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import styled from '@emotion/styled';
import { useDropzone } from 'react-dropzone';
import { Box } from '@mui/system';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CollectionsIcon from '@mui/icons-material/Collections';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MemoryIcon from '@mui/icons-material/Memory';
import { firestore, storage } from '../firebase';
import { ref, uploadBytes } from 'firebase/storage';
import { collection, DocumentData, getDocs, query, where } from 'firebase/firestore';
import { sleep } from '../utils';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import ContentPopup from './ContentPopup';
import useForeceUpdate from '../hook/useForeceUpdate';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { v4 as uuidv4 } from 'uuid';
import PunctuationSelector from './PunctuationSelector';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    // height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#292e38',
    color: 'white',
  },
}));

const getColor = (props: any) => {
  if (props.isDragAccept) {
    return '#6e727a';
  }
  if (props.isDragReject) {
    return '#6e727a';
  }
  if (props.isFocused) {
    return '#6e727a';
  }
  return '#6e727a';
};

const AreaWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #323645;
  border-radius: 8px;
  padding: 12px;
  width: 50%;
  margin-top: 25px;
`;

const Area = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: #323645;
  color: #white;
  outline: none;
  transition: border 0.24s ease-in-out;
  width: 100%;
`;

interface Job {
  file: File;
  status: 'pending' | 'processing' | 'done';
  content: string;
}

const JobsActions = (
  status: 'pending' | 'processing' | 'done',
  removeJob: () => void,
  openPopup: () => void,
) => {
  if (status === 'pending')
    return (
      <Fade in>
        <IconButton edge="end" aria-label="delete" onClick={removeJob}>
          <DeleteIcon sx={{ color: 'white' }} />
        </IconButton>
      </Fade>
    );
  if (status === 'processing')
    return (
      <Fade in>
        <CircularProgress sx={{ color: '#00000042' }} />
      </Fade>
    );
  if (status === 'done')
    return (
      <Fade in>
        <IconButton edge="end" aria-label="content" onClick={openPopup}>
          <FormatColorTextIcon sx={{ color: 'white' }} />
        </IconButton>
      </Fade>
    );
};

const Uploader = () => {
  const classes = useStyles();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [popupContent, setPopupContent] = useState({ text: '', title: '' });
  const forceUpdate = useForeceUpdate();
  const { enqueueSnackbar } = useSnackbar();

  const listRef = useRef(null);
  // const MAX_NUM = 10;
  const { acceptedFiles, getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: {
        'image/*': [],
        // 'application/pdf': []
      },
    });

  useEffect(() => {
    const filtered = acceptedFiles.filter(
      (accepted) => !jobs.find((job: Job) => job.file.name === accepted.name),
    );
    let newJobs = [];
    for (let file of filtered) {
      const uniqueFilename = `${file.name}(${uuidv4()})`;
      const identifiableFile = new File([file], uniqueFilename, { type: file.type });
      newJobs.push({ file: identifiableFile, status: 'pending', content: '' } as Job);
    }
    setJobs([...jobs, ...newJobs]);
    // eslint-disable-next-line
  }, [acceptedFiles]);

  const removeJobByFilename = (filename: string) => {
    let newJobs = [...jobs];
    const index = newJobs.findIndex((job) => job.file.name === filename);
    newJobs.splice(index, 1);
    setJobs([...newJobs]);
    forceUpdate();
  };

  // const updateJobByFilename = (filename: string, newJob: Job) => {
  //   let newJobs = [...jobs];
  //   const index = newJobs.findIndex((job) => job.file.name === filename);
  //   newJobs[index] = newJob;
  //   setJobs([...newJobs]);
  //   forceUpdate();
  // };

  const pullResult = (filename: string): Promise<DocumentData> =>
    new Promise(async (resolve) => {
      while (true) {
        console.log('pulling', filename);
        const docRef = collection(firestore, 'documents');
        const q = query(docRef, where('name', '==', filename));
        const doc = (await getDocs(q)).docs[0];
        if (doc) {
          console.log(doc.data());
          resolve(doc.data());
          break;
        }
        await sleep(1000);
      }
    });

  const setJobsToProcessing = () => {
    let newJobs = jobs;
    for (let job of newJobs) job.status = 'processing';
    setJobs([...newJobs]);
    forceUpdate();
  };

  const setJobsToDone = (results: DocumentData[]) => {
    let newJobs = jobs;
    for (let result of results) {
      for (let job of jobs) {
        if (result.name === job.file.name) {
          job.content = result.content;
          job.status = 'done';
        }
      }
    }
    setJobs([...newJobs]);
    enqueueSnackbar('Text Detection is Done', { variant: 'success' });

    forceUpdate();
  };

  const process = async () => {
    // proces jobs
    let processes: Promise<DocumentData>[] = [];
    setJobsToProcessing();
    for (let job of jobs) {
      if (job.status === 'done') continue; // don't process 'done' jobs
      // upload file to storage
      const formData = new FormData();
      formData.append('File', job.file as Blob);
      const fileRef = ref(storage, job.file.name);
      console.log(job.file);
      await uploadBytes(fileRef, job.file);
      processes.push(pullResult(job.file.name));
    }
    const results = await Promise.all(processes);
    setJobsToDone(results);
  };

  const openContentPopup = (i: number) => {
    setPopupContent({ text: jobs[i].content, title: jobs[i].file.name });
    setOpen(true);
  };

  return (
    <Box className={classes.root}>
      <Slide in={!jobs.find((j) => j.status === 'processing')} direction="down">
        <AreaWrapper>
          <Area {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
            <input {...getInputProps()} />
            <Box
              sx={{
                margin: '15px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CloudUploadIcon sx={{ fontSize: '32px' }} />
              <Typography variant="h6" sx={{ fontWeight: '600' }}>
                DROP FILE HERE
              </Typography>
              <Typography variant="body1" sx={{ color: '#b8b9bd' }}>
                Drag and drop, or click to select your PNG, JPG, or PDF file
              </Typography>
            </Box>
          </Area>
        </AreaWrapper>
      </Slide>
      <List sx={{ flex: 5, width: '52%' }} ref={listRef}>
        {jobs.map((job, i) => (
          <Slide in={true} direction="down" container={listRef.current}>
            <ListItem
              sx={{ background: '#323645', borderRadius: '4px', padding: 0, marginBottom: '5px' }}
              secondaryAction={JobsActions(
                jobs[i].status,
                () => {
                  removeJobByFilename(job.file.name);
                },
                () => {
                  openContentPopup(i);
                },
              )}
            >
              <ListItemButton>
                <ListItemIcon sx={{ color: 'white' }}>
                  {job.file.type === 'application/pdf' ? <PictureAsPdfIcon /> : <CollectionsIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={job.file.name.replace(/ *\([^)]*\) */g, '')}
                  secondary={job.status.toUpperCase()}
                  secondaryTypographyProps={{ sx: { color: '#b8b9bd' } }}
                />
              </ListItemButton>
            </ListItem>
          </Slide>
        ))}
      </List>

      <Slide
        direction="up"
        in={!!jobs.find((j) => j.status === 'pending')}
        mountOnEnter
        unmountOnExit
      >
        <LoadingButton
          color="primary"
          variant="contained"
          startIcon={<MemoryIcon sx={{ fontSize: '32px' }} />}
          onClick={process}
          loading={!!jobs.find((job) => job.status === 'processing')}
          loadingPosition="start"
          sx={{
            marginBottom: '25px',
            position: 'fixed',
            bottom: '0px',
          }}
        >
          Process
        </LoadingButton>
      </Slide>
      <ContentPopup
        content={popupContent}
        close={() => {
          setOpen(false);
        }}
        open={open}
      />
      <PunctuationSelector />
    </Box>
  );
};

export default Uploader;
