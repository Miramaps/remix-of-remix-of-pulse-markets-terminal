// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQe63W8L9qI2PZnBmqTrKkr4_r3JLvSAg",
  authDomain: "pulse-49aae.firebaseapp.com",
  projectId: "pulse-49aae",
  storageBucket: "pulse-49aae.firebasestorage.app",
  messagingSenderId: "307616015374",
  appId: "1:307616015374:web:ee4ba1fad2f00e71b5885f",
  measurementId: "G-31PSVEGXNZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Set persistence to keep users logged in
setPersistence(auth, browserLocalPersistence);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Analytics (only in browser, and if supported)
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
export { analytics };

// Connect to emulators in development (optional - uncomment if using emulators)
// if (import.meta.env.DEV) {
//   connectFirestoreEmulator(db, "localhost", 8080);
//   connectAuthEmulator(auth, "http://localhost:9099");
// }

export default app;

