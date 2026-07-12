# Firestore Index Recommendations for SATHI

This document consolidates the recommended Firestore indexes for the SATHI application, derived from the scalable Firestore schema (`FirestoreSchema.md`) and the security rules (`SecurityRules.md`). Proper indexing is crucial for achieving optimal query performance, minimizing read costs, and ensuring the application can scale to support 10,000+ concurrent users.

Firestore automatically creates single-field indexes for most fields. However, for queries involving multiple `where` clauses, `orderBy` clauses, or `array-contains` operations, composite indexes are required. The following recommendations focus on these composite indexes and highlight important single-field indexes.

## General Indexing Principles

*   **Query Optimization:** Indexes are designed to support the most frequent and critical queries, especially those involving filtering, ordering, and range comparisons.
*   **Cost Efficiency:** Well-designed indexes reduce the number of documents scanned, thereby lowering read costs.
*   **Scalability:** Indexes are essential for maintaining performance as the database grows in size and query volume.
*   **Collection Group Indexes:** Where subcollections are used and queries across all instances of that subcollection are needed (e.g., all messages from all conversations), collection group indexes will be necessary.

## Recommended Indexes by Collection

### 1. `users` Collection

*   **Purpose:** Efficiently retrieve users based on roles and creation time.
*   **Composite Indexes:**
    *   `role ASC, createdAt DESC` (for fetching users by role, ordered by creation date)

### 2. `companions` Collection

*   **Purpose:** Support various search and filtering criteria for companions.
*   **Composite Indexes:**
    *   `location ASC, rating DESC` (for finding companions in a location, highest rated first)
    *   `location ASC, hourlyRate ASC` (for finding companions in a location, cheapest first)
    *   `languages (array-contains), rating DESC` (for finding companions speaking a language, highest rated first)
    *   `isVerified ASC, rating DESC` (for finding verified companions, highest rated first)

### 3. `activities` Collection

*   **Purpose:** Enable efficient browsing and filtering of activities.
*   **Composite Indexes:**
    *   `category ASC, price ASC` (for finding activities by category, cheapest first)
    *   `companionId ASC, category ASC` (for finding activities offered by a specific companion, filtered by category)
    *   `location ASC, category ASC, price ASC` (for finding activities in a location by category and price)

### 4. `bookings` Collection

*   **Purpose:** Facilitate retrieval of bookings for users and companions, filtered by status and date.
*   **Composite Indexes:**
    *   `userId ASC, status ASC, date DESC` (for a user's bookings, filtered by status, most recent first)
    *   `companionId ASC, status ASC, date DESC` (for a companion's bookings, filtered by status, most recent first)
    *   `status ASC, date DESC` (for overall booking management, most recent first)

### 5. `reviews` Collection

*   **Purpose:** Efficiently fetch reviews for companions and activities.
*   **Composite Indexes:**
    *   `companionId ASC, rating DESC` (for a companion's reviews, highest rated first)
    *   `companionId ASC, createdAt DESC` (for a companion's reviews, most recent first)
    *   `activityId ASC, rating DESC` (for an activity's reviews, highest rated first)
    *   `userId ASC, createdAt DESC` (for a user's written reviews, most recent first)

### 6. `conversations` Collection

*   **Purpose:** Allow users to quickly find their conversations, ordered by recent activity.
*   **Composite Indexes:**
    *   `participantIds (array-contains), updatedAt DESC` (for finding conversations a user is part of, most recently active first)

### 7. `messages` Subcollection (under `conversations/{conversationId}/messages`)

*   **Purpose:** Order messages within a conversation.
*   **Single-Field Indexes:**
    *   `timestamp DESC` (for fetching messages in reverse chronological order for infinite scroll)

### 8. `notifications` Collection

*   **Purpose:** Retrieve unread notifications for a user, ordered by recency.
*   **Composite Indexes:**
    *   `userId ASC, isRead ASC, timestamp DESC` (for fetching unread notifications for a user, most recent first)

### 9. `payments` Collection

*   **Purpose:** Allow users and admins to view payment history and status.
*   **Composite Indexes:**
    *   `userId ASC, status ASC, createdAt DESC` (for a user's payments, filtered by status, most recent first)
    *   `bookingId ASC, status ASC` (for payments related to a specific booking)

### 10. `favorites` Subcollection (under `users/{userId}/favorites`)

*   **Purpose:** Order user's favorited items.
*   **Single-Field Indexes:**
    *   `createdAt DESC`

### 11. `community_posts` Collection

*   **Purpose:** Enable filtering and sorting of community posts.
*   **Composite Indexes:**
    *   `status ASC, createdAt DESC` (for published posts, most recent first)
    *   `category ASC, createdAt DESC` (for posts by category, most recent first)
    *   `userId ASC, createdAt DESC` (for a user's posts)

### 12. `comments` Subcollection (under `community_posts/{postId}/comments`)

*   **Purpose:** Order comments within a post.
*   **Single-Field Indexes:**
    *   `createdAt ASC` (for displaying comments chronologically)

### 13. `events` Collection

*   **Purpose:** Filter and sort events.
*   **Composite Indexes:**
    *   `type ASC, date ASC` (for public events, upcoming first)
    *   `location ASC, date ASC` (for events in a specific location)

### 14. `partners` Collection

*   **Purpose:** Filter partners by type.
*   **Single-Field Indexes:**
    *   `type ASC`
    *   `name ASC`

### 15. `hotels` Collection

*   **Purpose:** Filter hotels by city, rating, and amenities.
*   **Composite Indexes:**
    *   `cityId ASC, rating DESC`
    *   `cityId ASC, priceRange ASC`
    *   `amenities (array-contains), rating DESC`

### 16. `restaurants` Collection

*   **Purpose:** Filter restaurants by city, cuisine, and rating.
*   **Composite Indexes:**
    *   `cityId ASC, cuisine ASC, rating DESC`
    *   `cityId ASC, priceRange ASC`

### 17. `cafes` Collection

*   **Purpose:** Filter cafes by city, type, and rating.
*   **Composite Indexes:**
    *   `cityId ASC, type ASC, rating DESC`
    *   `cityId ASC, priceRange ASC`

### 18. `cities` Collection

*   **Purpose:** Efficiently retrieve city information.
*   **Single-Field Indexes:**
    *   `name ASC`
    *   `country ASC`

### 19. `reports` Collection

*   **Purpose:** Filter reports by status and type.
*   **Composite Indexes:**
    *   `status ASC, createdAt DESC`
    *   `reportedEntityType ASC, status ASC`

### 20. `support_tickets` Collection

*   **Purpose:** Filter support tickets by user, status, and priority.
*   **Composite Indexes:**
    *   `userId ASC, status ASC, createdAt DESC`
    *   `assignedTo ASC, status ASC, createdAt DESC`

### 21. `verification_requests` Collection

*   **Purpose:** Filter verification requests by status and companion.
*   **Composite Indexes:**
    *   `companionId ASC, status ASC, createdAt DESC`
    *   `status ASC, createdAt DESC`

### 22. `analytics` Collection

*   **Purpose:** Filter analytics events by type and timestamp.
*   **Composite Indexes:**
    *   `eventType ASC, timestamp DESC`
    *   `userId ASC, eventType ASC, timestamp DESC`

## Deploying Indexes

These composite indexes should be defined in `firestore.indexes.json` and deployed using the Firebase CLI (`firebase deploy --only firestore:indexes`). Firestore will automatically suggest missing indexes based on query patterns during development, which should be reviewed and added to this file. Regularly monitoring query performance in the Firebase Console is essential to identify and create any additional necessary indexes.
