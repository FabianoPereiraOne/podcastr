import firebase from 'firebase';
import "firebase/database";

let firebaseConfig = {
    apiKey: "AIzaSyAG0K4XWOz-D7XK0Uwd4iap9gWSK_hBEbc",
    authDomain: "podcastr-87ff0.firebaseapp.com",
    databaseURL: "https://podcastr-87ff0-default-rtdb.firebaseio.com",
    projectId: "podcastr-87ff0",
    storageBucket: "podcastr-87ff0.appspot.com",
    messagingSenderId: "1079898581322",
    appId: "1:1079898581322:web:494ca7ff2571e6796479b3",
    measurementId: "G-1VH714KKQN"
};

if(!firebase.apps.length){
    // Initialize Firebases
    firebase.initializeApp(firebaseConfig);
}

export default firebase

