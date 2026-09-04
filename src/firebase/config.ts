// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAYvFaNzJ7YlwX2JEQ_-l9GwVcAcU-t-qg",
  authDomain: "sih26043-b587a.firebaseapp.com",
  projectId: "sih26043-b587a",
  storageBucket: "sih26043-b587a.firebasestorage.app",
  messagingSenderId: "255456203187",
  appId: "1:255456203187:web:aa7eb7c76c3cf2c26bbbc6",
  measurementId: "G-4CJY2JXCWL"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);