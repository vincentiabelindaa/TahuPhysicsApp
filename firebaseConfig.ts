import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC3f-0GiR87QPgcX-T645qh_c6ztuTjqhg",
  authDomain: "tahuphysicsapp-pawm.firebaseapp.com",
  projectId: "tahuphysicsapp-pawm",
  storageBucket: "tahuphysicsapp-pawm.firebasestorage.app",
  messagingSenderId: "716467447934",
  appId: "1:716467447934:web:eabe6a1f17f0e5099a502f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);