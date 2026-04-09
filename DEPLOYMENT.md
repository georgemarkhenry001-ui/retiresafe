# RetireSafe Crypto - Deployment & Setup Guide

Follow these steps to deploy your production-ready retirement crypto platform.

## 1. Firebase Project Setup
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project named **RetireSafe Crypto**.
3. Enable **Authentication** and activate the **Email/Password** provider.
4. Enable **Cloud Firestore** in production mode.
5. Enable **Cloud Functions** (requires Blaze/Pay-as-you-go plan).
6. Enable **Firebase Hosting**.

## 2. Configure Frontend
1. In Firebase Console, go to **Project Settings**.
2. Add a **Web App** and copy the `firebaseConfig` object.
3. Open `/src/lib/firebase.ts` and replace the placeholder values with your actual config.

## 3. Set Up Cloud Functions (Email)
1. Get an API Key from [Resend](https://resend.com/).
2. Set the key in your Firebase environment:
   ```bash
   firebase functions:config:set resend.key="YOUR_RESEND_API_KEY"
   ```

## 4. Deployment
Run the following commands from the root directory:
```bash
# Install dependencies
npm install
cd functions && npm install && cd ..

# Build the frontend
npm run build

# Deploy everything
firebase deploy
```

## 5. Set Admin Privileges
To access the `/admin` dashboard, you need to set the `admin` custom claim on your account.

1. Create an account in the Firebase Console (Auth tab) with `admin@retiresafe.com`.
2. Run this one-time script (you can use a local Node script or a temporary Cloud Function):

```javascript
const admin = require('firebase-admin');
admin.initializeApp();

admin.auth().getUserByEmail('admin@retiresafe.com').then((user) => {
  return admin.auth().setCustomUserClaims(user.uid, { admin: true });
}).then(() => {
  console.log('Admin claim set successfully');
});
```

## 6. Testing the App
1. **Public Site**: Visit your hosting URL. Test the **Profit Calculator** and the **Contact Form**.
2. **Contact Form**: Submit a message. Check your Firestore `messages` collection.
3. **Admin Panel**: Go to `/admin`. Log in with your admin credentials.
4. **Dashboard**: View the messages, mark them as replied, and test the **CSV Export**.

---
**Security Note:** Ensure your `firestore.rules` are deployed to prevent unauthorized access to the `messages` collection.
