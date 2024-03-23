import firebaseAdmin from "firebase-admin"
import serviceAccount from "./secret.json"

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      privateKey: serviceAccount.private_key,
      clientEmail: serviceAccount.client_email,
      projectId: serviceAccount.project_id,
    }),
    databaseURL: "https://sign-up-9453b.firebaseio.com",
  })
}

export const db = firebaseAdmin.firestore()
export { firebaseAdmin }
