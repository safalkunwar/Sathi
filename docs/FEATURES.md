# Features

Legend: Not Started | Planning | In Development | Testing | Completed

## Authentication

- Description: User signup, login, logout, password reset, Google login
- Dependencies: Firebase Auth
- Related Files: AuthModal.tsx, AppContext.tsx, main.tsx
- Status: In Development (mock only)
- Notes: Current implementation creates local user object

## Profile Management

- Description: User profile CRUD, avatar upload, companion profile creation, KYC upload
- Dependencies: Firebase Auth, Firestore, Firebase Storage
- Related Files: DashboardTab.tsx, AuthModal.tsx
- Status: Not Started

## Search & Discovery

- Description: Location search, interest filters, sorting, distance calculation
- Dependencies: Firestore, Google Maps
- Related Files: ClientApp.tsx, Navbar.tsx
- Status: In Development (client-side only)
- Notes: Currently filters hardcoded COMPANIONS array

## Companion Profiles

- Description: Full profile with photos, bio, languages, interests, pricing, availability, reviews, ratings
- Dependencies: Firestore, Firebase Storage
- Related Files: CompanionProfileModal.tsx, BookingFlowModal.tsx, types.ts
- Status: Partial (UI only)

## Reviews & Ratings

- Description: Post-booking reviews, star ratings, review moderation
- Dependencies: Firestore
- Related Files: types.ts
- Status: Not Started

## Booking System

- Description: Date/time selection, duration, meeting point, special requests, price summary, status tracking, history
- Dependencies: Firestore, Cloud Functions
- Related Files: BookingFlowModal.tsx, BookingModal.tsx, AppContext.tsx
- Status: Partial (UI only, local state)

## Payments

- Description: Khalti and eSewa integration, payment verification, refunds, platform commission tracking
- Dependencies: Khalti SDK, eSewa SDK, Cloud Functions
- Related Files: BookingFlowModal.tsx
- Status: Not Started

## Messaging

- Description: Realtime chat, typing indicator, read receipts, media attachments, voice notes
- Dependencies: Firestore, FCM, Firebase Storage
- Related Files: MessagesTab.tsx, AppContext.tsx
- Status: Partial (UI only, local state)

## Notifications

- Description: In-app notifications, push notifications for booking/messages/system
- Dependencies: FCM, Firestore
- Related Files: AppContext.tsx, Navbar.tsx
- Status: Not Started

## Maps

- Description: Interactive map for companion locations, route preview, distance calculation
- Dependencies: Google Maps SDK
- Related Files: BookingFlowModal.tsx
- Status: Not Started

## Community

- Description: Stories feed, groups, events, challenges, local meetups
- Dependencies: Firestore
- Related Files: ClientApp.tsx, data.ts
- Status: Partial (static UI only)

## Admin Dashboard

- Description: User management, companion verification, booking management, revenue analytics, reports
- Dependencies: Firestore, Cloud Functions, Auth custom claims
- Related Files: admin/*.tsx
- Status: Partial (UI only, mock data)

## Trust & Safety

- Description: Government ID verification, selfie verification, SOS button, emergency contacts, live location sharing, blocking, reporting
- Dependencies: Firebase Storage, Firestore, FCM, Maps
- Related Files: SafetyWidget.tsx, AuthModal.tsx
- Status: Partial (UI only)

## Partner Ecosystem

- Description: Partner dashboards, offers, promotions, referral tracking, analytics
- Dependencies: Firestore, Cloud Functions
- Related Files: None yet
- Status: Not Started

## Offline Support

- Description: Cache profiles, bookings, chats, images; sync when online
- Dependencies: IndexedDB / Service Worker
- Related Files: None yet
- Status: Not Started

## Testing

- Description: Unit tests, integration tests, component tests, critical flow tests
- Dependencies: Vitest, React Testing Library
- Related Files: Tests alongside components
- Status: Not Started
