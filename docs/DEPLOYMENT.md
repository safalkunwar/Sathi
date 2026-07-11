# Deployment

## Current State

- Frontend deployed on Vercel (rent-a-friend-phi.vercel.app)
- No CI/CD configured
- No environment variables configured for production
- No Firebase hosting or Cloud Run configured

## Planned Deployment

### Frontend

- Platform: Vercel (current) or Firebase Hosting
- Build command: `npm run build`
- Output: `dist/`
- Environment: Production Firebase config, API keys for Google Maps, Khalti, eSewa

### Backend

- Platform: Firebase (Auth, Firestore, Storage, FCM, Cloud Functions, Analytics, Crashlytics, Remote Config)
- Cloud Functions runtime: Node.js 20+
- Regions: asia-south1 (for Nepal/India latency)

### CI/CD

- GitHub Actions or equivalent
- Lint -> Type Check -> Test -> Build -> Deploy
- Preview deployments for PRs
- Production deployment on merge to main

### Monitoring

- Firebase Crashlytics for client crashes
- Firebase Analytics for user behavior
- Cloud Functions logs in Cloud Logging
- Error reporting via Sentry (optional)

### Domains

- Primary: sathi.com.np (TBD)
- Admin: admin.sathi.com.np (TBD)
