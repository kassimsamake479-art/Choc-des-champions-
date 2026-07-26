// ⚠️ REMPLACE les valeurs ci-dessous par CELLES DE TON PROJET FIREBASE.
// Tu les trouves dans : Firebase Console → ⚙️ Paramètres du projet → tes applications → "SDK setup and configuration"

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB6kPEDuxP3xgONQ_N8MyLPk86zSL-0V80",
  authDomain: "choc-des-champions.firebaseapp.com",
  projectId: "choc-des-champions",
  storageBucket: "choc-des-champions.firebasestorage.app",
  messagingSenderId: "691664453270",
  appId: "1:691664453270:web:d466718736ae5be9cd0cb7"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
