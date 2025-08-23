const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json"); // <- download from Firebase console

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;

// const admin = require("firebase-admin");

// if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
//   throw new Error("FIREBASE_SERVICE_ACCOUNT env var is not set!");
// }

// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// module.exports = admin;

// const admin = require("firebase-admin");

// if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
//   throw new Error("FIREBASE_SERVICE_ACCOUNT env var is not set!");
// }

// let serviceAccount;
// try {
//   serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
// } catch (err) {
//   console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT env var");
//   throw err;
// }

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// console.log("✅ Firebase Admin initialized");

// module.exports = admin;
