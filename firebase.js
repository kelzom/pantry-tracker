// Import the functions you need from the SDKs you need


import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbiwGyJQrS_mf8MT2Q5PBOrguv72VtcOk",
  authDomain: "pantry-tracker-44fe1.firebaseapp.com",
  projectId: "pantry-tracker-44fe1",
  storageBucket: "pantry-tracker-44fe1.appspot.com",
  messagingSenderId: "1003543807856",
  appId: "1:1003543807856:web:9ca2ed986e49469a89f1b5",
  measurementId: "G-NT18LZV2L9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { firestore, storage };