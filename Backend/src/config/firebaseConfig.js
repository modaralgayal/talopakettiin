// Import specific functions from the modular Admin SDK
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getSecrets } from "../utils/secrets.js";
// Import other services as you need them, e.g.:
// import { getFirestore } from 'firebase-admin/firestore';
// import { getStorage } from 'firebase-admin/storage';

// The path to your service account key JSON file
// IMPORTANT: As discussed, directly importing a local JSON file is NOT
// recommended for production deployments. Use environment variables/secrets manager instead.
// For development/testing, this *might* work, but be aware of the security implications.
//import serviceAccount from "../keys/serviceAccountKey.json" with { type: "json" }; // Note: 'assert' is deprecated, 'with' is preferred in newer Node.js versions, but handling secrets via env vars is best.

let app = null;
let auth = null;

export async function initFirebaseAdmin() {
  const secrets = await getSecrets();
  const serviceKey = JSON.parse(secrets.SERVICE_ACCOUNT_KEY);

  app = initializeApp({
    credential: cert(serviceKey),
    // Add other config if needed
  });

  auth = getAuth(app);
  console.log("Firebase Admin SDK initialized!");
  return { app, auth };
}

export { app, auth };

// Now you access services using the app instance or standalone functions
// export const db = getFirestore(app);
// export const storage = getStorage(app);

// You can now use the 'auth' object to verify ID tokens!
/*
async function verifyToken(idToken) {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    console.log('Token is valid. User UID:', decodedToken.uid);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    // Handle error, token is invalid
    return null;
  }
}
*/
