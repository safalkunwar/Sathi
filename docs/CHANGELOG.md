# Changelog

## v0.18.0 - 2026-07-14

Added
- Redesigned desktop Community Moments (Stories) section with Instagram-quality cards
- New `StoryCard` component (`src/components/cards/StoryCard.tsx`) with glassmorphism overlay, animated gold border, and hover zoom
- Category filter chips for stories (Hiking, Coffee Buddy, Photography, etc.) with client-side filtering
- Story preview play button overlay on hover
- Like count, comment count, time, and verified badge display on story cards
- Keyboard navigation (arrow keys) and mouse wheel horizontal scroll for story carousel
- Lazy loading images and memoized StoryCard for performance

Changed
- Community Moments section now uses real Firestore-backed `stories` data instead of hardcoded mock data
- Card dimensions increased for premium desktop feel (300px/360px width, 460px/520px height)

Fixed
- None

## v0.16.0 - 2026-07-12

Added
- Recently viewed companions carousel in explore tab
- Conversation search/filter in MessagesTab with clear button
- Online status indicators in messages sidebar
- Notifications dropdown in navbar bell icon
- Notifications section in customer dashboard
- Booking date/time validation in BookingFlowModal
- Mark Complete action for confirmed bookings
- Profile editing form in dashboard
- Available days tags in companion profile modal

Changed
- MessagesTab now shows message read/sent status
- Companion profile modal shows real availability from Firestore
- Booking flow shows companion location on map when available
- Admin panel sidebar expanded with Users, Companions, and Content sections
- Admin panel mobile tabs updated for new sections

Fixed
- Restored ClientApp.tsx from broken JSX state
- Fixed loading state bugs in useCompanions and useStories hooks

## v0.17.0 - 2026-07-12

Added
- Audit logging service for admin actions
- Admin notes on guide applications with audit trail
- Bulk role changes and checkboxes in AdminUsers
- Status filtering and booking details modal in AdminBookings
- Quick action cards in AdminOverview for fast navigation
- Fixed duplicate imports in AdminApp.tsx

Changed
- Admin guide approve/reject actions now log audit entries
- Admin panel action traceability improved

Fixed
- None

## v0.15.0 - 2026-07-12

Added
- AdminUsers component for user management and role changes
- AdminCompanions component for verification/suspension management
- AdminContent component for activities and events management
- Expanded admin panel routing and sidebar navigation

Changed
- AdminApp.tsx includes Users, Companions, Content, Security, and Feedback sections
- Mobile admin tabs updated for full feature access

## v0.14.0 - 2026-07-12

Added
- Expanded Vitest coverage to 23 passing tests
- Firestore service tests for empty db fallback
- Auth service tests for toAuthUser mapping
- Notification service tests for showLocalNotification safety

## v0.13.0 - 2026-07-12

Added
- Booking status notifications in AppContext
- Booking cancellation and completion actions
- Recent bookings section in customer dashboard

## v0.12.0 - 2026-07-12

Added
- User-side UX improvements across messaging and dashboard
- Login button in MessagesTab for unauthenticated users
- Loading skeleton for companions grid

## v0.11.0 - 2026-07-12

Added
- Production-grade Firestore Security Rules with RBAC model.
- 40+ composite indexes for optimized Firestore queries.
- Core Cloud Functions for Auth, Bookings, Messaging, and Ratings in `functions/src/index.ts`.
- Comprehensive Firebase Implementation Report (`FIREBASE_IMPLEMENTATION_REPORT.md`).

Changed
- Hardened Firebase initialization in `src/firebase.ts` with strict environment variable validation.
- Linked local environment to `hamrosathi1` project.

Fixed
- Resolved `auth/configuration-not-found` error path in Firebase initialization.
