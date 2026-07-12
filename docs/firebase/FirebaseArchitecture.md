# Firebase Architecture Design - SATHI Project

This document details the architectural design for Cloud Functions, the messaging system, the booking system, and the overall performance strategy for the SATHI application. These designs are built upon the scalable Firestore schema and robust security rules previously defined, aiming to support 10,000+ concurrent users with a clear path to 100,000+ users.

## 1. Cloud Functions Architecture

Cloud Functions for Firebase will be utilized to execute backend code in response to events triggered by Firebase features (Firestore, Authentication, Storage, Pub/Sub) and HTTPS requests. This approach ensures that sensitive business logic is kept server-side, maintaining data integrity, enabling complex operations, and preventing client-side manipulation.

### Core Principles for Cloud Functions

*   **Server-Side Logic:** All sensitive operations (e.g., payment processing, commission calculation, role assignment) are exclusively handled by Cloud Functions.
*   **Event-Driven:** Functions respond to specific events, ensuring reactive and efficient processing.
*   **Idempotency:** Functions are designed to be idempotent where possible, meaning they can be safely retried without causing unintended side effects.
*   **Error Handling and Logging:** Robust error handling and comprehensive logging (via Cloud Logging) are implemented for monitoring and debugging.
*   **Cost Optimization:** Functions are optimized for cold starts, memory usage, and execution time to minimize operational costs.

### Key Cloud Functions

1.  **Authentication & User Management:**
    *   `onUserCreate(user)`: Triggered on new Firebase Auth user creation.
        *   Creates a corresponding `users` document in Firestore.
        *   Sets initial custom claims (e.g., `role: 'customer'`).
    *   `onUserDelete(user)`: Triggered on Firebase Auth user deletion.
        *   Deletes associated `users` document and potentially other related data (e.g., `favorites`, `notifications`).
    *   `setUserRole(uid, role)` (Callable Function):
        *   Allows administrators to assign/update user roles (`customer`, `companion`, `admin`) by setting custom claims.
        *   Ensures only authenticated admins can call this function.
    *   `onCompanionCreated(companionDoc)`: Triggered on `companions` document creation.
        *   Updates the corresponding `users` document to set `role: 'companion'` custom claim.

2.  **Booking Management:**
    *   `onBookingCreate(bookingDoc)`: Triggered on `bookings` document creation.
        *   Verifies booking details (availability, pricing) against `activities` and `companions` data.
        *   Calculates `commissionAmount`.
        *   Sends initial notifications to user and companion.
        *   Schedules reminder notifications (e.g., 24 hours before booking).
    *   `onBookingUpdate(bookingDoc)`: Triggered on `bookings` document update.
        *   Handles status changes (e.g., `pending` -> `confirmed`, `confirmed` -> `cancelled`).
        *   Triggers payment refund process if cancelled.
        *   Updates `companions` `completedBookings` count on `completed` status.
        *   Sends relevant notifications to user and companion.
    *   `processPaymentWebhook(paymentGatewayData)` (HTTPS Endpoint):
        *   Receives webhooks from payment gateways (Stripe, Khalti, Esewa).
        *   Verifies payment status and updates the `payments` and `bookings` documents transactionally.
        *   Triggers booking confirmation or cancellation based on payment outcome.

3.  **Messaging & Notifications:**
    *   `onMessageCreate(messageDoc)`: Triggered on `messages` subcollection document creation.
        *   Updates the `lastMessage` field in the parent `conversations` document.
        *   Increments unread counts for recipients.
        *   Sends push notifications to the recipient(s) via FCM.
    *   `onNotificationCreate(notificationDoc)`: Triggered on `notifications` document creation.
        *   Sends push notifications to the target `userId`.

4.  **Reviews & Ratings:**
    *   `onReviewCreate(reviewDoc)`: Triggered on `reviews` document creation.
        *   Calculates and updates the `rating` and `reviewsCount` fields in the corresponding `companions` and `activities` documents.
        *   Ensures atomicity using transactions.

5.  **Data Aggregation & Maintenance:**
    *   `aggregateAnalytics()` (Scheduled Function - Pub/Sub):
        *   Periodically aggregates raw analytics events from the `analytics` collection (or BigQuery) into summary documents.
    *   `cleanupOldData()` (Scheduled Function - Pub/Sub):
        *   Deletes old messages, notifications, or analytics records based on retention policies to manage database size and costs.

### Cloud Functions Deployment and Scaling

