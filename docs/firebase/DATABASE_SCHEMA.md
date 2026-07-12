# Database Schema - SATHI Project

This document details the Firestore database schema for the SATHI application. It is a direct copy of the `FirestoreSchema.md` generated earlier, serving as a dedicated file for the database schema within the AI's memory and project documentation.

# Firestore Schema Design for SATHI

This document outlines a scalable Firestore schema designed to support 10,000+ concurrent users and a clear upgrade path to 100,000+ registered users, handling millions of messages, bookings, and notifications without requiring a major architectural redesign. Each collection design considers its purpose, relationships, indexing strategies, security rules, read/write frequencies, and scaling considerations.

## Core Principles for Scalability

1.  **Denormalization for Reads:** Optimize for read performance by denormalizing data where appropriate, especially for frequently accessed information. This reduces the number of document reads required for common queries.
2.  **Collection Group Queries:** Utilize collection group queries for subcollections where global searches or aggregations are needed.
3.  **Pagination and Cursor-based Queries:** Implement pagination and cursor-based queries for large datasets to manage memory usage and reduce read costs.
4.  **Minimal Document Size:** Keep individual document sizes small, avoiding large arrays that grow indefinitely. Split frequently updated data into separate documents or subcollections.
5.  **No Hot Documents:** Design data models to distribute writes across multiple documents to prevent hotspots and ensure even distribution of load.
6.  **Transactions:** Use Firestore transactions for operations that require atomicity and consistency across multiple documents.
7.  **Security Rules:** Implement robust security rules to enforce data access control at the database level, preventing unauthorized reads and writes.

## Collection Designs

### 1. `users` Collection

*   **Purpose:** Stores user profiles, authentication-related metadata, and general user preferences.
*   **Relationships:**
    *   One-to-many with `bookings` (a user can have many bookings).
    *   One-to-many with `reviews` (a user can write many reviews).
    *   One-to-many with `messages` (a user can send/receive many messages).
    *   One-to-many with `notifications` (a user can receive many notifications).
    *   Many-to-many with `companions` (via `favorites` subcollection or array).
*   **Fields:**
    *   `id` (string, Document ID): User's Firebase Auth UID.
    *   `name` (string): Display name.
    *   `email` (string): User's email address.
    *   `avatar` (string, optional): URL to user's profile picture.
    *   `role` (string): `customer`, `companion`, `admin`, `partner`.
    *   `favorites` (array of strings, optional): List of `companion` IDs the user has favorited. (Consider moving to a subcollection for large lists).
    *   `createdAt` (timestamp): Timestamp of user creation.
    *   `updatedAt` (timestamp): Last update timestamp.
    *   `lastLogin` (timestamp): Last login timestamp.
    *   `preferences` (map, optional): User-specific settings (e.g., `theme`, `language`).
    *   `isVerified` (boolean, optional): Indicates if the user's identity is verified.
*   **Indexes:**
    *   Single-field indexes on `email`, `role`, `createdAt`.
    *   Composite index for queries involving `role` and `createdAt` (e.g., `where('role', '==', 'companion').orderBy('createdAt', 'desc')`).
*   **Security Rules:**
    *   `allow read: if request.auth != null && request.auth.uid == userId;` (users can read their own profile).
    *   `allow write: if request.auth != null && request.auth.uid == userId;` (users can update their own profile).
    *   `allow read: if request.auth != null && request.auth.token.admin == true;` (admins can read all profiles).
*   **Read Frequency:** High (profile viewing, authentication checks).
*   **Write Frequency:** Medium (profile updates, last login, preferences).
*   **Scaling Considerations:**
    *   For `favorites`, if a user can have thousands of favorites, consider a `users/{userId}/favorites/{companionId}` subcollection to avoid large document sizes and enable efficient querying of individual favorites.
    *   Avoid storing large, frequently updated arrays directly in the user document. Instead, use subcollections or separate top-level collections for such data (e.g., `user_activity_logs`).

### 2. `companions` Collection

*   **Purpose:** Stores detailed profiles of companions (guides, service providers).
*   **Relationships:**
    *   One-to-one with `users` (each companion is also a user).
    *   One-to-many with `bookings` (a companion can have many bookings).
    *   One-to-many with `reviews` (a companion can receive many reviews).
    *   One-to-many with `activities` (a companion can offer many activities).
