import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCVCYHRM8HbU3juleByqm59L69_0sY6cxo",
  authDomain: "abhi-9056-final.firebaseapp.com",
  projectId: "abhi-9056-final",
  storageBucket: "abhi-9056-final.firebasestorage.app",
  messagingSenderId: "526573833274",
  appId: "1:526573833274:web:ed02d9bfa9bf1b3e1b7903",
  measurementId: "G-P3WM4Z5HS8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();