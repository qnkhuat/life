import admin from 'firebase-admin';
import 'firebase/firestore';
import 'firebase/auth';

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECTID,
        privateKey: process.env.FIREBASE_PRIVATEKEY,
        clientEmail: process.env.FIREBASE_CLIENTEMAIL

      })
    });
  }
} catch (error) {
  /*
   * We skip the "already exists" message which is
   * not an actual error when we're hot-reloading.
   */
  if (!/already exists/u.test(error.message)) {
    // eslint-disable-next-line no-console
    console.error("Firebase admin initialization error", error.stack);
  }
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
