import * as firebaseClient from "firebase/app";
import "firebase/firestore";
import "firebase/database";
import "firebase/auth";
import "firebase/analytics";

if (typeof window !== "undefined" && !firebaseClient.apps.length) {
  const CLIENT_CONFIG = {
    apiKey: "AIzaSyC66cXBWNy-YkSmwmxrUfIXdIMLZxIdduQ",
    authDomain: "sign-up-9453b.firebaseapp.com",
    databaseURL: "https://sign-up-9453b.firebaseio.com",
    projectId: "sign-up-9453b",
    storageBucket: "sign-up-9453b.appspot.com",
    messagingSenderId: "241156593533",
    appId: "1:241156593533:web:8a02abb4bfe1463b",
    measurementId: "G-E0Y180FKVX"
  };

  firebaseClient.initializeApp(CLIENT_CONFIG);
  firebaseClient
    .auth()
    .setPersistence(firebaseClient.auth.Auth.Persistence.LOCAL);
  (window as any).firebase = firebaseClient;
}

export { firebaseClient };
