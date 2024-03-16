// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLDez3MsdYRnoZGXr1kvBefYfV5MGzsFM",
  authDomain: "projectmobile-797e9.firebaseapp.com",
  projectId: "projectmobile-797e9",
  storageBucket: "projectmobile-797e9.appspot.com",
  messagingSenderId: "512174301237",
  appId: "1:512174301237:web:1a624082ce2f8345cfd17c",
  measurementId: "G-51WW5SW7BN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

export { auth, db };
export default app;