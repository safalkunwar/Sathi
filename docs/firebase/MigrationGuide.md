# Migration Guide - SATHI Project

This document outlines potential migration considerations and steps for the SATHI Firebase project. While the current design aims for long-term scalability without major architectural changes, future growth or evolving requirements might necessitate specific migration efforts. This guide focuses on common migration scenarios relevant to Firebase applications.

## 1. Firebase Project Migration

If there's a need to migrate the entire Firebase project (e.g., to a new Google Cloud Project, or consolidating multiple projects), the following steps are generally involved:

*   **Export Data:**
    *   **Firestore:** Use the `gcloud firestore export` command to export all Firestore data to a Cloud Storage bucket. This creates a set of `.overall_export_metadata` files and data files.
    *   **Storage:** Use `gsutil rsync` to copy all files from the old project's Cloud Storage bucket to the new one.
    *   **Authentication:** Export user data (UID, email, password hashes, custom claims) using `firebase auth:export users.json --format=json`.
*   **Create New Project:** Set up a new Firebase project in the desired Google Cloud Project.
*   **Import Data:**
    *   **Authentication:** Import users into the new project using `firebase auth:import users.json --hash-algo=SCRYPT --rounds=8 --mem-cost=14 --parallel=10` (adjust hash algorithm and parameters as per your original configuration).
    *   **Firestore:** Import data using `gcloud firestore import gs://<bucket-name>/<path-to-export-folder> --collection-ids="<collection1>","<collection2>"`.
    *   **Storage:** No direct import needed if `gsutil rsync` was used.
*   **Reconfigure Services:**
    *   **Cloud Functions:** Redeploy all Cloud Functions to the new project.
    *   **Hosting:** Update `firebase.json` with the new project ID and redeploy hosting.
    *   **Firebase Extensions:** Reinstall and reconfigure any Firebase Extensions.
    *   **APIs & Services:** Enable necessary APIs (e.g., Cloud Firestore API, Cloud Functions API) in the new Google Cloud Project.
*   **Update Client Applications:** Update `firebaseConfig` in client-side applications (e.g., `.env` file) with the new project's API Key, Project ID, App ID, etc.

## 2. Database Schema Migrations (Firestore)

While the current schema is designed for scalability, future feature additions might require schema changes. Firestore is schemaless, but application code relies on a consistent schema. For schema migrations:

*   **Backward Compatibility:** Design changes to be backward compatible initially. New fields can be added without breaking old clients.
*   **Data Transformation (Cloud Functions):** For significant schema changes (e.g., renaming fields, restructuring subcollections), use Cloud Functions to perform data transformations in batches.
    *   **One-time Scripts:** Write a Cloud Function or a standalone script to iterate through affected documents and update them to the new schema.
    *   **Trigger-based Migration:** For ongoing writes, use Firestore `onWrite` triggers to transform data to the new schema as it's written, ensuring new data conforms immediately.
*   **Client-Side Updates:** Update client applications to read and write using the new schema. Deploy clients that support both old and new schemas during a transition period.
*   **Rollback Plan:** Always have a rollback plan, including backups, before performing large-scale data migrations.

## 3. Authentication System Migrations

*   **Provider Changes:** If new authentication providers are introduced (e.g., Apple Sign-In), enable them in the Firebase Console and update client-side authentication flows.
*   **Custom Auth System to Firebase Auth:** If migrating from a custom authentication system, export user credentials (hashed passwords) and import them into Firebase Auth using the `firebase auth:import` command, ensuring the correct hashing algorithm and parameters are specified.
*   **Custom Claims Evolution:** If the RBAC model evolves, update the Cloud Functions responsible for setting custom claims and ensure security rules reflect these changes.

## 4. Cloud Functions Runtime Migrations

As new Node.js runtimes become available for Cloud Functions, plan for upgrades:

*   **Test Thoroughly:** Test all functions against the new runtime locally before deployment.
*   **Dependency Updates:** Update `package.json` dependencies to ensure compatibility with the new runtime.
*   **Phased Rollout:** Deploy functions to the new runtime in a phased manner, monitoring for errors.

## 5. Storage Structure Migrations

If the file storage structure in Firebase Storage needs to change (e.g., new folder paths for images):

*   **Cloud Functions for Renaming/Moving:** Use Cloud Functions triggered by `onFinalize` (for new uploads) or scheduled functions (for existing files) to move or rename files programmatically.
*   **Client-Side Updates:** Update client-side code to use the new file paths for uploads and retrievals.
*   **Redirects:** For existing public URLs, consider setting up redirects in Firebase Hosting or Cloud CDN to point old paths to new ones.

## 6. General Migration Best Practices

*   **Comprehensive Backups:** Always perform full backups of Firestore and Cloud Storage before any major migration.
*   **Staging Environment:** Test all migrations thoroughly in a staging environment that mirrors production.
*   **Monitoring:** Closely monitor logs (Cloud Logging), performance (Firebase Performance Monitoring), and error reporting during and after migrations.
*   **Communication:** Communicate planned downtime or potential issues to users if necessary.
*   **Small, Incremental Changes:** Break down large migrations into smaller, manageable steps to reduce risk.

This guide provides a framework for handling future migrations, ensuring that the SATHI application can adapt and evolve without significant disruption. 
