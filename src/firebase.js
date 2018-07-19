// src/firebase.js
import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyCbmAlEliQ7eJLrVUTFGIZ3O4gNq6sl18A",
    authDomain: "brewing-4e977.firebaseapp.com",
    databaseURL: "https://brewing-4e977.firebaseio.com",
    projectId: "brewing-4e977",
    storageBucket: "brewing-4e977.appspot.com",
    messagingSenderId: "113411537180"
};
firebase.initializeApp(config);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;
