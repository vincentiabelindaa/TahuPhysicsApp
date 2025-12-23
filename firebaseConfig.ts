// firebaseConfig.ts
import { initializeApp } from "firebase/app";
// Kita tambah import Auth dan Firestore di sini
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Konfigurasi dari Firebase Console (Punya kamu)
const firebaseConfig = {
  apiKey: "AIzaSyAlWM8T214ELgc4doU_vGMnTYJWtedDPgU",
  authDomain: "tahuphysicsapp.firebaseapp.com",
  projectId: "tahuphysicsapp",
  storageBucket: "tahuphysicsapp.firebasestorage.app",
  messagingSenderId: "972268044090",
  appId: "1:972268044090:web:d92353cf99cdf12b251a03"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth & Firestore dan Export biar bisa dipake di file lain
export const auth = getAuth(app);
export const db = getFirestore(app);