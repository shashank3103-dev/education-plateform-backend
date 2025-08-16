const admin = require("firebase-admin");
// const serviceAccount = require("../serviceAccountKey.json"); // <- download from Firebase console
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
