
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAi1AhPGyc6ngQmPzWJkrx5IiTDDlRzR34",
  authDomain: "chat-aa4ac.firebaseapp.com",
  projectId: "chat-aa4ac",
  storageBucket: "chat-aa4ac.appspot.com",
  messagingSenderId: "47460914353",
  appId: "1:47460914353:web:5945a12657bd0e774cfe90"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();