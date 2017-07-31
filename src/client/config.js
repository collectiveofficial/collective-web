import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyCRzQgoAv-X_E9NvVjtqBqAI0EKs_vWDe0",
  authDomain: "collective-web.firebaseapp.com",
  databaseURL: "https://collective-web.firebaseio.com",
  projectId: "collective-web",
  storageBucket: "collective-web.appspot.com",
  messagingSenderId: "231206865941",
};


firebase.initializeApp(config);


export const ref = firebase.database().ref();
export const firebaseAuth = firebase.auth;
