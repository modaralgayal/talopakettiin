// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBk4fj5aLAAr45wp3U3HawCS_aZgz6Qwzo",
  authDomain: "talopakettiin.firebaseapp.com",
  projectId: "talopakettiin",
  storageBucket: "talopakettiin.firebasestorage.app",
  messagingSenderId: "438256702288",
  appId: "1:438256702288:web:0fc01695843a0b16221255",
  measurementId: "G-0SQXCYNMBK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
