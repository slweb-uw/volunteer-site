import firebaseAdmin, { type ServiceAccount } from "firebase-admin";

const certification = {
  privateKey: process.env.FB_PRIVATE_KEY,
  clientEmail: process.env.FB_CLIENT_EMAIL,
  projectId: process.env.FB_PROJECT_ID,
} satisfies ServiceAccount;

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(certification),
  });
}

export { firebaseAdmin };
