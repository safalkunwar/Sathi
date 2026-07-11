# Contributing

## Development Setup

1. Clone repository
2. Run `npm install`
3. Copy `.env.example` to `.env` and fill values
4. Run `npm run dev` for development server
5. Run `npm run lint` for TypeScript check
6. Run `npm run build` for production build

## Git Workflow

- Never commit directly to `main`
- Use feature branches: `feature/auth`, `feature/chat`, `feature/booking`, etc.
- Merge only after testing
- Commit messages must be concise and descriptive

## Coding Standards

- Use TypeScript
- Follow existing component patterns
- Use lucide-react for icons
- Keep components small and focused
- Include loading, empty, and error states
- Do not leave console.logs in production

## Documentation

- Update relevant docs/ files when changing behavior
- Update CHANGELOG.md with every implementation
- Update PROJECT_STATUS.md with progress
- Update FEATURES.md with new feature status
- Update DECISIONS.md when making architectural changes

## Definition of Done

- Builds successfully
- Passes linting and type checking
- No console errors
- Responsive
- Works with Firebase (or clearly indicates pending integration)
- Does not break existing functionality
- Documented
