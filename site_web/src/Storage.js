import firebase from 'firebase';
var firebaseConfig = {
    apiKey: "AIzaSyBMP189erP8F7EVbDHlNrQbXmYKcnMUowI",
    authDomain: "piscineconnectee-8ac87.firebaseapp.com",
    projectId: "piscineconnectee-8ac87",
    storageBucket: "piscineconnectee-8ac87.appspot.com",
    messagingSenderId: "168684260012",
    appId: "1:168684260012:web:2b23da940edc6e32c72d09",
    measurementId: "G-EJQDL9VDW1"
};
 
const firebaseApp=firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
export default db;

