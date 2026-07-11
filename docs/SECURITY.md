# Security

## Current State

- No real authentication
- Hash-based admin access (`#admin`) with no verification
- No input validation beyond React default escaping
- No rate limiting
- No secrets management beyond `.env.example`
- No CSP headers
- No CSRF tokens (no backend)

## Planned Security Standards

### Authentication & Authorization

- Firebase Authentication (email/password, Google, phone)
- Custom claims for roles: customer, companion, admin
- Firebase Security Rules for all Firestore collections
- Client-side route guards for protected pages
- Session persistence via Firebase SDK

### Firestore Security Rules (Planned)

- Users can read/write their own profile
- Companions are readable by all, writable by owner/admin
- Bookings readable by participants and admin, writable by system
- Messages readable by participants only
- Admin endpoints require custom claim `admin: true`

### Input Validation

- Zod or equivalent for runtime validation on all forms
- Sanitize all text before rendering rich content
- Validate file uploads (size, type) before Firebase Storage upload

### Secrets Management

- All keys in environment variables, never committed
- Firebase config in separate file ignored by git
- Server-side secrets only in Cloud Functions
- Regular secret rotation for production

### Rate Limiting

- Firestore query limits via security rules
- Client-side debouncing on search inputs
- Cloud Functions rate limiting via Firebase App Check

### Payment Security

- Server-side verification of all Khalti/eSewa webhooks
- Never trust client-side payment status
- Use HTTPS only in production
- PCI compliance via payment gateway SDKs (no card data touches server)

### Trust & Safety

- Government ID verification (KYC) stored in Firebase Storage
- Selfie verification via Firebase ML or manual review
- SOS button triggers real-time location share + FCM alert
- Emergency contacts stored in user document
- User blocking via `blockedUsers` array in user doc
- Report workflow to create `reports` collection for admin review
