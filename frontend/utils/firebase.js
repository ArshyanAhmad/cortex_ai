// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
   authDomain: "achilies-1642d.firebaseapp.com",
   projectId: "achilies-1642d",
   storageBucket: "achilies-1642d.firebasestorage.app",
   messagingSenderId: "664727015423",
   appId: "1:664727015423:web:4e05e5a27cdb8d130a21ca",
   measurementId: "G-BX2Q1X79BF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
