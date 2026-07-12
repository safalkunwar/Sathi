# Bugs and Potential Issues - SATHI Firebase Optimization Project

This document serves as a record of identified bugs, potential issues, and areas requiring further investigation or resolution within the SATHI Firebase project.

## 1. Identified Bugs

*   **`Firebase: Error (auth/configuration-not-found)`:**
    *   **Status:** Diagnosed, root cause identified as likely related to missing Firebase CLI configuration files (`.firebaserc`, `firebase.json`) and/or environment variable loading. Initial remediation steps (creating `.firebaserc` and `firebase.json`) have been taken.
    *   **Impact:** Prevents successful Firebase Authentication initialization, blocking user login and access to authenticated features.
    *   **Resolution:** Requires verification of Firebase Console configuration, runtime environment variable inspection, and successful `npm install` and `firebase use --add` to fully resolve and verify the Firebase connection.

## 2. Potential Issues / Areas for Further Investigation

*   **`npm install` Timeout:** The `npm install` command timed out during the initial audit. While the architectural design was prioritized, this needs to be successfully completed and verified before proceeding with any code-level changes or deployments. This could indicate network issues, resource constraints, or large dependency tree.
*   **Vite Configuration for Environment Variables:** Although the user confirmed `firebaseConfig` is correctly populated at runtime, the `vite.config.ts` file was not provided. It's crucial to ensure Vite is correctly configured to load `VITE_FIREBASE_` environment variables, especially in different environments (development, production).
*   **Hydration Issues/SSR Conflicts:** If the SATHI application uses Server-Side Rendering (SSR) with Next.js (as implied by the project instructions), there's a potential for hydration mismatches or `auth/configuration-not-found` errors during SSR or client-side hydration. This needs to be specifically tested and verified.
*   **Firebase CLI Project Linking:** The user confirmed that the Firebase project configuration matches and all setups are connected successfully, but the output of `firebase use --add` was not provided. It's important to confirm that the project is correctly linked via the CLI for deployment and local emulation.
*   **Outdated SDK:** The `package.json` shows `firebase` SDK version `^12.16.0`. While not necessarily a bug, it's good practice to keep SDKs updated to benefit from the latest features, performance improvements, and security patches. A plan for SDK upgrades should be considered.
*   **Multiple Firebase Instances:** The initial audit did not conclusively rule out multiple Firebase initializations. While `src/firebase.ts` handles single initialization, other parts of the codebase or third-party libraries could potentially initialize Firebase again, leading to unexpected behavior.
*   **Authentication Race Conditions:** While `AuthContext.tsx` is designed to handle state changes, complex UI interactions or rapid navigation could still expose subtle race conditions in authentication state management. Thorough testing is required.
*   **Graceful Error Handling for All Auth Errors:** The `AuthModal.tsx` uses `useToast` for errors, but a comprehensive review is needed to ensure *every* authentication error is handled gracefully and provides user-friendly feedback.
*   **Cloud Functions Cold Starts:** While strategies are in place (`minInstances`), actual cold start performance needs to be monitored and optimized in a production environment.
*   **Firestore Hot Documents:** The schema design aims to prevent hot documents, but real-world usage patterns might reveal unexpected hotspots. Continuous monitoring is essential.
*   **Data Retention for Cost Optimization:** Implementing and verifying data retention policies (e.g., for old messages, notifications, analytics) is a critical task for cost optimization that needs to be actively managed.

## 3. Action Items

*   Successfully complete `npm install`.
*   Verify Firebase connection post `npm install` and CLI linking.
*   Obtain and review `vite.config.ts`.
*   Thoroughly test authentication flows, especially with SSR if applicable.
*   Monitor Firebase Performance and Cloud Logging for anomalies.
*   Plan for regular Firebase SDK updates.

This document will be updated as new bugs are discovered or existing issues are resolved.
