import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage} from "firebase/storage";
import { getAnalytics } from "firebase/analytics"

const CLIENT_CONFIG = {
  apiKey: "AIzaSyC66cXBWNy-YkSmwmxrUfIXdIMLZxIdduQ",
  authDomain: "sign-up-9453b.firebaseapp.com",
  databaseURL: "https://sign-up-9453b.firebaseio.com",
  projectId: "sign-up-9453b",
  storageBucket: "sign-up-9453b.appspot.com",
  messagingSenderId: "241156593533",
  appId: "1:241156593533:web:8a02abb4bfe1463b",
  measurementId: "G-E0Y180FKVX",
};
const app = getApps().length === 0 ? initializeApp(CLIENT_CONFIG) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const getAppAnalytics = () => getAnalytics(app)
// const analytics = getAnalytics(app);
setPersistence(auth, browserLocalPersistence);

export { auth, db, storage, getAppAnalytics };
