// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDe6IdaW9ywo3bwvy5-rvO04icHzHmfJxQ",
  authDomain: "twitter-e364c.firebaseapp.com",
  projectId: "twitter-e364c",
  storageBucket: "twitter-e364c.appspot.com",
  messagingSenderId: "435324586364",
  appId: "1:435324586364:web:4e0b1cb5a13493a24e3cf9",
  measurementId: "G-8WJVQKRQ8R"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };