
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "banking-tayari.firebaseapp.com",
  projectId: "banking-tayari",
  storageBucket: "banking-tayari.appspot.com",
  messagingSenderId: "768052992817",
  appId: "1:768052992817:web:3f722b06237880ef2eae10",
  measurementId: "G-GN5ZN3CSZV"
};


export const app = initializeApp(firebaseConfig);
