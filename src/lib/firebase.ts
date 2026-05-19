import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDe12B8P2Gjz1-EOlvgQXhLSc1Bkh-VukY",
  authDomain: "spendsense-c77a4.firebaseapp.com",
  projectId: "spendsense-c77a4",
  storageBucket: "spendsense-c77a4.firebasestorage.app",
  messagingSenderId: "1088468598401",
  appId: "1:1088468598401:web:1d57259157c73059f19780",
  measurementId: "G-VJZFZ4GLV3"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
