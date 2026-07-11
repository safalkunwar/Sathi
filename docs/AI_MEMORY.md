# AI Memory

Last Updated: 2026-07-11

## Business Vision

SATHI is a trusted Social Experiences Marketplace in Nepal. Mission: help people safely build genuine human connections through verified companions, communities, activities, and local experiences.

## Core Principles

- Trust and safety are highest priority
- Every feature should either work correctly or clearly indicate backend integration is pending
- No fake production logic, no hardcoded production data
- Never destroy existing work; preserve valid code
- Audit before coding; understand file purpose, dependencies, and business logic first
- Do not migrate stack without explicit approval (current: React + Vite + TypeScript + Tailwind CSS v4)

## Technology Stack (Actual)

- Frontend: React 19, TypeScript, Vite 6, Tailwind CSS v4
- State: React Context (AppContext, ToastContext)
- Animation: motion (Framer Motion)
- Icons: lucide-react
- Routing: React Router DOM v7 (BrowserRouter)
- Backend: Firebase Auth, Firestore, Storage, Cloud Functions (in progress)
- Auth: Firebase Auth (email/password, Google) with custom claims
- Database: Firestore (real-time subscriptions via service layer)
- Maps: Google Maps Static API via `MapPreview` component
- Offline: IndexedDB via `offlineStorage` service
- Payments: Khalti REST API + eSewa form redirect
- Notifications: Web Notifications + FCM foreground listener
- Testing: Vitest + React Testing Library + jsdom

## Coding Standards

- Use TypeScript strictly
- Follow existing dark theme with #C8A25E gold accent
- Components in `src/components/` with subdirectories for modals, messages, dashboard, ui, guards, maps, notifications
- Context providers wrap app in `App.tsx` via `AppProvider`, `ToastProvider`, `NotificationProvider`
- No inline SVG when lucide-react icon is available
- Consistent currency: NPR for Nepal market
- All new features must include loading, empty, and error states
- `src/firebase.ts` is the single source of truth for Firebase initialization
- Service layer in `src/services/` for external integrations
- Route guards in `src/components/guards/` for protected routes
- Hooks in `src/hooks/` for Firestore-backed data
- Tests in `src/__tests__/`

## Completed Work

- Phase 1 audit completed and documented in docs/
- Firebase service layer with Auth, Firestore, Maps, Payments, Notifications, Storage
- React Router with protected routes and loading screen
- Real-time messaging via Firestore with conversation sorting
- Admin custom claims enforcement
- Google Maps integration (MapPreview in companion profile and booking flow)
- Activities and events as Firestore-backed collections
- Payment service with Khalti REST API and eSewa form redirect
- FCM notifications with foreground listener and permission request
- Offline storage service using IndexedDB with cache-first strategy
- Currency fix ($ → NPR throughout app)
- Duplicate BookingModal removal
- Types extended: Companion coordinates, User claims, Event/Activity models
- Testing framework setup: Vitest + React Testing Library + jsdom
- Initial smoke test for conversation ID helper
- CI/CD pipeline: GitHub Actions workflow with typecheck, test, build
- Accessibility improvements: aria-labels, dialog roles, form label associations
- Performance optimization: React.memo on ClientApp, lazy loading images
- Partner dashboard component with stats and offers

## Current Priorities

1. Admin real data migration (replace mock data in admin panels)
2. Expand test coverage
3. WCAG AA full compliance
4. Performance optimization continued

## Rejected Ideas

- Migrating to Next.js: not approved; current stack is Vite
- Migrating to Supabase: not approved; use Firebase per master prompt
- Migrating to Flutter: do not start until web platform is stable

## Known Limitations

- Build/lint tools not available in this environment (missing node toolchain)
- Admin custom claims require Cloud Function deployment to set
- eSewa payment uses form redirect which may not work in modal contexts
- FCM foreground listener works; push notifications require Cloud Functions/Messaging
- No error boundaries
- Tests exist but need expansion
- Admin dashboards still use mock data (migration in progress)
- Internationalization not implemented
- Many UI buttons show "coming soon" toasts

## File Map (Current)

- `src/firebase.ts` - Firebase init
- `src/services/auth.ts` - Auth service with claims
- `src/services/firestore.ts` - Firestore service
- `src/services/maps.ts` - Maps constants and types
- `src/services/payments.ts` - Khalti/eSewa payment integration
- `src/services/notifications.ts` - FCM + Web Notifications
- `src/services/storage.ts` - IndexedDB offline cache
- `src/hooks/useFirestoreData.ts` - Real-time data hooks with offline cache
- `src/context/AppContext.tsx` - Auth + bookings + messages state with offline queue
- `src/components/AuthModal.tsx` - Real Firebase auth UI with accessibility
- `src/components/modals/BookingFlowModal.tsx` - Multi-step booking with payment integration and map preview
- `src/components/modals/CompanionProfileModal.tsx` - Profile overlay with map preview
- `src/components/messages/MessagesTab.tsx` - Real-time Firestore chat UI
- `src/components/dashboard/DashboardTab.tsx` - User dashboard
- `src/components/dashboard/PartnerDashboard.tsx` - Partner business dashboard
- `src/components/Navbar.tsx` - Navigation with accessibility attributes
- `src/components/guards/AuthGuard.tsx` - Route protection
- `src/components/guards/AdminGuard.tsx` - Admin route protection with custom claims
- `src/components/LoadingScreen.tsx` - Auth initialization screen
- `src/components/maps/MapPreview.tsx` - Google Maps static preview
- `src/components/notifications/NotificationProvider.tsx` - FCM registration and permission request
- `src/App.tsx` - React Router entry point with NotificationProvider
- `src/main.tsx` - React entry
- `src/admin/*.tsx` - Admin mock dashboards (pending real data migration)
- `src/scripts/seed.ts` - Firestore demo data seeder
- `src/__tests__/AppContext.test.ts` - Initial smoke test
- `vitest.config.ts` - Vitest configuration
- `.github/workflows/ci.yml` - CI/CD pipeline
- `docs/*.md` - Full project documentation
