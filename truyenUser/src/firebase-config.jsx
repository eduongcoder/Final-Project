// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// Thay thế bằng cấu hình Firebase của bạn
const firebaseConfig = {
  apiKey: "AIzaSyArV2R0k4pzaao_J9YJq9kHQ3M2SdI0fRM",
  authDomain: "webtruyen-9b4ed.firebaseapp.com",
  projectId: "webtruyen-9b4ed",
  storageBucket: "webtruyen-9b4ed.firebasestorage.app",
  messagingSenderId: "78632674915",
  appId: "1:78632674915:web:dc6521a309c59c8e11ba56",
  measurementId: "G-W50PJ55MS0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };