/** Firebase Web app config (client-side identifiers, not admin credentials). */
import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAxu9jNjOFf4iZrTWJuO3gOlivDbWI3RNE",
  authDomain: "pobe-web-project.firebaseapp.com",
  projectId: "pobe-web-project",
  storageBucket: "pobe-web-project.firebasestorage.app",
  messagingSenderId: "23690339007",
  appId: "1:23690339007:web:1d687ffd540fee6ea8dc0a",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