*   **Runtime:** Node.js (latest LTS) for optimal performance with Firebase SDKs.
*   **Memory Allocation:** Optimized based on function complexity and expected load (e.g., 128MB for simple triggers, 512MB+ for heavy processing).
*   **Concurrency:** Configured for optimal concurrency to handle spikes in traffic while managing costs.
*   **Region:** Deployed in the same region as Firestore to minimize latency.

## 2. Messaging Architecture

The messaging system is designed for real-time, scalable communication between users and companions, supporting rich media and advanced chat features.

### Core Components

*   **`conversations` Collection:** Top-level collection storing metadata about each conversation (participants, last message snippet, last update time).
    *   Document ID: `[user1Id]_[user2Id]` (sorted UIDs for consistent ID generation).
*   **`messages` Subcollection:** Nested under `conversations/{conversationId}/messages`, storing individual messages.
    *   Document ID: Auto-generated by Firestore.
*   **Real-time Listeners:** Client-side applications use `onSnapshot` listeners for `messages` subcollections to receive new messages in real-time.
*   **Cloud Functions:** Used for `lastMessage` denormalization, unread count management, and push notifications.

### Supported Features and Implementation

*   **Realtime:** Achieved using Firestore `onSnapshot` listeners on the `messages` subcollection.
*   **Typing Indicators:** Implemented by writing ephemeral 
data to a `typing_indicators` subcollection or a dedicated field in the `conversations` document, with a short TTL (Time-To-Live) or a Cloud Function to clean it up.
*   **Read Receipts:** Implemented by updating a `readBy` map within the `messages` document or a separate `read_receipts` subcollection. A Cloud Function can aggregate these to update the `conversations` document.
*   **Images, Videos, Voice, Files:** Stored in Firebase Storage, with URLs saved in the `messages` document. Security rules ensure only conversation participants can access these files.
*   **Replies:** `replyToMessageId` field in the `messages` document links a message to its parent message.
*   **Search:** For full-text search across messages, integrate with a dedicated search service like Algolia or Elasticsearch, populated by a Cloud Function triggered on message creation.
*   **Pagination & Infinite Scroll:** Client-side queries use `orderBy("timestamp", "desc").limit(N)` and `startAfter()` for efficient loading of message history.
*   **Unread Counts:** Maintained by a Cloud Function that increments a counter in the `conversations` document or a `user_unread_counts` collection when new messages arrive and decrements it when a user reads a conversation.
*   **Push Notifications:** Handled by a Cloud Function triggered on `message` creation, sending FCM notifications to offline recipients.
*   **Offline Synchronization:** Firestore's built-in offline capabilities handle caching and synchronization. Conflict resolution is managed by Firestore's last-write-wins policy, or custom logic for specific fields.

## 3. Booking Architecture

The booking system is designed to be transaction-safe, reliable, and scalable, leveraging Cloud Functions for critical business logic.

### Core Components

*   **`bookings` Collection:** Stores all booking details.
*   **`activities` Collection:** Provides activity details and availability.
*   **`companions` Collection:** Provides companion details and availability.
*   **Cloud Functions:** Central to all critical booking operations.

### Supported Features and Implementation

*   **Booking Creation:**
    1.  Client initiates booking request.
    2.  Cloud Function (`onBookingCreate`) verifies companion availability, activity details, and calculates the total price and commission.
    3.  A `payments` document is created with `status: 'pending'`.
    4.  The `bookings` document is created with `status: 'pending'`.
    5.  User is redirected to payment gateway.
*   **Approval/Confirmation:**
    1.  Payment gateway sends webhook to Cloud Function (`processPaymentWebhook`).
    2.  Function verifies payment, updates `payments` status to `succeeded`.
    3.  Function updates `bookings` status to `confirmed` transactionally.
    4.  Notifications are sent to user and companion.
*   **Cancellation:**
    1.  User/Companion requests cancellation (client-side).
    2.  Cloud Function (`onBookingUpdate`) verifies cancellation policy.
    3.  If eligible, triggers refund via payment gateway API.
    4.  Updates `bookings` status to `cancelled` and `payments` status to `refunded`.
    5.  Notifications are sent.
