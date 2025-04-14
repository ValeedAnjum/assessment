import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBR8PuEg9-mrmlhRLPUlPsIhxzjoc6Nfss",
  authDomain: "aimnovo.firebaseapp.com",
  projectId: "aimnovo",
  storageBucket: "aimnovo.firebasestorage.app",
  messagingSenderId: "908732412631",
  appId: "1:908732412631:web:08dfbab1eac71dafbaf692",
};

let app: FirebaseApp;
let auth: Auth;

if (typeof window !== "undefined" && !getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
}

export { auth };
