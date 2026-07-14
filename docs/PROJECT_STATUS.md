# Project Status

## Audit correction — 2026-07-13

The repository audit is complete. Previous status claims are inconsistent with the current code: the web app contains real Firebase integration, but it is not production-ready. Priority blockers are the Firestore client/rule contract mismatch, insecure client-side payment secrets, inconsistent messaging paths, failing type checks, and the pending Blaze-plan upgrade required before Cloud Functions can be deployed. No implementation changes were made in this audit session.

Current Phase:
Phase 4 - Optimization & Ecosystem

Overall Progress:
82%

Current Sprint:
Sprint 5

Current Focus:
WCAG AA accessibility compliance

Completed

✅ Phase 1 Audit & Documentation
✅ Firebase app initialization (`src/firebase.ts`)
✅ Firebase Auth wrappers with claims (`src/services/auth.ts`)
✅ Firestore service layer (`src/services/firestore.ts`)
✅ Real-time data hooks with offline cache (`src/hooks/useFirestoreData.ts`)
✅ AppContext integrated with Firebase Auth
✅ AuthModal wired to real Firebase Auth
✅ Bookings persist to Firestore (offline queue supported)
✅ Duplicate BookingModal.tsx removed
✅ Currency inconsistency fixed ($ → NPR)
✅ React Router configured (`src/App.tsx`)
✅ AuthGuard, AdminGuard, LoadingScreen created
✅ Firestore seed script (`src/scripts/seed.ts`)
✅ Google Maps integration (MapPreview component)
✅ Activities and events Firestore collections
✅ Real-time messaging via Firestore (`MessagesTab.tsx`)
✅ Admin custom claims enforcement (`AdminGuard.tsx`)
✅ Payment service (`src/services/payments.ts`) with Khalti/eSewa initiation
✅ Notification service (`src/services/notifications.ts`) with FCM foreground listener
✅ NotificationProvider component
✅ Offline storage service (`src/services/storage.ts`) with IndexedDB
✅ Testing framework setup (Vitest + React Testing Library)
✅ Expanded test coverage (`src/__tests__/AppContext.test.ts`)
✅ CI/CD pipeline (`.github/workflows/ci.yml`)
✅ Accessibility improvements (aria labels, dialog roles, form associations, keyboard navigation)
✅ Performance optimization (React.memo, lazy loading images)
✅ Partner dashboard component (`src/components/dashboard/PartnerDashboard.tsx`)
✅ Admin panels migrated to real Firestore data (`AdminOverview`, `AdminBookings`, `AdminGuides`, `AdminFeedback`)
✅ Redesigned desktop Community Moments section with premium StoryCard component and category filters

In Progress

🟡 WCAG AA full compliance

Pending

⬜ Admin Security real data migration (SOS alerts, suspicious activity)

Next Milestone

Production-ready SATHI with full test suite and accessibility compliance

Known Blockers

None
