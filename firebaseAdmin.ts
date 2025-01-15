import firebaseAdmin from "firebase-admin";
import serviceAccount from "./secret.json";

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      privateKey: process.env.FB_PRIVATE_KEY,
      clientEmail: process.env.FB_CLIENT_EMAIL,
      projectId: process.env.FB_PROJECT_ID,
    }),
    databaseURL: "https://sign-up-9453b.firebaseio.com",
  });
}

export { firebaseAdmin };
