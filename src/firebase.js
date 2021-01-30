import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyBL0zV2DtcLdaqXa4sJoaE_iZfc5-rE4dg",
    authDomain: "todos-cf72d.firebaseapp.com",
    projectId: "todos-cf72d",
    storageBucket: "todos-cf72d.appspot.com",
    messagingSenderId: "746924582923",
    appId: "1:746924582923:web:4adb42d9df71ecbaec3f0e"
}

const Firebase = firebase.initializeApp(firebaseConfig);

export default Firebase