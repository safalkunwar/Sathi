# Changelog

## v0.5.0 - 2026-07-11

Added

- Vitest and React Testing Library dev dependencies
- `vitest.config.ts` for test runner setup
- Initial smoke test (`src/__tests__/AppContext.test.ts`)
- Package.json test scripts (`test`, `test:watch`)

Changed

- Testing framework ready for component and integration tests

Fixed

- None

## v0.10.0 - 2026-07-11

Added

- WCAG AA accessibility pass:
  - `role="dialog"` and `aria-modal` on BookingFlowModal and CompanionProfileModal
  - `aria-label` on icon buttons across Navbar and MessagesTab
  - `htmlFor`/`id` associations on form inputs in AuthModal, BookingFlowModal
  - `role="region"` and `aria-label` on MessagesTab sidebar
  - Heading ids for `aria-labelledby` references

Changed

- Improved keyboard navigation support on modal close buttons and form controls

Fixed

- None

## v0.9.0 - 2026-07-11

Added

- AdminOverview subscribes to users, companions, and bookings for live metrics
- AdminBookings subscribes to bookings collection with search filter
- AdminGuides subscribes to companions for active guides list
- AdminFeedback subscribes to notifications for system notifications
- Admin Security sections marked for future alerts collection migration
- Expanded test coverage: Booking/Companion type tests, admin filtering tests, payment provider tests

Changed

- Admin panels now use real Firestore data where collections exist
- Mock data preserved for SOS alerts, suspicious activity, and pending guide KYC (pending backend flows)

Fixed

- None

## v0.8.0 - 2026-07-11

Added

- Partner dashboard component (`src/components/dashboard/PartnerDashboard.tsx`)
- Partner stats cards (views, bookings, revenue, rating)
- Offers management UI in partner dashboard
- `/partner` route guarded by AuthGuard
- Partner tab in Navbar and ClientApp

Changed

- ClientApp supports `partner` tab
- NavbarProps extended to include `partner` tab

Fixed

- None

## v0.7.0 - 2026-07-11

Added

- Accessibility improvements:
  - `aria-label` on Navbar icon buttons
  - `role="dialog"` and `aria-modal` on AuthModal
  - `htmlFor`/`id` associations on AuthModal form fields
  - Keyboard navigation support on logo button
- Image lazy loading on below-the-fold images
- `React.memo` on `ClientApp` to reduce re-renders

Changed

- Performance optimization pass on ClientApp

Fixed

- Duplicate aria-label removed from Navbar logo

## v0.6.0 - 2026-07-11

Added

- GitHub Actions CI workflow (`.github/workflows/ci.yml`)
- CI runs typecheck, tests, and build on every push/PR
- Environment secrets documentation for CI

Changed

- CI/CD pipeline configured for automated validation

Fixed

- None

## v0.5.0 - 2026-07-11

Added

- Vitest and React Testing Library dev dependencies
- `vitest.config.ts` for test runner setup
- Initial smoke test (`src/__tests__/AppContext.test.ts`)
- Package.json test scripts (`test`, `test:watch`)

Changed

- Testing framework ready for component and integration tests

Fixed

- None

## v0.4.0 - 2026-07-11

Added

- Real-time messaging via Firestore (`MessagesTab.tsx`)
- Admin custom claims enforcement (`AdminGuard.tsx`)
- `claims` field to `User` type
- `getIdTokenClaims` to auth service
- NotificationProvider component (`src/components/notifications/NotificationProvider.tsx`)
- `onForegroundMessage` to notification service
- Offline storage service (`src/services/storage.ts`)
- Offline caching in hooks (`useCompanions`, `useStories`, `useActivities`, `useEvents`)
- Offline booking queue in AppContext
- Package.json `seed` script

Changed

- `AppContext` no longer exposes `conversations` and `messages` arrays
- `AdminGuard` checks both Firestore role and custom claims
- `authUser.claims` populated from ID token on auth state change
- `BookingFlowModal` uses real payment service for Khalti/eSewa initiation

Fixed

- Booking ID generation in `BookingFlowModal`
- AppContext duplicate code cleaned up

## v0.3.0 - 2026-07-11

Added

- Google Maps service (`src/services/maps.ts`)
- `MapPreview` component (`src/components/maps/MapPreview.tsx`)
- Map preview in `BookingFlowModal` and `CompanionProfileModal`
- `useActivities` and `useEvents` hooks
- Activity and event seed data in `src/scripts/seed.ts`
- Activities and events rendered from Firestore with hardcoded fallback
- Payment service stubs (`src/services/payments.ts`)
- Notification service stubs (`src/services/notifications.ts`)
- `BookingFlowModal` booking ID bugfix (`bk-${Date.now()}`)
- `CompanionProfileModal` hourly rate fixed to NPR
- Package.json `seed` script

Changed

- `Activity` and `Event` types extended with coordinates, descriptions, participants
- `Companion` type extended with optional `coordinates`

Fixed

- `BookingFlowModal` malformed booking ID generation

## v0.2.0 - 2026-07-11

Added

- Firebase app initialization (`src/firebase.ts`)
- Firebase Auth service (`src/services/auth.ts`)
- Firestore service layer (`src/services/firestore.ts`)
- Real-time companions/stories hooks (`src/hooks/useFirestoreData.ts`)
- AuthGuard, AdminGuard, LoadingScreen components
- React Router with protected routes (`src/App.tsx`, `src/main.tsx`)
- Firestore seed script (`src/scripts/seed.ts`)
- `.env.example` updated with Firebase config vars

Changed

- AuthModal wired to real Firebase Auth (email/password + guide application)
- AppContext uses `onAuthStateChanged` and persists bookings/notifications to Firestore
- Currency unified to NPR across cards, activities, bookings, dashboard, and booking flow
- Removed duplicate `BookingModal.tsx`

Fixed

- None

## v0.1.0 - 2026-07-11

Added

- Project audit completed
- Documentation structure created (docs/)
- SUMMARY.md audit report

Changed

- Initial codebase inventory recorded

Fixed

- None
