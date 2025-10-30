# Firebase Setup Guide

This guide will help you set up Firebase for your Glucose Tracker app to enable cloud sync across devices.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `glucose-tracker` (or your preferred name)
4. Click "Continue"
5. Disable Google Analytics (optional, not needed for this app)
6. Click "Create project"
7. Wait for the project to be created, then click "Continue"

## Step 2: Register Your Web App

1. In the Firebase console, click the **Web icon** (`</>`) to add a web app
2. Enter app nickname: `Glucose Tracker Web`
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. You'll see a Firebase configuration object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

6. **Copy these values** - you'll need them in the next step

## Step 3: Update Firebase Configuration

1. Open `src/firebase/config.js` in your project
2. Replace the placeholder config with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

## Step 4: Enable Authentication

1. In the Firebase console, go to **Build** > **Authentication**
2. Click "Get started"
3. Click on the "Sign-in method" tab
4. Click on "Email/Password"
5. Enable "Email/Password" (first toggle)
6. Click "Save"

## Step 5: Set Up Firestore Database

1. In the Firebase console, go to **Build** > **Firestore Database**
2. Click "Create database"
3. Select "Start in **test mode**" (for development)
   - Note: This allows read/write access for 30 days. You'll want to update security rules before going to production.
4. Choose your Cloud Firestore location (choose one close to your users)
5. Click "Enable"

## Step 6: Configure Security Rules (Important!)

After testing, update your Firestore security rules for better security:

1. In the Firebase console, go to **Firestore Database** > **Rules**
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write their own data
    match /accounts/{accountId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == accountId;
    }
  }
}
```

3. Click "Publish"

## Step 7: Deploy Your App

1. Build your app:
   ```bash
   npm run build
   ```

2. Test locally:
   ```bash
   npm run preview
   ```

3. Deploy to GitHub Pages (or your preferred hosting):
   - Push your changes to GitHub
   - Merge to main branch
   - GitHub Actions will automatically deploy

## How It Works

### Data Structure

Your data is stored in Firestore with this structure:

```
/accounts/{userId}/
  ├── users/{userId}           # User profiles
  │   ├── id: number
  │   ├── name: string
  │   └── createdAt: timestamp
  │
  └── entries/{entryId}        # Glucose entries
      ├── id: number
      ├── userId: number
      ├── measurement: number
      ├── timePeriod: string
      ├── timestamp: string
      └── medications: array
```

### Data Sync

- **Login**: App loads all your data from Firebase
- **Add/Edit/Delete**: Changes are instantly synced to Firebase
- **Multi-Device**: Any device you log in on will have your latest data
- **Local Migration**: First time you log in, any local data is automatically uploaded to cloud

## Troubleshooting

### Authentication Errors

- **"Firebase: Error (auth/email-already-in-use)"**: This email is already registered. Try signing in instead.
- **"Firebase: Error (auth/weak-password)"**: Password must be at least 6 characters.
- **"Firebase: Error (auth/invalid-email)"**: Enter a valid email address.

### Sync Errors

- **Data not syncing**: Check your internet connection
- **"Permission denied"**: Make sure you've set up Firestore security rules correctly
- **Old data showing**: Try logging out and logging back in

### Development Tips

- Use different Firebase projects for development and production
- Keep your Firebase config values safe (don't commit sensitive data to public repos)
- Monitor usage in Firebase console to stay within free tier limits

## Firebase Free Tier Limits

The free "Spark" plan includes:
- **Authentication**: Unlimited users
- **Firestore**:
  - 1 GB storage
  - 50,000 reads/day
  - 20,000 writes/day
  - 20,000 deletes/day

This is more than enough for personal use and small-scale apps!

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
