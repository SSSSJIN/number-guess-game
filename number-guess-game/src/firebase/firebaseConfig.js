import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD75j821FPjzU2ElKS0GMRzxEPevDxnGRY",
  authDomain: "number-guess-game-3fcb9.firebaseapp.com",
  projectId: "number-guess-game-3fcb9",
  storageBucket: "number-guess-game-3fcb9.firebasestorage.app",
  messagingSenderId: "651798965463",
  appId: "1:651798965463:web:8d1322355863b49f0a9492",
  measurementId: "G-LDG2Z2M62N"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);