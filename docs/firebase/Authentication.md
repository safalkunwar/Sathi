 list in the Firebase Console.
    *   **Web Client ID:** The Web client ID for Google Sign-In should be correctly configured.
    *   **OAuth Consent Screen:** The OAuth consent screen must be configured with appropriate application name, support email, and authorized domains.
    *   **Correct Redirect URLs:** Ensure all OAuth redirect URLs are correctly specified and authorized.
*   **Firebase Configuration Loading:**
    *   Verify that the `firebaseConfig` object in `src/firebase.ts` is correctly populated at runtime with all necessary environment variables.
    *   The `console.log("[SATHI] Firebase config loaded:", ...)` in `src/firebase.ts` should show `hasValidConfig: true` and all keys present.
*   **Firebase Initialization:**
    *   Ensure `initializeApp` is called only once, as handled by `if (hasValidConfig && !getApps().length)` in `src/firebase.ts`.
    *   Verify that `getAuth(app)` is called successfully to initialize the Auth service.
*   **Environment Variables:** All `VITE_FIREBASE_` variables in `.env` are correctly loaded and accessible via `import.meta.env`.
*   **Firebase SDK Version:** The `firebase` SDK version (`^12.16.0` in `package.json`) is up-to-date and compatible.
*   **Initialization Order:** Firebase services (Auth, Firestore, Storage) are initialized in the correct order.
*   **Hydration Issues/Server-Side Rendering (SSR) Conflicts:** If SSR is implemented, ensure Firebase client SDK initialization is handled correctly to avoid hydration mismatches or `auth/configuration-not-found` errors during server-side rendering or client-side hydration.
*   **Authentication Race Conditions:** The `onAuthStateChanged` listener in `AppContext.tsx` is designed to handle state changes gracefully, preventing race conditions.
*   **Guest Browsing:** Ensure public routes are accessible without authentication.
*   **Protected Routes:** Verify that `AuthGuard` correctly restricts access to authenticated-only routes.
*   **Session Persistence:** Firebase Auth automatically handles session persistence. Verify that user sessions persist across browser restarts.
*   **Automatic Token Refresh:** Firebase Auth SDK automatically refreshes ID tokens. Monitor network requests to confirm this behavior.
*   **Proper Logout:** Verify that `authService.logout()` correctly signs out the user and clears the session.
*   **No Authentication Loops:** Ensure that authentication redirects and state changes do not lead to infinite loops.
*   **Graceful Error Handling:** All authentication errors (e.g., wrong password, user not found) are caught and displayed to the user in a friendly manner (e.g., via `useToast` in `AuthModal.tsx`).

## 3. Custom Claims for Role-Based Access Control (RBAC)

SATHI utilizes Firebase Custom Claims to implement RBAC. This allows for efficient and secure authorization at the Firestore Security Rules level.

*   **`role` Claim:** A `role` custom claim (`customer`, `companion`, `admin`) is set on the user's ID token. This claim is updated via Cloud Functions (`onUserCreate`, `onCompanionCreated`, `setUserRole`).
*   **Security Rules Integration:** Firestore Security Rules use `request.auth.token.role` to grant or deny access based on the user's role, as detailed in `SecurityRules.md`.

## 4. Security Best Practices

*   **API Key Restrictions:** Restrict the Firebase API key to only allow access from authorized domains and for necessary services (e.g., Authentication, Firestore, Storage).
*   **Strong Passwords:** Encourage users to use strong, unique passwords.
*   **Multi-Factor Authentication (MFA):** Consider enabling MFA for enhanced security, especially for admin accounts.
*   **Identity Verification:** For companions, implement a robust identity verification process (e.g., document upload, manual review) to ensure trustworthiness.
*   **Regular Security Audits:** Periodically review Firebase Authentication settings, security rules, and Cloud Function logs for any anomalies or vulnerabilities.

By meticulously verifying and implementing these authentication strategies, SATHI can provide a secure, reliable, and user-friendly authentication experience for its growing user base.
