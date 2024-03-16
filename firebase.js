// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBGBEYCK8M0AuvizZfPwh1oTeilEZ_RArg",
  authDomain: "mobile-project-f8ff2.firebaseapp.com",
  projectId: "mobile-project-f8ff2",
  storageBucket: "mobile-project-f8ff2.appspot.com",
  messagingSenderId: "87610408159",
  appId: "1:87610408159:web:4ee27318f28c5b8c24bd6a",
  measurementId: "G-XHD26HYMKS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

export { auth, db };
export default app;