# Testing

## Strategy

- Testing framework: Vitest + React Testing Library
- E2E framework: Playwright or Cypress (TBD)
- Component tests: React Testing Library
- Integration tests: Supertest against local API (future)
- Coverage target: 80% for new code

## Current State

- No tests exist
- No testing configuration

## Planned Test Plan

### Unit Tests
- Utility functions
- Context providers (AppContext, ToastContext)
- Helper functions in `data.ts` or future `services/`

### Component Tests
- Navbar (search, dropdown, mobile menu)
- AuthModal (form validation, state changes)
- CompanionProfileModal (favorite toggle, book/message handlers)
- BookingFlowModal (multi-step validation, price calculation)
- MessagesTab (send message, conversation selection)
- DashboardTab (stats rendering, favorites list)
- Admin tabs (data rendering, action handlers)

### Integration Tests
- Full booking flow (profile -> schedule -> payment -> confirmation)
- Search and filter behavior
- Auth state changes affecting UI
- Tab navigation and state

### Critical Flow Tests
- End-to-end booking creation
- Message send and receive
- Admin approval of guide
- SOS activation and cancellation

### Regression Tests
- Post-stabilization run on every PR
- Visual regression via Playwright screenshots (optional)

## Manual Test Checklist

- [ ] Verify npm install and build succeed
- [ ] Verify all tabs navigation works
- [ ] Verify search filters companions
- [ ] Verify booking modal opens and proceeds through steps
- [ ] Verify auth modal creates local user
- [ ] Verify messages tab opens and sends message
- [ ] Verify SOS widget appears and toggles
- [ ] Verify admin view loads via #admin
- [ ] Verify responsive behavior on mobile widths
- [ ] Verify theme toggle works
