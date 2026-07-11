# Architecture

## Folder Structure

```
src/
├── main.tsx                 # Entry point, providers setup
├── App.tsx                  # Hash-based router (admin vs client)
├── ClientApp.tsx            # Main client app shell and routing
├── context/
│   └── AppContext.tsx        # Global state: user, bookings, messages, favorites
├── types.ts                 # TypeScript interfaces
├── data.ts                  # Hardcoded mock data (COMPANIONS, STORIES)
├── index.css                # Tailwind imports and custom utilities
├── index.html               # Vite HTML shell
├── components/
│   ├── ui/
│   │   └── Toast.tsx         # Toast notification system
│   ├── Navbar.tsx            # Top navigation bar
│   ├── AuthModal.tsx         # Login/Signup/Guide application modal
│   ├── BookingModal.tsx      # Duplicate/older booking modal (to be removed)
│   ├── SafetyWidget.tsx      # SOS / safety features widget
│   ├── modals/
│   │   ├── CompanionProfileModal.tsx  # Full profile overlay
│   │   └── BookingFlowModal.tsx       # Multi-step booking wizard
│   ├── messages/
│   │   └── MessagesTab.tsx   # Chat UI
│   └── dashboard/
│       └── DashboardTab.tsx  # User dashboard
├── admin/
│   ├── AdminApp.tsx          # Admin shell layout
│   ├── AdminOverview.tsx     # Metrics and charts
│   ├── AdminGuides.tsx       # KYC verification queue
│   ├── AdminBookings.tsx     # Booking management
│   ├── AdminSecurity.tsx     # SOS alerts and suspicious activity
│   └── AdminFeedback.tsx     # User feedback and system notifications
├── assets/
│   └── ...                   # Static assets
└── (unused directories may exist)

docs/
├── SUMMARY.md
├── PROJECT_STATUS.md
├── AI_MEMORY.md
├── TASKS.md
├── CHANGELOG.md
├── ARCHITECTURE.md
├── DATABASE_SCHEMA.md
├── API.md
├── SECURITY.md
├── DECISIONS.md
├── BUGS.md
├── FEATURES.md
├── TESTING.md
├── DEPLOYMENT.md
├── MEETING_NOTES.md
└── CONTRIBUTING.md
```

## Component Hierarchy

```
main.tsx
  App.tsx
    ├── AppProvider (Context)
    ├── ToastProvider (Context)
    └── App
       ├── ClientApp
       │    ├── Navbar
       │    ├── AuthModal
       │    ├── CompanionProfileModal
       │    │    └── BookingFlowModal
       │    ├── MessagesTab
       │    ├── DashboardTab
       │    ├── SafetyWidget
       │    └── [Story View, Community Moments, Events, etc.]
       └── AdminApp
            ├── AdminOverview
            ├── AdminGuides
            ├── AdminBookings
            ├── AdminSecurity
            └── AdminFeedback
```

## Authentication Flow

Current: Mock only
1. User clicks Login / Sign Up / Join as Guide
2. AuthModal opens
3. On submit, a local User object is created and stored in AppContext
4. No Firebase, no token, no server verification

Target:
1. Firebase Auth email/password or Google Sign-In
2. Firestore `users` collection for profile data
3. Custom claims for role-based access (customer, companion, admin)
4. Persistent auth state via Firebase SDK

## Booking Flow

Current:
1. CompanionProfileModal asks user to log in (mocked)
2. BookingFlowModal opens (date, time, duration, location, participants, requests)
3. Price summary shows service fee (10%)
4. Payment method selection (eSewa / Khalti) - UI only
5. Confirmation screen
6. Booking saved to local AppContext state only

Target:
1. Check companion availability via Firestore
2. Create booking document in `bookings` collection
3. Calculate platform commission server-side via Cloud Function
4. Initiate Khalti/eSewa payment SDK
5. Webhook verification updates booking status
6. Push notification to companion and user via FCM

## Messaging Architecture

Current:
1. MessagesTab renders conversations from AppContext
2. Mock conversations pre-seeded if none exist
3. sendMessage appends to local state
4. No persistence, no real-time, no read receipts

Target:
1. Firestore `messages` and `conversations` collections
2. Realtime listeners for instant updates
3. Typing indicators via presence
4. Message status (sent, delivered, read)
5. Media uploads via Firebase Storage
6. FCM for background notifications

## Admin Architecture

Current:
1. Hash change (`#admin`) toggles AdminApp
2. No auth check
3. Static mock data for all admin panels

Target:
1. Role-protected route using Firebase custom claims
2. Firestore-backed real data
3. Audit logging
4. Fraud detection rules via Cloud Functions

## Partner Ecosystem

Planned:
1. `partners` collection in Firestore
2. Dashboards for hotel, restaurant, cafe, adventure partners
3. Referral tracking and commission reports
4. Offer/promotion management
