/**
 * One-time script to set admin claims for the first user.
 * Usage: node set-admin.js <email>
 */
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // You need to download this from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address');
  process.exit(1);
}

admin.auth().getUserByEmail(email).then((user) => {
  return admin.auth().setCustomUserClaims(user.uid, { admin: true });
}).then(() => {
  console.log(`Admin claim set successfully for ${email}`);
  process.exit(0);
}).catch(error => {
  console.error('Error setting admin claim:', error);
  process.exit(1);
});
