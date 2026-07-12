# Cloud Functions Implementation - SATHI Project

This document provides a detailed overview of the Cloud Functions implementation for the SATHI application, building upon the architectural design outlined in `FirebaseArchitecture.md`. Cloud Functions are central to executing sensitive business logic, responding to events, and ensuring the scalability and integrity of the backend.

## 1. Core Principles and Best Practices

*   **Modularity:** Functions are organized into logical groups (e.g., `auth`, `bookings`, `messaging`) to improve readability and maintainability.
*   **Idempotency:** Where applicable, functions are designed to be idempotent to prevent unintended side effects from retries.
*   **Error Handling and Logging:** Each function includes robust error handling and utilizes `firebase-functions/logger` for structured logging to Cloud Logging, facilitating debugging and monitoring.
*   **Security:** Functions enforce security by verifying `context.auth` and custom claims, ensuring that only authorized users or services can trigger sensitive operations.
*   **Performance Optimization:**
    *   **Cold Starts:** Minimize cold starts by keeping function bundles small and configuring `minInstances` for critical functions.
    *   **Memory Allocation:** Allocate appropriate memory based on the function's workload.
    *   **Region:** Deploy functions in the same region as Firestore to reduce latency.
*   **Environment Variables:** Sensitive configuration (e.g., API keys for payment gateways) is stored securely using Cloud Functions environment configuration, not hardcoded.

## 2. Key Cloud Functions Details

### 2.1. Authentication & User Management

*   **`onUserCreate` (Auth Trigger: `functions.auth.user().onCreate`)**
    *   **Purpose:** Automatically create a corresponding user profile in Firestore when a new user signs up via Firebase Authentication.
    *   **Logic:**
        1.  Retrieves `user.uid`, `user.email`, `user.displayName`, `user.photoURL` from the `UserRecord`.
        2.  Creates a new document in the `users` collection with `user.uid` as the document ID.
        3.  Initializes fields like `role: 'customer'`, `createdAt`, `updatedAt`.
        4.  Sets a custom claim `role: 'customer'` on the Firebase Auth user token using `admin.auth().setCustomUserClaims(uid, { role: 'customer' })`.
    *   **Scaling:** Designed for high throughput, as user sign-ups can be frequent.

*   **`onUserDelete` (Auth Trigger: `functions.auth.user().onDelete`)**
    *   **Purpose:** Clean up user-related data in Firestore when a user account is deleted from Firebase Authentication.
    *   **Logic:**
        1.  Deletes the corresponding document in the `users` collection.
        2.  Optionally, triggers deletion of related data in other collections (e.g., `favorites`, `notifications`, `messages`, `bookings`) or marks them for archival/anonymization. This should be carefully designed to avoid cascading deletes that exceed execution limits.
    *   **Scaling:** Less frequent than creation, but important for data hygiene.

*   **`setUserRole` (HTTPS Callable Function)**
    *   **Purpose:** Allows an authenticated administrator to assign or update roles for any user.
    *   **Logic:**
        1.  Verifies `context.auth` and `context.auth.token.admin == true` to ensure the caller is an admin.
        2.  Receives `uid` and `role` (`customer`, `companion`, `admin`) as arguments.
        3.  Uses `admin.auth().setCustomUserClaims(uid, { role: role })` to update the user's custom claims.
        4.  Updates the `role` field in the corresponding `users` Firestore document.
    *   **Security:** Critical function, strict access control is paramount.

*   **`onCompanionCreated` (Firestore Trigger: `functions.firestore.document('companions/{companionId}').onCreate`)**
    *   **Purpose:** Automatically updates a user's custom claims when they become a companion.
    *   **Logic:**
        1.  Retrieves `userId` from the newly created `companions` document.
        2.  Sets a custom claim `role: 'companion'` on the corresponding Firebase Auth user token.

### 2.2. Booking Management

*   **`onBookingCreate` (Firestore Trigger: `functions.firestore.document('bookings/{bookingId}').onCreate`)**
    *   **Purpose:** Performs initial validations, calculations, and sets up post-booking processes.
    *   **Logic:**
        1.  Reads `activities` and `companions` data to verify availability and pricing.
        2.  Calculates `commissionAmount` based on predefined rules.
        3.  Updates the `bookings` document with calculated commission and initial `paymentStatus: 'pending'`.
        4.  Creates `notifications` for both the user and the companion.
        5.  Schedules a Cloud Task or Pub/Sub message for a reminder notification (e.g., 24 hours before the booking).
    *   **Transactionality:** Critical operations (e.g., updating availability) should use Firestore transactions.

