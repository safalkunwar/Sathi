# Troubleshooting Guide - SATHI Project

This document provides a troubleshooting guide for common issues encountered during the development, deployment, and operation of the SATHI Firebase application. It aims to help developers and administrators quickly diagnose and resolve problems, ensuring smooth operation and minimizing downtime.

## 1. Authentication Issues

### 1.1. `Firebase: Error (auth/configuration-not-found)`

*   **Symptom:** Users cannot sign in, and the console shows `Firebase: Error (auth/configuration-not-found)`.
*   **Probable Cause:** The Firebase client SDK is not correctly initialized with the project's authentication configuration, or the configuration in the Firebase Console does not match the client-side configuration.
*   **Resolution Steps:**
    1.  **Verify `.env` variables:** Ensure all `VITE_FIREBASE_` environment variables in `.env` are correctly set and match the values from your Firebase project settings in the Firebase Console.
    2.  **Check `src/firebase.ts`:** Confirm that `firebaseConfig` object is correctly populated at runtime (use `console.log(firebaseConfig)` before `initializeApp`).
    3.  **Firebase Console Verification:**
        *   Go to your Firebase project in the Firebase Console.
        *   Navigate to **Project settings > General** and verify that the Web app configuration (API Key, Auth Domain, Project ID, App ID) matches your `.env` file.
        *   Navigate to **Authentication > Sign-in method** and ensure that the authentication providers you intend to use (e.g., Email/Password, Google) are enabled.
        *   For Google Sign-In, ensure **Authorized domains** are correctly configured (e.g., `localhost`, your production domain).
        *   Verify **OAuth consent screen** settings.
    4.  **Missing `.firebaserc` or `firebase.json`:** Ensure these files exist in your project root and correctly link to your Firebase project. If missing, create them and link using `firebase use --add`.
    5.  **Vite Configuration:** Confirm `vite.config.ts` is correctly configured to load environment variables.

### 1.2. Users Cannot Sign In with Google

