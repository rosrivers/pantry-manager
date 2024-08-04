// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtWnqNrE2gh6zfvugtiF8hGEvbEbZxdU0",
  authDomain: "rosas-pantry-manager.firebaseapp.com",
  projectId: "rosas-pantry-manager",
  storageBucket: "rosas-pantry-manager.appspot.com",
  messagingSenderId: "689161147304",
  appId: "1:689161147304:web:60f07bdcfd34298ce1839d",
  measurementId: "G-203KHRN4XX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { firestore };