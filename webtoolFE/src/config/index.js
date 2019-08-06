import firebase from 'firebase';
import 'firebase/storage';


// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBMnosGGMlf7NGMbbPXTbe14KiVMY5aRnk",
    authDomain: "gmutata-48e94.firebaseapp.com",
    databaseURL: "https://gmutata-48e94.firebaseio.com",
    projectId: "gmutata-48e94",
    storageBucket: "gs://gmutata-48e94.appspot.com/",
    messagingSenderId: "443123020052",
    appId: "1:443123020052:web:2764f8aafb534c5f"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage()
export {
    storage, firebase as default
}