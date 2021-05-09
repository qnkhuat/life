// Contain firebase storage to use at server side
const admin = require('firebase-admin');


try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
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

const firestore = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

async function storageGetUrl(path){
  // These options will allow temporary read access to the file
  const options = {
    version: 'v2', // defaults to 'v2' if missing.
    action: 'read',
    expires: Date.now() + 2 * 60 * 60 * 1000, // 2 hourt stas
  };

  // Get a v2 signed URL for the file
  const [url] = await storage
    .bucket()
    .file(path)
    .getSignedUrl(options);
  return url;
}

export { firestore, auth, storage, storageGetUrl };
