import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAQTaOwWXu7En7r-GnYI-cwWs9axCa-l3U",
  authDomain: "retro-prod-786.firebaseapp.com",
  databaseURL: "https://retro-prod-786.firebaseio.com",
  projectId: "retro-prod-786",
  storageBucket: "retro-prod-786.appspot.com",
  messagingSenderId: "700582464458",
  appId: "1:700582464458:web:37d77798d0d88574955d33",
  measurementId: "G-8D2MQ5KNS5"
};

firebase.initializeApp(firebaseConfig);

firebase.analytics();
const database = firebase.database();
const firestore = firebase.firestore();

if (window.location.hostname === "localhost") {
  firebase.auth().useEmulator("http://localhost:9099/");
  firestore.settings({
    host: "localhost:8080",
    ssl: false
  });
  database.useEmulator("localhost", 9000);
}

export default firebase;
