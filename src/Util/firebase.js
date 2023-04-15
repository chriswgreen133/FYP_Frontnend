import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/analytics'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// var firebaseConfig = {
//     apiKey: "AIzaSyB32T42w68Wgk54oJWR3cPD7V9IO3fV_9M",
//     authDomain: "okay-945dc.firebaseapp.com",
//     databaseURL: "https://okay-945dc.firebaseio.com",
//     projectId: "okay-945dc",
//     storageBucket: "okay-945dc.appspot.com",
//     messagingSenderId: "562063747411",
//     appId: "1:562063747411:web:b8ff65792838444064d9a6",
//     measurementId: "G-88LWVF5LM3"
// };

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB_J2ykwUsdjaCPpoebyitUsmjb4gULEzQ",
    authDomain: "speechwizard-bfa5e.firebaseapp.com",
    projectId: "speechwizard-bfa5e",
    storageBucket: "speechwizard-bfa5e.appspot.com",
    messagingSenderId: "780826873020",
    appId: "1:780826873020:web:3c078e8649afc49008d4b9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage()

firebase.analytics()

export {
    storage, firebase as default
}

