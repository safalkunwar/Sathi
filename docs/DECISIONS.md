# Decisions

## Decision 1: Keep Vite + React, Do Not Migrate to Next.js

- Date: 2026-07-11
- Reason: Current codebase uses Vite + React. Master prompt mentions Next.js, but migration is not approved. Existing code is functional and changing stack would destroy work without measurable benefit.
- Alternatives Considered: Next.js migration, Remix
- Impact: Continued Vite development; future migration only if explicitly requested

## Decision 2: Use Firebase as Backend, Not Supabase

- Date: 2026-07-11
- Reason: Master prompt explicitly specifies Firebase stack. Supabase is an alternative but not approved.
- Alternatives Considered: Supabase, custom Node/Express backend
- Impact: All backend services will be built on Firebase Auth, Firestore, Storage, Cloud Functions, FCM

## Decision 3: Replace Hardcoded Data with Firestore Before Adding New Features

- Date: 2026-07-11
- Reason: Hardcoded COMPANIONS and STORIES arrays prevent real-time updates, search scaling, and multi-user data consistency.
- Alternatives Considered: Keep mocks for MVP speed
- Impact: All features depend on real data layer; migration required before payment, messaging, or booking can be real

## Decision 4: Remove Duplicate Booking Modal

- Date: 2026-07-11
- Reason: `BookingModal.tsx` and `BookingFlowModal.tsx` overlap and create confusion. BookingFlowModal is the more complete multi-step wizard.
- Alternatives Considered: Keep both and differentiate
- Impact: Cleaner component tree; BookingModal.tsx should be removed

## Decision 5: Fix Currency Inconsistency (NPR)

- Date: 2026-07-11
- Reason: Companion cards show `$` but booking flow shows `NPR`. Nepal market requires NPR consistency.
- Alternatives Considered: Keep dual currency for international expansion
- Impact: All pricing displays will use NPR until internationalization is explicitly requested

## Decision 6: Implement React Router Over Hash Changes

- Date: 2026-07-11
- Reason: `App.tsx` uses `window.location.hash` for admin toggle. This is fragile and unscalable.
- Alternatives Considered: Keep hash-based routing
- Impact: Proper client-side routing with protected routes for admin and auth-required pages

## Decision 7: Do Not Build Flutter Mobile Until Web Is Stable

- Date: 2026-07-11
- Reason: Master prompt mentions Flutter mobile, but web platform is incomplete. Splitting focus reduces quality.
- Alternatives Considered: Parallel web + mobile development
- Impact: Mobile will follow after web MVP stability
