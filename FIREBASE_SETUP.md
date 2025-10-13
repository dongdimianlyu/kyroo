# Firebase Authentication Setup Guide

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "kyroo-app")
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Click on it and toggle "Enable"
   - **Google**: Click on it, toggle "Enable", and add your project support email

## 3. Set up Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database
5. Click "Done"

## 4. Get Firebase Configuration

1. Go to Project Settings (gear icon) → General tab
2. Scroll down to "Your apps" section
3. Click "Add app" → Web app (</>) icon
4. Register your app with a nickname
5. Copy the Firebase configuration object

## 5. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Replace the values with the ones from your Firebase configuration.

## 6. Firestore Security Rules

Update your Firestore security rules to allow authenticated users to read/write their own data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Add more rules for other collections as needed
  }
}
```

## 7. Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to `/signup` to test user registration
3. Navigate to `/login` to test user login
4. Check the Firebase Console to see if users are being created

## 8. Production Deployment

For production deployment:

1. Update Firestore security rules for production
2. Set up proper domain restrictions in Firebase Authentication
3. Configure Firebase Hosting if needed
4. Update environment variables in your deployment platform

## Troubleshooting

- **"Firebase: Error (auth/configuration-not-found)"**: Check your environment variables
- **"Firebase: Error (auth/invalid-api-key)"**: Verify your API key is correct
- **"Firebase: Error (auth/domain-not-authorized)"**: Add your domain to authorized domains in Firebase Console
- **Firestore permission denied**: Check your security rules

## Features Included

✅ Email/Password authentication
✅ Google OAuth authentication  
✅ Password reset functionality
✅ User profile management
✅ Protected routes
✅ User session persistence
✅ Firestore user data storage