*   **Symptom:** Google Sign-In fails or redirects incorrectly.
*   **Probable Cause:** Incorrect configuration of Google Sign-In in Firebase Console or Google Cloud Console.
*   **Resolution Steps:**
    1.  **Firebase Console:** Go to **Authentication > Sign-in method > Google** and ensure it's enabled.
    2.  **Authorized Domains:** Verify that all domains where your app is hosted (e.g., `localhost`, `your-app-domain.com`) are listed under **Authorized domains** in Firebase Authentication settings.
    3.  **Google Cloud Console:**
        *   Go to [Google Cloud Console](https://console.cloud.google.com/).
        *   Select your project.
        *   Navigate to **APIs & Services > OAuth consent screen** and ensure it's configured and published.
        *   Navigate to **APIs & Services > Credentials**.
        *   Check your **Web client (OAuth) ID**. Ensure **Authorized JavaScript origins** and **Authorized redirect URIs** include all necessary URLs.

### 1.3. Custom Claims Not Updating

*   **Symptom:** User roles (e.g., `admin`, `companion`) are not correctly reflected in `request.auth.token.role` in security rules or client-side.
*   **Probable Cause:** Cloud Function for setting custom claims is not triggered, has errors, or has not been deployed.
*   **Resolution Steps:**
    1.  **Check Cloud Function Logs:** Review logs for `onUserCreate`, `onCompanionCreated`, and `setUserRole` functions in Cloud Logging for errors or unexpected behavior.
    2.  **Function Deployment:** Ensure the Cloud Functions responsible for setting custom claims are correctly deployed.
    3.  **Token Refresh:** Firebase ID tokens are cached. Users might need to re-authenticate or wait for the token to refresh (typically every hour) for new claims to take effect. For immediate testing, force token refresh on the client-side.

## 2. Firestore Issues

### 2.1. Permission Denied (Firestore Security Rules)

*   **Symptom:** Read or write operations to Firestore fail with `PERMISSION_DENIED` errors.
*   **Probable Cause:** Security rules are too restrictive or do not correctly evaluate the user's permissions.
*   **Resolution Steps:**
    1.  **Firebase Console > Firestore Database > Rules:** Review the security rules for the affected collection.
    2.  **Rule Simulator:** Use the Firebase Rules Simulator in the Firebase Console to test specific read/write operations with different authentication states (authenticated, unauthenticated, specific user UIDs, custom claims).
    3.  **`request.auth` and `resource.data`:** Ensure that conditions involving `request.auth.uid`, `request.auth.token.role`, `resource.data.userId`, etc., are correctly written and match the expected values.
    4.  **Data Validation:** If `allow write` rules include data validation (e.g., `request.resource.data.keys().hasOnly(...)`), ensure the client is sending only the allowed fields.

### 2.2. Slow Queries or High Read Costs

*   **Symptom:** Firestore queries are slow, or daily read counts are unexpectedly high.
*   **Probable Cause:** Missing or inefficient indexes, broad queries, or excessive real-time listeners.
*   **Resolution Steps:**
    1.  **Firebase Console > Firestore Database > Indexes:** Check for suggested indexes. Create any missing composite indexes required by your queries.
    2.  **Query Optimization:**
        *   Ensure `where` clauses and `orderBy` clauses are used effectively.
        *   Avoid `get()` operations within loops. Use `in` queries or batch reads.
        *   Use `limit()` for all list queries.
    3.  **Listener Management:** Ensure `onSnapshot` listeners are properly unsubscribed when no longer needed.
    4.  **Denormalization:** Review `FirestoreSchema.md` for denormalization strategies. If reads are still high, consider further denormalization for frequently accessed data.

## 3. Cloud Functions Issues

### 3.1. Function Not Triggering or Failing

*   **Symptom:** Cloud Functions (e.g., `onBookingCreate`, `onMessageCreate`) are not executing or are failing silently.
*   **Probable Cause:** Incorrect trigger configuration, deployment issues, or errors in the function code.
*   **Resolution Steps:**
    1.  **Cloud Logging:** Check the logs for the specific function in Cloud Logging. Look for error messages, stack traces, or `console.log` outputs.
    2.  **Trigger Configuration:** Verify that the function's trigger (e.g., `onDocumentCreate`, `onUpdate`, `onRequest`) is correctly defined and matches the event you expect.
    3.  **Deployment Status:** Ensure the function is deployed and active in the Firebase Console > Functions section.
    4.  **Permissions:** Check if the Cloud Functions service account has the necessary permissions to access other Firebase services (e.g., Firestore, Auth, FCM).
    5.  **Environment Variables:** Ensure all environment variables required by the function are correctly configured.

### 3.2. Cold Start Latency

*   **Symptom:** Cloud Functions take a long time to respond, especially after periods of inactivity.
*   **Probable Cause:** Default cold start behavior for infrequently used functions.
*   **Resolution Steps:**
    1.  **`minInstances`:** For critical, latency-sensitive functions, configure `minInstances` to keep them warm (e.g., `functions.runWith({ minInstances: 1 }).https.onCall(...)`). Be mindful of increased costs.
    2.  **Code Optimization:** Keep function bundles small and efficient. Avoid unnecessary imports.
    3.  **Memory Allocation:** Adjust memory allocation for the function. More memory can sometimes reduce execution time.

## 4. Storage Issues

### 4.1. File Upload/Download Permissions Denied

*   **Symptom:** Users cannot upload or download files from Firebase Storage.
*   **Probable Cause:** Incorrect Storage Security Rules.
*   **Resolution Steps:**
    1.  **Firebase Console > Storage > Rules:** Review the security rules for the affected storage paths.
    2.  **Rule Simulator:** Use the Firebase Rules Simulator to test specific read/write operations with different authentication states.
    3.  **`request.auth` and `resource.metadata`:** Ensure conditions involving `request.auth.uid` or custom metadata (e.g., `resource.metadata.companionId`) are correctly applied.

## 5. General Application Issues

### 5.1. Unexpected Behavior or Crashes

*   **Symptom:** The application behaves unexpectedly or crashes without clear error messages.
*   **Probable Cause:** Unhandled errors, race conditions, or client-side bugs.
*   **Resolution Steps:**
    1.  **Console Logs:** Check the browser console for JavaScript errors or warnings.
    2.  **Error Boundary:** Ensure `ErrorBoundary` component (as implemented in `App.tsx`) is catching UI errors.
    3.  **Firebase Crashlytics:** If integrated, check Crashlytics reports for client-side crashes.
    4.  **Network Tab:** Use browser developer tools to inspect network requests and responses for API failures.
    5.  **State Management:** Review React component state management for potential issues or race conditions.

### 5.2. Notifications Not Received

*   **Symptom:** Push notifications are not delivered to users.
*   **Probable Cause:** Incorrect FCM configuration, missing VAPID key, or issues with device token management.
*   **Resolution Steps:**
    1.  **`VITE_FIREBASE_VAPID_KEY`:** Ensure `VITE_FIREBASE_VAPID_KEY` is correctly set in `.env` and matches the key in Firebase Console > Project settings > Cloud Messaging > Web configuration.
    2.  **Service Worker:** Verify that the Firebase Messaging Service Worker is correctly registered and active.
    3.  **Device Tokens:** Ensure that device tokens are being correctly generated and stored in Firestore (e.g., in the `users` collection or a dedicated `device_tokens` collection).
    4.  **Cloud Function Logs:** Check logs for `onMessageCreate` or `onNotificationCreate` functions for FCM sending errors.
    5.  **User Permissions:** Ensure users have granted notification permissions in their browser/device settings.

This troubleshooting guide provides a starting point for diagnosing and resolving issues in the SATHI application. Effective monitoring, logging, and systematic debugging are key to maintaining a stable and high-performing system.
