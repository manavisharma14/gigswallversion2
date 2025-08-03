import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC9qLZn46-QKDO9Zt-506cfdUbyOzedSys",
  authDomain: "gigswall-chat.firebaseapp.com",
  projectId: "gigswall-chat",
  storageBucket: "gigswall-chat.appspot.com", // ✅ FIXED
  messagingSenderId: "707310952282",
  appId: "1:707310952282:web:7f70dfee90340e256bdd63",
  measurementId: "G-N5MNPKMZH2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);