*   **Fields:**
    *   `id` (string, Document ID): Companion's Firebase Auth UID (same as `users.id`).
    *   `userId` (string): Reference to the corresponding `users` document.
    *   `name` (string): Display name.
    *   `bio` (string): Short biography.
    *   `location` (string): Primary operating city/location.
    *   `hourlyRate` (number): Hourly rate in local currency.
    *   `rating` (number): Average rating from reviews.
    *   `reviewsCount` (number): Total number of reviews.
    *   `isVerified` (boolean): Identity verification status.
    *   `verificationStatus` (string): `pending`, `approved`, `rejected`.
    *   `gender` (string, optional).
    *   `languages` (array of strings): Languages spoken.
    *   `interests` (array of strings): Personal interests/specialties.
    *   `images` (array of strings): URLs to profile images/portfolio.
    *   `availableDays` (array of strings): Days of the week available.
    *   `responseRate` (number): Percentage of messages responded to.
    *   `responseTime` (string): Average response time (e.g., `within an hour`).
    *   `completedBookings` (number): Count of completed bookings.
    *   `trustScore` (number): Internal trust score.
    *   `createdAt` (timestamp).
    *   `updatedAt` (timestamp).
*   **Indexes:**
    *   Single-field indexes on `location`, `hourlyRate`, `rating`, `isVerified`, `verificationStatus`, `languages` (array-contains).
    *   Composite indexes for common search/filter queries (e.g., `where('location', '==', 'Kathmandu').orderBy('rating', 'desc')`).
*   **Security Rules:**
    *   `allow read: if true;` (publicly readable).
    *   `allow write: if request.auth != null && request.auth.uid == companionId && request.resource.data.userId == request.auth.uid;` (companions can update their own profile).
    *   `allow write: if request.auth != null && request.auth.token.admin == true;` (admins can update any companion profile).
*   **Read Frequency:** Very High (browsing, search, profile viewing).
*   **Write Frequency:** Low to Medium (profile updates, rating updates via Cloud Function).
*   **Scaling Considerations:**
    *   For search and filtering, ensure appropriate composite indexes are in place. Consider using a dedicated search service (e.g., Algolia) for complex full-text search or very high query volumes.
    *   `rating` and `reviewsCount` should be updated via Cloud Functions to ensure atomicity and prevent client-side manipulation.

### 3. `activities` Collection

*   **Purpose:** Defines various activities or services offered by companions.
*   **Relationships:**
    *   Many-to-one with `companions` (an activity is offered by one companion).
    *   Many-to-many with `bookings` (a booking can be for multiple activities, or an activity can be part of many bookings).
*   **Fields:**
    *   `id` (string, Document ID).
    *   `companionId` (string): Reference to the `companions` document.
    *   `name` (string): Name of the activity (e.g., `City Tour`, `Hiking`, `Cooking Class`).
    *   `description` (string).
    *   `category` (string): (e.g., `Adventure`, `Cultural`, `Food`).
    *   `duration` (number): Duration in hours.
    *   `price` (number): Price per person or per activity.
    *   `images` (array of strings): URLs to activity images.
    *   `location` (string): Specific location for the activity.
    *   `availability` (map): Days/times activity is typically available.
    *   `createdAt` (timestamp).
    *   `updatedAt` (timestamp).
*   **Indexes:**
    *   Single-field indexes on `companionId`, `category`, `price`, `location`.
    *   Composite indexes for search (e.g., `where('category', '==', 'Adventure').orderBy('price', 'asc')`).
*   **Security Rules:**
    *   `allow read: if true;` (publicly readable).
    *   `allow write: if request.auth != null && request.auth.uid == resource.data.companionId;` (companions can manage their own activities).
    *   `allow write: if request.auth != null && request.auth.token.admin == true;` (admins can manage all activities).
*   **Read Frequency:** High (browsing, search).
*   **Write Frequency:** Low (creation, updates by companions).
*   **Scaling Considerations:**
    *   Similar to companions, consider external search for complex queries if needed.

### 4. `bookings` Collection

*   **Purpose:** Records details of each booking made by users for activities with companions.
*   **Relationships:**
    *   Many-to-one with `users` (a booking belongs to one user).
    *   Many-to-one with `companions` (a booking is for one companion).
    *   Many-to-many with `activities` (a booking can include multiple activities).
