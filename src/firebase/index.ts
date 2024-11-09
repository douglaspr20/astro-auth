// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAfYe8AzAmT0JW5BoIpc5LhaPhJ0-dsAZ4',
  authDomain: 'astro-authentication-90cc4.firebaseapp.com',
  projectId: 'astro-authentication-90cc4',
  storageBucket: 'astro-authentication-90cc4.firebasestorage.app',
  messagingSenderId: '435874576454',
  appId: '1:435874576454:web:5240210b7c450c7b88f247',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

auth.languageCode = 'en';

export const firebase = {
  app,
  auth,
};
