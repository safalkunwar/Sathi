# API Documentation

No backend API currently exists. Planned Firebase endpoints via Cloud Functions and Firestore.

## Planned Cloud Functions

### createBooking
Trigger: HTTPS callable
Auth: required
Input: companionId, date, time, duration, location, participants, specialRequests
Output: booking document + payment initiation payload

### confirmBooking
Trigger: HTTPS callable
Auth: required (companion/admin)
Input: bookingId, action (confirm|reject|cancel)
Output: updated booking status + user notification

### processPaymentWebhook
Trigger: HTTPS (Khalti/eSewa webhook)
Auth: secret key verification
Input: payment verification payload
Output: booking payment status update

### sendMessage
Trigger: HTTPS callable (or Firestore onCreate)
Auth: required
Input: conversationId, text, type, mediaUrl?
Output: message document + FCM notification

### submitReview
Trigger: HTTPS callable
Auth: required
Input: companionId, bookingId, rating, text
Output: review document + companion rating recalculation

### reportUser
Trigger: HTTPS callable
Auth: required
Input: targetId, reason, details
Output: report document + admin notification

### approveGuide
Trigger: HTTPS callable
Auth: admin
Input: userId, action (approve|reject), notes
Output: user role/verification status update

## Firestore Query Patterns

### Search companions by location
`companions` where `location` == input, order by `rating` desc

### Search companions by interest
`companions` where `interests` array-contains input, order by `rating` desc

### Get user bookings
`bookings` where `userId` == uid, order by `createdAt` desc

### Get companion bookings
`bookings` where `companionId` == id, order by `date` desc

### Get conversation messages
`messages` where `conversationId` == id, order by `createdAt` asc

### Get notifications
`notifications` where `userId` == uid, order by `createdAt` desc

## Client-Side Service Layer (Planned)

```
src/services/
├── auth.ts           # Firebase Auth wrappers
├── firestore.ts      # Firestore initialization
├── companions.ts     # Companion CRUD and search
├── bookings.ts       # Booking creation and queries
├── messages.ts       # Real-time messaging
├── payments.ts       # Khalti/eSewa SDK integration
├── notifications.ts  # FCM setup and handlers
├── maps.ts           # Google Maps initialization
├── storage.ts        # Firebase Storage uploads
├── storage.ts        # LocalStorage/IndexedDB for offline cache
```
