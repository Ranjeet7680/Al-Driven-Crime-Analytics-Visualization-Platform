import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZCEY8EaB1JqjVkJHZdO4tex0X5-qtlw4",
  authDomain: "true-carrer-ai.firebaseapp.com",
  projectId: "true-carrer-ai",
  storageBucket: "true-carrer-ai.firebasestorage.app",
  messagingSenderId: "306160123485",
  appId: "1:306160123485:web:853495a2865b44640217b4",
  measurementId: "G-5BXL092K2V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Make them available globally
window.firebaseApp = app;
window.firebaseAnalytics = analytics;
window.firebaseAuth = auth;

// Global auth helper functions
window.signInWithGoogle = () => signInWithPopup(auth, googleProvider);
window.signOutFromFirebase = () => signOut(auth);
window.onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback);
window.signInWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
window.signUpWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);

console.log("Firebase Auth system initialized successfully:", app);
