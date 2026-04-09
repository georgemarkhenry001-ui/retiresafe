import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// These values should be replaced with your actual Firebase project configuration
// from the Firebase Console (Project Settings > General > Your apps)
let app;
let auth;
let db;
let functions;

try {
  const isConfigValid = !!import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== "";
  
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "missing-api-key",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "missing-auth-domain",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "missing-project-id",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "missing-storage-bucket",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "missing-sender-id",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "missing-app-id"
  };

  if (!isConfigValid) {
    console.warn("Firebase API Key is missing. Please configure VITE_FIREBASE_API_KEY in your environment variables.");
  }

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  functions = getFunctions(app);
} catch (error) {
  console.error("Firebase initialization failed:", error);
  // Provide dummy objects to prevent crashes on import
  app = {} as any;
  auth = { onAuthStateChanged: () => () => {} } as any;
  db = {} as any;
  functions = {} as any;
}

export { auth, db, functions };
export default app;
