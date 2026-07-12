# Overall Firebase Architecture - SATHI Project

This document provides a high-level overview of the Firebase architecture for the SATHI application, integrating various Firebase services and custom logic to deliver a scalable, secure, and high-performance backend. The architecture is designed to support 10,000+ concurrent users with a clear upgrade path to 100,000+ users.

## 1. Core Firebase Services Utilized

*   **Firebase Authentication:** Manages user identities, sign-up, sign-in, and session management. Leverages custom claims for Role-Based Access Control (RBAC).
*   **Cloud Firestore:** A NoSQL, document-oriented database used for storing all application data. Designed with a scalable schema, optimized for reads and writes, and protected by robust security rules.
*   **Cloud Functions for Firebase:** Serverless execution environment for backend logic. Handles sensitive operations, data processing, aggregations, and integrations with external services (e.g., payment gateways).
*   **Firebase Cloud Storage:** Securely stores user-generated content such as avatars, companion images, activity photos, and chat attachments.
*   **Firebase Cloud Messaging (FCM):** Enables sending push notifications to users for real-time alerts, messages, and updates.
*   **Firebase Hosting:** Provides fast and secure hosting for the web application, leveraging a global Content Delivery Network (CDN).
*   **Firebase Performance Monitoring:** Collects performance data from client-side applications and Cloud Functions to identify and resolve bottlenecks.
*   **Firebase Crashlytics:** Provides real-time crash reporting for client-side applications.
*   **Google Analytics for Firebase:** Collects usage data and insights into user behavior.

## 2. Architectural Layers

### 2.1. Client Layer (Web Application)

*   **Technology:** React with Vite, TypeScript, and TailwindCSS.
*   **Interaction:** Communicates directly with Firebase Authentication, Firestore, and Storage via their respective SDKs.
*   **Key Features:** User Interface, Authentication flows (login, signup, Google Sign-In), Real-time data display, Messaging interface, Booking forms, Profile management.
*   **Optimizations:** Code splitting, lazy loading, image optimization, optimistic UI, client-side caching, efficient listener management.

### 2.2. Backend Layer (Cloud Functions)

*   **Purpose:** Executes server-side logic, enforces business rules, and integrates with external services.
*   **Triggers:** Responds to events from Firestore (onCreate, onUpdate, onDelete), Firebase Authentication (onCreate, onDelete), HTTPS requests (callable functions, webhooks), and scheduled (Pub/Sub) events.
*   **Key Responsibilities:**
    *   **Authentication & User Management:** Setting custom claims for RBAC, creating/deleting user profiles in Firestore.
    *   **Booking Logic:** Verification, commission calculation, payment processing (via webhooks), status updates, notifications.
    *   **Messaging:** Updating conversation metadata, sending push notifications.
    *   **Reviews & Ratings:** Aggregating ratings and updating companion/activity profiles.
    *   **Data Aggregation & Maintenance:** Analytics aggregation, data cleanup.
*   **Optimizations:** Cold start reduction, efficient database operations, asynchronous processing, in-memory caching.

### 2.3. Database Layer (Cloud Firestore)

*   **Structure:** Document-oriented NoSQL database with collections and subcollections.
*   **Schema:** Designed for scalability with denormalization, optimized indexing, and minimal document sizes (detailed in `FirestoreSchema.md`).
*   **Security:** Enforced by comprehensive Firestore Security Rules, leveraging RBAC via custom claims (detailed in `SecurityRules.md`).
*   **Key Collections:** `users`, `companions`, `activities`, `bookings`, `reviews`, `conversations`, `messages`, `notifications`, `payments`, `favorites`, `community_posts`, `events`, `partners`, `hotels`, `restaurants`, `cafes`, `cities`, `reports`, `support_tickets`, `verification_requests`, `analytics`.

### 2.4. Storage Layer (Firebase Cloud Storage)

*   **Purpose:** Stores binary large objects (BLOBs) such as images and files.
*   **Structure:** Organized with clear pathing (e.g., `/users/{userId}/avatars/`, `/companions/{companionId}/images/`).
*   **Security:** Controlled by Storage Security Rules to ensure only authorized users can upload, read, or delete files (detailed in `SecurityRules.md`).
*   **Optimizations:** Image optimization, lifecycle policies, CDN delivery.

## 3. Inter-Service Communication

*   **Client to Firebase:** Direct SDK calls for Auth, Firestore, Storage.
*   **Client to Cloud Functions:** HTTPS Callable Functions for specific backend operations.
*   **Firebase Services to Cloud Functions:** Event-driven triggers (Firestore `onWrite`, Auth `onCreate`, Storage `onFinalize`).
*   **External Services to Cloud Functions:** HTTPS endpoints for webhooks (e.g., payment gateways).

## 4. Scalability and Reliability

*   **Managed Services:** Firebase provides fully managed, scalable services, abstracting away infrastructure management.
*   **Global Infrastructure:** Leverages Google Cloud's global network for low latency and high availability.
*   **Redundancy:** Data is automatically replicated across multiple data centers.
*   **Monitoring & Alerting:** Integrated with Firebase Performance Monitoring, Crashlytics, and Cloud Monitoring for proactive issue detection and resolution.

This architecture provides a robust and flexible foundation for the SATHI application, capable of evolving with future demands while maintaining high standards of performance, security, and cost-efficiency, and developer experience.
