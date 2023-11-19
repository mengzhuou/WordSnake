// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANXud4iv2GeaHuobuzUsNdimBrLSQ0Y84",
  authDomain: "word-snake-project.firebaseapp.com",
  projectId: "word-snake-project",
  storageBucket: "word-snake-project.appspot.com",
  messagingSenderId: "280156502016",
  appId: "1:280156502016:web:28ca895181243c1ae580e5",
  measurementId: "G-Q56Y2GJEG6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default getFirestore();