import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-9zZzfheMpd71Tn74oTyKTeCld_-RBU4",
  authDomain: "al-driven-crime-anal-lbbcplfo.firebaseapp.com",
  projectId: "al-driven-crime-anal-lbbcplfo",
  storageBucket: "al-driven-crime-anal-lbbcplfo.firebasestorage.app",
  messagingSenderId: "258283061207",
  appId: "1:258283061207:web:ee834f3f21a0f6cf0ad592",
  measurementId: "G-44XKXV7FLF"
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

console.log("Firebase & Auth initialized successfully:", app);