*   **`onBookingUpdate` (Firestore Trigger: `functions.firestore.document('bookings/{bookingId}').onUpdate`)**
    *   **Purpose:** Reacts to changes in booking status, triggering payment refunds, notifications, or other updates.
    *   **Logic:**
        1.  Detects changes in `status` field.
        2.  If `status` changes to `cancelled`:
            *   Initiates a refund process via the payment gateway API (using environment variables for API keys).
            *   Updates `payments` document status to `refunded`.
            *   Sends cancellation notifications.
        3.  If `status` changes to `completed`:
            *   Increments `completedBookings` count in the `companions` document.
            *   Triggers a notification to the user to leave a review.
        4.  Updates the `timeline` array in the `bookings` document.
    *   **Security:** Ensures only authorized status transitions are allowed.

*   **`processPaymentWebhook` (HTTPS Endpoint)**
    *   **Purpose:** Securely handles incoming webhooks from payment gateways to update payment and booking statuses.
    *   **Logic:**
        1.  Verifies the webhook signature to ensure authenticity.
        2.  Parses the payment gateway payload.
        3.  Uses a Firestore transaction to:
            *   Update the `payments` document (`status: 'succeeded'` or `'failed'`).
            *   Update the corresponding `bookings` document (`status: 'confirmed'` or `'failed'`).
        4.  Sends appropriate notifications.
    *   **Security:** Must validate webhook source and use transactions.

### 2.3. Messaging & Notifications

*   **`onMessageCreate` (Firestore Trigger: `functions.firestore.document('conversations/{conversationId}/messages/{messageId}').onCreate`)**
    *   **Purpose:** Updates conversation metadata and sends push notifications.
    *   **Logic:**
        1.  Updates the parent `conversations/{conversationId}` document with the `lastMessage` snippet and `updatedAt` timestamp.
        2.  Increments an unread count for the recipient(s) in a dedicated `user_unread_counts` collection or within the `conversations` document.
        3.  Sends an FCM push notification to the recipient(s) using their device tokens (stored in `users` or a separate `device_tokens` collection).
    *   **Performance:** Optimized for high write volume.

*   **`onNotificationCreate` (Firestore Trigger: `functions.firestore.document('notifications/{notificationId}').onCreate`)**
    *   **Purpose:** Delivers push notifications to users.
    *   **Logic:**
        1.  Retrieves the target `userId` from the `notifications` document.
        2.  Fetches the user's device tokens.
        3.  Sends an FCM push notification with the notification content.
    *   **Reliability:** Includes retry mechanisms for FCM delivery failures.

### 2.4. Reviews & Ratings

*   **`onReviewCreate` (Firestore Trigger: `functions.firestore.document('reviews/{reviewId}').onCreate`)**
    *   **Purpose:** Aggregates ratings and updates companion/activity profiles.
    *   **Logic:**
        1.  Retrieves the `rating`, `companionId`, and `activityId` from the new review.
        2.  Uses a Firestore transaction to:
            *   Read the current `rating` and `reviewsCount` from the `companions` document.
            *   Calculate the new average rating and increment `reviewsCount`.
            *   Update the `companions` document.
            *   Perform similar aggregation for the `activities` document if `activityId` is present.
    *   **Atomicity:** Transactions are crucial here to ensure consistent rating calculations.

### 2.5. Data Aggregation & Maintenance

*   **`aggregateAnalytics` (Scheduled Function: `functions.pubsub.schedule('every 24 hours').onRun`)**
    *   **Purpose:** Processes raw analytics events and stores aggregated data.
    *   **Logic:**
        1.  Queries the `analytics` collection for events within the last 24 hours.
        2.  Performs aggregations (e.g., daily active users, total bookings, popular activities).
        3.  Writes aggregated results to a separate `aggregated_analytics` collection or updates existing summary documents.
    *   **Cost:** Designed to run infrequently to minimize costs.

*   **`cleanupOldData` (Scheduled Function: `functions.pubsub.schedule('every 7 days').onRun`)**
    *   **Purpose:** Deletes old, irrelevant data to manage database size and costs.
    *   **Logic:**
        1.  Queries collections like `messages`, `notifications`, `reports` for documents older than a defined retention period (e.g., 90 days).
        2.  Deletes these documents in batches to avoid exceeding function execution limits.
    *   **Caution:** Implement with extreme care to avoid accidental data loss.

## 3. Deployment and Monitoring

*   **Deployment:** Cloud Functions are deployed using the Firebase CLI (`firebase deploy --only functions`).
*   **Monitoring:** Integrated with Firebase Performance Monitoring and Cloud Monitoring for real-time insights into function execution, errors, and performance. Custom metrics and alerts are configured for critical functions.
*   **Testing:** Thorough unit and integration tests are developed for all Cloud Functions to ensure correctness and reliability.

This detailed implementation plan for Cloud Functions ensures that the SATHI backend is robust, secure, and capable of handling the demands of a growing user base. 