*   **Fields:**
    *   `id` (string, Document ID).
    *   `userId` (string): Reference to the `users` document (customer).
    *   `companionId` (string): Reference to the `companions` document.
    *   `activityIds` (array of strings): References to `activities` documents included in the booking.
    *   `date` (timestamp): Date of the booking.
    *   `time` (string): Time of the booking.
    *   `duration` (number): Total duration in hours.
    *   `totalPrice` (number): Total price of the booking.
    *   `status` (string): `pending`, `confirmed`, `completed`, `cancelled`, `refunded`.
    *   `paymentStatus` (string): `pending`, `paid`, `failed`, `refunded`.
    *   `paymentIntentId` (string, optional): Stripe/Khalti/Esewa Payment Intent ID.
    *   `commissionAmount` (number, optional): Amount of commission calculated.
    *   `reviewId` (string, optional): Reference to the `reviews` document if a review has been left.
    *   `createdAt` (timestamp).
    *   `updatedAt` (timestamp).
    *   `timeline` (array of maps, optional): History of status changes with timestamps and actor.
*   **Indexes:**
    *   Single-field indexes on `userId`, `companionId`, `status`, `date`.
    *   Composite indexes for common queries (e.g., `where('userId', '==', 'uid').where('status', '==', 'pending').orderBy('date', 'asc')`).
*   **Security Rules:**
    *   `allow read: if request.auth != null && (request.auth.uid == resource.data.userId || request.auth.uid == resource.data.companionId || request.auth.token.admin == true);` (users, companions, and admins can read relevant bookings).
    *   `allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;` (users can create their own bookings).
    *   `allow update: if request.auth != null && (request.auth.uid == resource.data.userId || request.auth.uid == resource.data.companionId || request.auth.token.admin == true);` (users can update limited fields, companions can update status, admins can update all).
*   **Read Frequency:** High (user/companion dashboards).
*   **Write Frequency:** High (creation, status updates, payment updates).
*   **Scaling Considerations:**
    *   Payment verification and commission calculation should be handled by Cloud Functions to ensure transaction safety and prevent client-side manipulation.
    *   `timeline` should be carefully managed to avoid excessively large documents if many status changes occur. Consider a subcollection `bookings/{bookingId}/timeline/{entryId}` if needed.

### 5. `reviews` Collection

*   **Purpose:** Stores user reviews for companions and activities.
*   **Relationships:**
    *   Many-to-one with `users` (a review is written by one user).
    *   Many-to-one with `companions` (a review is for one companion).
    *   Many-to-one with `activities` (a review can be for one activity).
    *   One-to-one with `bookings` (a review is typically linked to a completed booking).
*   **Fields:**
    *   `id` (string, Document ID).
    *   `userId` (string): Reference to the `users` document (reviewer).
    *   `companionId` (string): Reference to the `companions` document (reviewed).
    *   `activityId` (string, optional): Reference to the `activities` document.
    *   `bookingId` (string): Reference to the `bookings` document.
    *   `rating` (number): Star rating (1-5).
    *   `comment` (string): Review text.
    *   `createdAt` (timestamp).
    *   `updatedAt` (timestamp).
    *   `isApproved` (boolean): Moderation status.
*   **Indexes:**
    *   Single-field indexes on `companionId`, `activityId`, `userId`, `rating`, `createdAt`.
    *   Composite indexes for fetching reviews for a specific companion/activity, ordered by date/rating.
*   **Security Rules:**
    *   `allow read: if true;` (publicly readable).
    *   `allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;` (users can create their own reviews).
    *   `allow update: if request.auth != null && request.auth.uid == resource.data.userId;` (users can update their own reviews).
    *   `allow delete: if request.auth != null && request.auth.token.admin == true;` (admins can delete reviews).
*   **Read Frequency:** High (companion/activity pages).
*   **Write Frequency:** Low to Medium (after booking completion).
*   **Scaling Considerations:**
    *   Companion/activity average ratings and review counts should be updated via Cloud Functions to maintain consistency and prevent client-side manipulation.

### 6. `conversations` Collection

*   **Purpose:** Represents a chat conversation between two or more participants.
*   **Relationships:**
    *   Many-to-many with `users` (via `participantIds`).
    *   One-to-many with `messages` (a conversation has many messages as a subcollection).
