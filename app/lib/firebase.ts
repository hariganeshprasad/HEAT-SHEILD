import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAW1GxdSrf6wRjCH8WQNxE6jfuH610B-3k",
  authDomain: "heatsheild-ac2d3.firebaseapp.com",
  projectId: "heatsheild-ac2d3",
  storageBucket: "heatsheild-ac2d3.firebasestorage.app",
  messagingSenderId: "1043772028857",
  appId: "1:1043772028857:web:7fe78bee11eac240d1e868",
  measurementId: "G-3SM2CX6X1R"
};

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);

export const firebaseApp: FirebaseApp | null = hasFirebaseConfig
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const auth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null;
