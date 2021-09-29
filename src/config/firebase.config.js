import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyBnZtNieL1vCWKS-ueQqScq0apKM6z8fe4",
  authDomain: "d3tree-c5771.firebaseapp.com",
  projectId: "d3tree-c5771",
  storageBucket: "d3tree-c5771.appspot.com",
  messagingSenderId: "549107471455",
  appId: "1:549107471455:web:40bf444a73361072ac77ea",
  measurementId: "G-Z5TY2C82GM",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
export default db;