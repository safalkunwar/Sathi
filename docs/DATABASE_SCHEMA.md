# Database Schema

Target: Cloud Firestore

## Collection: users

Purpose: Customer and companion profile data

Fields:
- uid (string, PK) - Firebase Auth UID
- name (string)
- email (string)
- avatar (string) - URL
- role (string) - customer | companion | admin
- phone (string) - optional
- bio (string) - optional
- favorites (array<string>) - companion IDs
- createdAt (timestamp)
- updatedAt (timestamp)

Security Rules:
- Read: public
- Write: owner or admin

Relationships:
- 1:N bookings (as user)
- 1:N messages (as sender)
- 1:N notifications

## Collection: companions

Purpose: Companion/guide listings

Fields:
- id (string, PK)
- userId (string, ref users.uid) - owner
- name (string)
- age (number)
- gender (string)
- bio (string)
- hourlyRate (number) - NPR
- rating (number)
- reviewsCount (number)
- isVerified (boolean)
- verificationStatus (string) - pending | approved | rejected
- location (string)
- coordinates (GeoPoint) - for map
- languages (array<string>)
- interests (array<string>)
- images (array<string>)
- availableDays (array<string>)
- responseRate (number)
- responseTime (string)
- completedBookings (number)
- trustScore (number)
- createdAt (timestamp)
- updatedAt (timestamp)

Security Rules:
- Read: public
- Write: owner or admin

Relationships:
- 1:N reviews
- 1:N bookings
- 1:N messages
- 1:N calendars

## Collection: bookings

Purpose: Booking records

Fields:
- id (string, PK)
- companionId (string, ref companions.id)
- userId (string, ref users.uid)
- date (string) - ISO date
- time (string) - ISO time
- duration (number) - hours
- participants (number)
- status (string) - pending | confirmed | active | completed | cancelled
- totalPrice (number) - NPR
- platformFee (number) - NPR
- companionPayout (number) - NPR
- meetingPoint (string)
- specialRequests (string)
- paymentMethod (string) - khalti | esewa
- paymentStatus (string) - pending | paid | failed | refunded
- paymentId (string) - gateway reference
- createdAt (timestamp)
- updatedAt (timestamp)

Security Rules:
- Read: participants or admin
- Write: system or admin

Relationships:
- N:1 companion
- N:1 user

## Collection: messages

Purpose: Chat messages

Fields:
- id (string, PK)
- conversationId (string, ref conversations.id)
- senderId (string, ref users.uid)
- text (string)
- mediaUrls (array<string>) - optional
- type (string) - text | image | video | file | voice
- isRead (boolean)
- createdAt (timestamp)

Security Rules:
- Read: conversation participants
- Write: conversation participants

Relationships:
- N:1 conversation
- N:1 user (sender)

## Collection: conversations

Purpose: Chat threads

Fields:
- id (string, PK)
- participantIds (array<string>) - [userUid, companionUserId]
- lastMessage (map)
- unreadCount (number)
- createdAt (timestamp)
- updatedAt (timestamp)

Security Rules:
- Read: participants
- Write: participants

## Collection: reviews

Purpose: User reviews for companions

Fields:
- id (string, PK)
- companionId (string, ref companions.id)
- userId (string, ref users.uid)
- bookingId (string, ref bookings.id)
- rating (number)
- text (string)
- date (timestamp)

Security Rules:
- Read: public
- Write: owner

## Collection: notifications

Purpose: In-app notifications

Fields:
- id (string, PK)
- userId (string, ref users.uid)
- title (string)
- message (string)
- type (string) - booking | message | system
- isRead (boolean)
- link (string) - optional
- createdAt (timestamp)

Security Rules:
- Read: owner
- Write: system or owner

## Collection: events

Purpose: Local events / meetups

Fields:
- id (string, PK)
- title (string)
- description (string)
- date (timestamp)
- time (string)
- location (string)
- coordinates (GeoPoint)
- spots (number)
- participants (array<string>) - user refs
- imageUrl (string)
- createdBy (string, ref users.uid)
- createdAt (timestamp)

## Collection: stories

Purpose: Community experience stories

Fields:
- id (string, PK)
- companionId (string, ref companions.id)
- userId (string, ref users.uid)
- imageUrl (string)
- caption (string)
- likes (number)
- comments (number)
- createdAt (timestamp)

## Collection: activities

Purpose: Activity catalog

Fields:
- id (string, PK)
- title (string)
- description (string)
- duration (string)
- avgPrice (number)
- imageUrl (string)
- companionCount (number)
- category (string)
