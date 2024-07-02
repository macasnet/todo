// firebase.js dosyası

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyClSjK8Otr9GpKGcsOvKICUY69n1hkxUxQ",
    authDomain: "todo-app-140d4.firebaseapp.com",
    projectId: "todo-app-140d4",
    storageBucket: "todo-app-140d4.appspot.com",
    messagingSenderId: "443815670641",
    appId: "1:443815670641:web:44c5f5221eff39aa23fcd0",
    measurementId: "G-KNCXNWNZ11"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