*   **Fields:**
    *   `id` (string, Document ID): Generated by sorting and joining participant UIDs (e.g., `uid1_uid2`).
    *   `participantIds` (array of strings): UIDs of all participants in the conversation.
    *   `lastMessage` (map, optional): Snippet of the last message (text, senderId, timestamp) for quick display.
    *   `updatedAt` (timestamp): Timestamp of the last message or activity.
    *   `createdAt` (timestamp).
*   **Indexes:**
    *   Single-field index on `participantIds` (array-contains) for finding conversations a user is part of.
    *   Single-field index on `updatedAt` for ordering conversations.
*   **Security Rules:**
    *   `allow read, write: if request.auth != null && request.auth.uid in resource.data.participantIds;` (only participants can read/write).
*   **Read Frequency:** High (user's chat list).
*   **Write Frequency:** High (when new messages are sent).
*   **Scaling Considerations:**
    *   The `lastMessage` field is a denormalized summary, updated by a Cloud Function trigger on new messages in the `messages` subcollection.
    *   For group chats, `participantIds` can grow, but Firestore array limits are generous. If groups become very large (thousands), consider alternative structures.

### 7. `messages` Subcollection (under `conversations/{conversationId}/messages`)

*   **Purpose:** Stores individual chat messages within a conversation.
*   **Relationships:**
    *   Many-to-one with `conversations` (a message belongs to one conversation).
    *   Many-to-one with `users` (a message is sent by one user).
*   **Fields:**
    *   `id` (string, Document ID).
    *   `senderId` (string): UID of the sender.
    *   `text` (string, optional): Message content.
    *   `imageUrl` (string, optional): URL for image attachments.
    *   `videoUrl` (string, optional): URL for video attachments.
    *   `fileUrl` (string, optional): URL for file attachments.
    *   `timestamp` (timestamp).
    *   `isRead` (boolean): Read status for the recipient (can be an array of `readBy: {userId: timestamp}` for group chats).
    *   `type` (string): `text`, `image`, `video`, `file`.
    *   `replyToMessageId` (string, optional): Reference to the message being replied to.
*   **Indexes:**
    *   Single-field index on `timestamp` for ordering messages within a conversation.
*   **Security Rules:**
    *   `match /conversations/{conversationId}/messages/{messageId} {
        allow read: if isAuthenticated() && request.auth.uid in get(/databases/$(database)/documents/conversations/$(conversationId)).data.participantIds;
        allow create: if isAuthenticated() && request.auth.uid == request.resource.data.senderId && request.auth.uid in get(/databases/$(database)/documents/conversations/$(conversationId)).data.participantIds;
        allow update: if isAuthenticated() && request.auth.uid == resource.data.senderId && request.resource.data.keys().hasOnly(['isRead']);
    }`
    *   This allows participants to read messages, senders to create messages, and participants to mark messages as read.
*   **Read Frequency:** Very High (active chat).
*   **Write Frequency:** Very High (sending messages).
*   **Scaling Considerations:**
    *   Subcollections are ideal for messages as they allow for independent scaling and querying within a conversation.
    *   Pagination and infinite scroll are essential for loading message history.
    *   Realtime listeners with efficient cleanup are crucial for chat performance.
    *   `isRead` can become complex for group chats; consider a separate `readReceipts` subcollection or a map within the message document for multiple recipients.

### 8. `notifications` Collection

*   **Purpose:** Stores notifications for users (e.g., new messages, booking updates, system alerts).
*   **Relationships:**
    *   Many-to-one with `users` (a notification is for one user).
*   **Fields:**
    *   `id` (string, Document ID).
    *   `userId` (string): Reference to the `users` document.
    *   `title` (string).
    *   `message` (string).
    *   `type` (string): `booking_update`, `new_message`, `system_alert`, `review_request`.
    *   `isRead` (boolean).
    *   `timestamp` (timestamp).
    *   `link` (string, optional): URL to navigate to when clicked.
*   **Indexes:**
    *   Single-field indexes on `userId`, `isRead`, `timestamp`.
    *   Composite index for fetching unread notifications for a user, ordered by timestamp (e.g., `where('userId', '==', 'uid').where('isRead', '==', false).orderBy('timestamp', 'desc')`).
*   **Security Rules:**
    *   `allow read, write: if isAuthenticated() && request.auth.uid == resource.data.userId;` (users can read/manage their own notifications).
*   **Read Frequency:** High (user checking notifications).
*   **Write Frequency:** High (triggered by various events).
*   **Scaling Considerations:**
    *   Notifications are typically created by Cloud Functions to ensure reliability and trigger push notifications.
    *   Implement a retention policy to automatically delete old notifications to manage document count.

### 9. `payments` Collection

*   **Purpose:** Records all payment transactions within the system.
*   **Relationships:**
    *   Many-to-one with `users` (a payment is initiated by a user).
    *   Many-to-one with `bookings` (a payment is typically for a booking).
*   **Fields:**
    *   `id` (string, Document ID).
    *   `userId` (string): Reference to the `users` document.
    *   `bookingId` (string, optional): Reference to the `bookings` document.
    *   `amount` (number).
    *   `currency` (string).
    *   `status` (string): `pending`, `succeeded`, `failed`, `refunded`.
    *   `gateway` (string): `stripe`, `khalti`, `esewa`.
    *   `transactionId` (string): ID from the payment gateway.
    *   `paymentMethod` (string, optional).
    *   `createdAt` (timestamp).
    *   `updatedAt` (timestamp).
    *   `metadata` (map, optional): Any additional data from the payment gateway.
*   **Indexes:**
    *   Single-field indexes on `userId`, `bookingId`, `status`, `gateway`, `createdAt`.
*   **Security Rules:**
    *   `allow read: if isAuthenticated() && (request.auth.uid == resource.data.userId || isAdmin());` (users can read their own payments, admins can read all).
    *   `allow create: if isAuthenticated() && request.auth.uid == request.resource.data.userId;` (users can initiate payments).
    *   `allow update: if isAdmin();` (only admins or Cloud Functions can update payment status).
*   **Read Frequency:** Medium.
*   **Write Frequency:** High (payment initiation, status updates).
*   **Scaling Considerations:**
    *   All critical payment status updates should be handled by secure Cloud Functions, triggered by webhooks from payment gateways, to ensure data integrity and prevent fraud.
    *   Avoid storing sensitive payment information directly in Firestore; use payment gateway tokens instead.

### 10. `favorites` Subcollection (under `users/{userId}/favorites`)

*   **Purpose:** Stores a user's favorited companions.
*   **Relationships:**
    *   Many-to-one with `users` (a favorite belongs to one user).
    *   Many-to-one with `companions` (a favorite points to one companion).
*   **Fields:**
    *   `id` (string, Document ID): `companionId`.
    *   `companionId` (string): Reference to the `companions` document.
    *   `createdAt` (timestamp).
*   **Indexes:**
    *   Single-field index on `createdAt`.
*   **Security Rules:**
    *   `match /users/{userId}/favorites/{favoriteId} {
        allow read: if isAuthenticated() && request.auth.uid == userId;
        allow create, delete: if isAuthenticated() && request.auth.uid == userId;
    }`
*   **Read Frequency:** Medium.
*   **Write Frequency:** Low.
*   **Scaling Considerations:**
    *   Using a subcollection here is more scalable than an array in the `users` document if a user can have a very large number of favorites, as it avoids document size limits and allows for efficient querying of individual favorites.

### 11. `community_posts` Collection

*   **Purpose:** Stores user-generated community posts or forum topics.
*   **Relationships:**
    *   Many-to-one with `users` (a post is created by one user).
    *   One-to-many with `comments` (a post has many comments as a subcollection).
*   **Fields:**
    *   `id` (string, Document ID).
    *   `userId` (string): Reference to the `users` document.
    *   `title` (string).
    *   `content` (string).
    *   `category` (string).
    *   `tags` (array of strings, optional).
    *   `imageUrl` (string, optional).
    *   `upvotes` (number).
    *   `downvotes` (number).
    *   `commentCount` (number).
    *   `createdAt` (timestamp).
    *   `updatedAt` (timestamp).
    *   `status` (string): `published`, `draft`, `moderated`.
*   **Indexes:**
    *   Single-field indexes on `userId`, `category`, `createdAt`, `status`.
    *   Composite indexes for filtering and sorting (e.g., `where('category', '==', 'Discussion').orderBy('createdAt', 'desc')`).
*   **Security Rules:**
    *   `allow read: if resource.data.status == 'published' || isAdmin() || (isAuthenticated() && request.auth.uid == resource.data.userId);`
    *   `allow create: if isAuthenticated() && request.auth.uid == request.resource.data.userId;`
    *   `allow update: if isAuthenticated() && request.auth.uid == resource.data.userId;` (authors can update their own posts).
    *   `allow update, delete: if isAdmin();` (admins can update and delete any post).
*   **Read Frequency:** High.
*   **Write Frequency:** Medium.
*   **Scaling Considerations:**
    *   `upvotes`, `downvotes`, `commentCount` should be updated via Cloud Functions to maintain consistency.
    *   For full-text search on `title` and `content`, consider a dedicated search service.

### 12. `comments` Subcollection (under `community_posts/{postId}/comments`)

*   **Purpose:** Stores comments for community posts.
*   **Relationships:**
    *   Many-to-one with `community_posts`.
    *   Many-to-one with `users`.
*   **Fields:**
    *   `id` (string, Document ID).
    *   `userId` (string): Reference to the `users` document.
    *   `content` (string).
    *   `createdAt` (timestamp).
    *   `updatedAt` (timestamp).
*   **Indexes:**
    *   Single-field index on `createdAt` for ordering comments.
*   **Security Rules:**
    *   `match /community_posts/{postId}/comments/{commentId} {
        allow read: if get(/databases/$(database)/documents/community_posts/$(postId)).data.status == 'published' || isAdmin() || (isAuthenticated() && request.auth.uid == resource.data.userId);
        allow create: if isAuthenticated() && request.auth.uid == request.resource.data.userId;
        allow update, delete: if isAuthenticated() && request.auth.uid == resource.data.userId;
    }`
*   **Read Frequency:** High.
*   **Write Frequency:** High.
*   **Scaling Considerations:**
    *   `commentCount` on the parent `community_posts` document should be updated via a Cloud Function trigger.

### 13. `events` Collection

*   **Purpose:** Stores information about events (e.g., meetups, workshops).
*   **Relationships:**
    *   Many-to-one with `partners` (an event can be hosted by a partner).
    *   Many-to-one with `users` (an event can be created by a user/admin).
*   **Fields:**
    *   `id` (string, Document ID).
    *   `title` (string).
    *   `description` (string).
    *   `date` (timestamp).
    *   `location` (string).
    *   `imageUrl` (string, optional).
    *   `organizerId` (string): Reference to `users` or `partners`.
    *   `type` (string): `public`, `private`.
    *   `attendeeCount` (number).
    *   `createdAt` (timestamp).
    *   `updatedAt` (timestamp).
*   **Indexes:**
    *   Single-field indexes on `date`, `location`, `organizerId`, `type`.
*   **Security Rules:**
    *   `allow read: if resource.data.type == 'public' || isAdmin();`
    *   `allow create, update, delete: if isAdmin();`
*   **Read Frequency:** Medium.
*   **Write Frequency:** Low.
*   **Scaling Considerations:**
    *   `attendeeCount` should be updated via Cloud Functions if attendees are tracked in a separate collection.

### 14. `partners` Collection

*   **Purpose:** Stores profiles of partner organizations (e.g., hotels, restaurants, activity providers).
*   **Relationships:**
    *   One-to-many with `events` (a partner can host many events).
    *   One-to-many with `hotels`, `restaurants`, `cafes` (a partner can own multiple establishments).
*   **Fields:**
    *   `id` (string, Document ID).
    *   `name` (string).
    *   `description` (string).
    *   `contactEmail` (string).
    *   `website` (string, optional).
    *   `logoUrl` (string, optional).
    *   `type` (string): `hotel`, `restaurant`, `activity_provider`.
    *   `createdAt` (timestamp).
    *   `updatedAt` (timestamp).
*   **Indexes:**
    *   Single-field indexes on `type`, `name`.
*   **Security Rules:**
    *   `allow read: if true;` (publicly readable).
    *   `allow create, update, delete: if isAdmin();` (only admins can manage partners).
*   **Read Frequency:** Medium.
*   **Write Frequency:** Low.
*   **Scaling Considerations:**
    *   Partners might have associated users with `role: 'partner'` in the `users` collection, linked by `partnerId`.

### 15. `hotels` Collection

*   **Purpose:** Stores details of hotel listings.
*   **Relationships:**
    *   Many-to-one with `partners` (a hotel belongs to a partner).
    *   Many-to-one with `cities`.
*   **Fields:**
    *   `id` (string, Document ID).
    *   `partnerId` (string, optional): Reference to the `partners` document.
    *   `name` (string).
    *   `description` (string).
    *   `address` (string).
    *   `cityId` (string): Reference to the `cities` document.
    *   `imageUrl` (string, optional).
    *   `rating` (number).
    *   `priceRange` (string).
    *   `amenities` (array of strings).
    *   `createdAt` (timestamp).
    *   `updatedAt` (timestamp).
*   **Indexes:**
    *   Single-field indexes on `cityId`, `rating`, `priceRange`, `amenities` (array-contains).
*   **Security Rules:**
    *   `allow read: if true;`.
    *   `allow create, update, delete: if isAdmin();`.
*   **Read Frequency:** High.
*   **Write Frequency:** Low.

### 16. `restaurants` Collection

*   **Purpose:** Stores details of restaurant listings.
*   **Relationships:**
    *   Many-to-one with `partners`.
    *   Many-to-one with `cities`.
*   **Fields:**
    *   `id` (string, Document ID).
    *   `partnerId` (string, optional).
    *   `name` (string).
    *   `description` (string).
    *   `address` (string).
    *   `cityId` (string).
    *   `imageUrl` (string, optional).
    *   `cuisine` (string).
    *   `priceRange` (string).
    *   `rating` (number).
    *   `createdAt` (timestamp).
    *   `updatedAt` (timestamp).
*   **Indexes:**
    *   Single-field indexes on `cityId`, `cuisine`, `priceRange`, `rating`.
*   **Security Rules:**
    *   `allow read: if true;`.
    *   `allow create, update, delete: if isAdmin();`.
*   **Read Frequency:** High.
*   **Write Frequency:** Low.

### 17. `cafes` Collection

*   **Purpose:** Stores details of cafe listings.
*   **Relationships:**
    *   Many-to-one with `partners`.
    *   Many-to-one with `cities`.
*   **Fields:**
    *   `id` (string, Document ID).
    *   `partnerId` (string, optional).
    *   `name` (string).
    *   `description` (string).
    *   `address` (string).
    *   `cityId` (string).
    *   `imageUrl` (string, optional).
    *   `type` (string): `coffee_shop`, `tea_house`, `bakery`.
    *   `priceRange` (string).
    *   `rating` (number).
    *   `createdAt` (timestamp).
    *   `updatedAt` (timestamp).
*   **Indexes:**
    *   Single-field indexes on `cityId`, `type`, `priceRange`, `rating`.
*   **Security Rules:**
    *   `allow read: if true;`.
    *   `allow create, update, delete: if isAdmin();`.
*   **Read Frequency:** High.
*   **Write Frequency:** Low.

### 18. `cities` Collection

*   **Purpose:** Stores information about cities where services are available.
*   **Relationships:**
    *   One-to-many with `companions`, `hotels`, `restaurants`, `cafes`, `activities`.
*   **Fields:**
    *   `id` (string, Document ID).
    *   `name` (string).
    *   `country` (string).
    *   `description` (string, optional).
    *   `imageUrl` (string, optional).
    *   `latitude` (number).
    *   `longitude` (number).
    *   `createdAt` (timestamp).
    *   `updatedAt` (timestamp).
*   **Indexes:**
    *   Single-field indexes on `name`, `country`.
*   **Security Rules:**
    *   `allow read: if true;`.
    *   `allow create, update, delete: if isAdmin();`.
*   **Read Frequency:** High.
*   **Write Frequency:** Very Low.

### 19. `reports` Collection

*   **Purpose:** Stores user-generated reports (e.g., abuse, inappropriate content).
*   **Relationships:**
    *   Many-to-one with `users` (a report is filed by a user).
*   **Fields:**
    *   `id` (string, Document ID).
    *   `reporterId` (string): Reference to the `users` document.
    *   `reportedEntityId` (string): ID of the entity being reported (e.g., `companionId`, `postId`, `messageId`).
    *   `reportedEntityType` (string): Type of entity (e.g., `companion`, `community_post`, `message`).
    *   `reason` (string).
    *   `details` (string, optional).
    *   `status` (string): `pending`, `reviewed`, `resolved`, `rejected`.
    *   `createdAt` (timestamp).
    *   `updatedAt` (timestamp).
*   **Indexes:**
    *   Single-field indexes on `reporterId`, `reportedEntityType`, `status`, `createdAt`.
*   **Security Rules:**
    *   `allow create: if isAuthenticated() && request.auth.uid == request.resource.data.reporterId;` (users can create reports).
    *   `allow read, update: if isAdmin();` (only admins can read/update reports).
*   **Read Frequency:** Low (admin dashboard).
*   **Write Frequency:** Low to Medium.

### 20. `support_tickets` Collection

*   **Purpose:** Stores user support tickets.
*   **Relationships:**
    *   Many-to-one with `users` (a ticket is created by a user).
*   **Fields:**
    *   `id` (string, Document ID).
    *   `userId` (string): Reference to the `users` document.
    *   `subject` (string).
    *   `description` (string).
    *   `status` (string): `open`, `in_progress`, `closed`.
    *   `priority` (string): `low`, `medium`, `high`.
    *   `assignedTo` (string, optional): Admin user ID.
    *   `createdAt` (timestamp).
    *   `updatedAt` (timestamp).
*   **Indexes:**
    *   Single-field indexes on `userId`, `status`, `priority`, `assignedTo`, `createdAt`.
*   **Security Rules:**
    *   `allow create: if isAuthenticated() && request.auth.uid == request.resource.data.userId;` (users can create tickets).
    *   `allow read, update: if isAuthenticated() && (request.auth.uid == resource.data.userId || isAdmin());` (users can read/update their own tickets, admins can read/update all).
*   **Read Frequency:** Medium.
*   **Write Frequency:** Medium.

### 21. `verification_requests` Collection

*   **Purpose:** Stores requests for companion identity verification.
*   **Relationships:**
    *   Many-to-one with `users` (a request is made by a companion user).
*   **Fields:**
    *   `id` (string, Document ID).
    *   `companionId` (string): Reference to the `users` document (companion).
    *   `documentType` (string): `citizenship`, `passport`.
    *   `documentUrl` (string): URL to the uploaded document in Storage.
    *   `status` (string): `pending`, `approved`, `rejected`.
    *   `adminNotes` (string, optional).
    *   `createdAt` (timestamp).
    *   `updatedAt` (timestamp).
*   **Indexes:**
    *   Single-field indexes on `companionId`, `status`, `createdAt`.
*   **Security Rules:**
    *   `allow create: if isCompanion() && request.auth.uid == request.resource.data.companionId;` (companions can submit requests).
    *   `allow read: if isCompanion() && request.auth.uid == resource.data.companionId;` (companions can read their own, admins can read all).
    *   `allow update: if isAdmin();` (only admins can update status).
*   **Read Frequency:** Low.
*   **Write Frequency:** Low.

### 22. `analytics` Collection

*   **Purpose:** Stores aggregated or raw analytics data for reporting and insights.
*   **Relationships:**
    *   No direct relationships, but data might be derived from other collections.
*   **Fields:** (Example fields, actual fields depend on analytics needs)
    *   `id` (string, Document ID).
    *   `eventType` (string): `login`, `booking_created`, `message_sent`, `search_performed`.
    *   `userId` (string, optional).
    *   `timestamp` (timestamp).
    *   `data` (map, optional): Additional event-specific data.
*   **Indexes:**
    *   Single-field indexes on `eventType`, `timestamp`, `userId`.
*   **Security Rules:**
    *   `allow read: if isAdmin();` (only admins can read).
    *   `allow create: if false;` (Cloud Functions will handle this).
    *   `allow update, delete: if false;`.
*   **Read Frequency:** Low (admin/reporting tools).
*   **Write Frequency:** High (event logging, typically via Cloud Functions).
*   **Scaling Considerations:**
    *   For very high-volume event logging, consider using BigQuery for raw event data and only storing aggregated results in Firestore.
    *   Cloud Functions should be used to process and write analytics events to prevent client-side abuse and ensure data consistency.

This schema provides a robust foundation for the SATHI application, addressing the requirements for scalability, performance, and security across various features. The use of subcollections for frequently growing lists (like messages, favorites) and denormalization for read optimization are key strategies employed. Cloud Functions are critical for maintaining data integrity, performing complex logic, and updating aggregated fields.
