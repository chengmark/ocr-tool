import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'ocr-tool-363013.firebaseapp.com',
  databaseURL: 'https://ocr-tool-363013-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'ocr-tool-363013',
  storageBucket: 'ocr-tool-363013.appspot.com',
  messagingSenderId: '936535631789',
  appId: '1:936535631789:web:0cc2a1b31376f54b47e324',
  measurementId: 'G-MCGB62X1JV',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const firestore = getFirestore(app);

export { app, auth, storage, firestore };
