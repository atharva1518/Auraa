# Aura Auth Tester

Aura Auth Tester is an internal Next.js application used for testing Firebase Authentication (Google & Phone) and validating the API endpoints of the FastAPI backend.

## Getting Started

1. Copy `.env.local.example` to `.env.local` and fill in your Firebase Web SDK credentials.
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000)

## Firebase Configuration

To fully support both Google and Phone authentication, you must configure your Firebase project.

### 1. Enable Google Provider
1. Go to Firebase Console > Authentication > Sign-in method.
2. Click "Add new provider" -> "Google".
3. Enable it and save.

### 2. Enable Phone Provider
1. Go to Firebase Console > Authentication > Sign-in method.
2. Click "Add new provider" -> "Phone".
3. Enable it.
4. **Important for Development**: Add test phone numbers!
   - Under the "Phone" provider settings, look for "Phone numbers for testing".
   - Add a number (e.g., `+1 555-555-5555`) and a verification code (e.g., `123456`).
   - Using test numbers prevents SMS quota consumption and allows instant testing.

### 3. Authorized Domains
For both Google Sign-In and Phone Auth (reCAPTCHA) to work, the domain where this app runs must be authorized.
1. Go to Firebase Console > Authentication > Settings > Authorized domains.
2. Ensure `localhost` is listed. Add your production domain if deploying.

### 4. Firebase Web SDK Configuration
You need your Firebase config object to populate `.env.local`.
1. Go to Project Settings > General > Your apps.
2. Add a web app if you haven't.
3. Copy the configuration values into `.env.local`.

### 5. Backend Configuration
The FastAPI backend requires the Firebase Admin SDK service account key.
1. Go to Project Settings > Service accounts.
2. Click "Generate new private key".
3. Save the JSON file in `apps/api/app/firebase-service-account.json`.
4. Update `apps/api/.env` as described in `apps/api/.env.example`.

## Features
- **Provider Selection**: Seamlessly switch between Google and Phone Auth.
- **Developer Panel**: View complete Firebase context (UID, Token, Provider) and API Logs.
- **Authentication State**: Real-time permanent status of your Firebase and Backend connectivity.
- **API Playground**: Test backend endpoints with automatically attached Bearer tokens.