*   **Refund:** Handled by Cloud Functions as part of cancellation or dispute resolution.
*   **Payment Verification:** Exclusively handled by Cloud Functions, triggered by payment gateway webhooks.
*   **Review Generation:** After booking completion, a Cloud Function can trigger a notification to the user to leave a review.
*   **Commission Calculation:** Performed server-side by Cloud Functions during booking creation and payment processing.
*   **Status History:** The `timeline` array in the `bookings` document tracks status changes. For very high volume, a `booking_history` subcollection could be used.
*   **Booking Timeline:** Derived from the `timeline` field, displayed client-side.
*   **Notifications:** Integrated with the general notification system, triggered by Cloud Functions.
*   **Audit Logs:** Critical booking actions (creation, status changes, payments) are logged to Cloud Logging for auditing and debugging.
*   **Transaction-Safe:** All multi-document updates (e.g., updating `bookings` and `payments` status) are performed within Firestore transactions in Cloud Functions to ensure atomicity.

## 4. Performance Strategy

Achieving sub-second response times for critical operations and supporting 10,000 concurrent users requires a multi-faceted performance strategy.

### General Optimizations

*   **Firestore Indexing:** Comprehensive indexing (single-field and composite) as detailed in `FirestoreSchema.md` and `SecurityRules.md` to ensure efficient query execution.
*   **Minimal Document Reads/Writes:** Design queries to fetch only necessary data. Avoid `get()` operations within loops. Utilize `onSnapshot` with `where` clauses to listen only to relevant data.
*   **Batch Writes:** Use `WriteBatch` for multiple non-dependent writes to reduce network overhead and improve write performance.
*   **Transactions:** Employ `runTransaction` for operations requiring atomicity across multiple documents.
*   **Connection Reuse:** Firebase SDKs automatically manage connection pooling, but ensure client-side code doesn't unnecessarily re-initialize Firebase.
*   **Memory Optimization:** Efficient data structures and algorithms in client-side code and Cloud Functions to minimize memory footprint.

### Client-Side Optimizations

*   **Page Load (<2 seconds):**
    *   **Code Splitting & Lazy Loading:** Use dynamic imports for components and routes to load only what's needed for the initial view.
    *   **Image Optimization:** Serve optimized and responsive images (e.g., WebP, AVIF) via Firebase Storage and CDN.
    *   **Asset Compression:** Gzip/Brotli compression for all static assets.
    *   **CDN:** Firebase Hosting automatically uses a global CDN for static assets.
    *   **Critical CSS:** Inline critical CSS for above-the-fold content.
*   **Firestore Query (<300ms):**
    *   **Efficient Listeners:** Use `onSnapshot` with precise `where` and `limit` clauses. Clean up listeners when components unmount to prevent memory leaks and unnecessary reads.
    *   **Pagination & Cursor Queries:** Implement for all list views (e.g., messages, bookings, activity listings) to fetch data in chunks.
    *   **Optimistic UI:** Update UI immediately after a user action, then reconcile with server response. This provides an instant feedback loop.
    *   **Local Caching:** Leverage Firestore's offline persistence and client-side caching mechanisms (e.g., React Query, SWR) to reduce redundant network requests.
*   **Search (<500ms):**
    *   For complex full-text search, integrate with a dedicated search service (e.g., Algolia, Elasticsearch) that offers fast, indexed search capabilities.
    *   Firestore collection group queries can be used for simpler, exact-match searches across subcollections.
*   **Chat (Realtime):**
    *   Firestore `onSnapshot` listeners provide real-time updates.
    *   Efficient pagination for loading history.
    *   Debouncing typing indicators to reduce writes.

### Server-Side (Cloud Functions) Optimizations

*   **Cold Start Reduction:**
    *   **Minimum Instances:** Configure `minInstances` for frequently used functions to keep them warm.
    *   **Smaller Bundles:** Keep function codebases lean by only importing necessary modules.
    *   **Node.js Runtime:** Use the latest Node.js runtime for performance improvements.
*   **Efficient Database Operations:**
    *   Batch reads/writes where possible.
    *   Use transactions for atomic updates.
    *   Optimize queries within functions to avoid unnecessary reads.
*   **Asynchronous Operations:** Use `async/await` effectively to handle asynchronous operations without blocking the event loop.
*   **Caching:** Implement in-memory caching within functions for frequently accessed static data.

### Load Testing

*   Regular load testing (simulating 100, 500, 1,000, 5,000, and 10,000 concurrent users) will be crucial to identify bottlenecks and validate the architecture's scalability. Tools like Firebase Performance Monitoring and Cloud Monitoring will be used to analyze performance metrics during these tests.

This comprehensive architectural design for Cloud Functions, messaging, booking, and performance lays the groundwork for a robust, scalable, and high-performing SATHI application.
