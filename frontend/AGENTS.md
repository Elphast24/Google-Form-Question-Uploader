# AGENTS.md

## Commands

### Type Checking
```bash
npx tsc --noEmit
```

### Linting
```bash
npx eslint . --max-warnings 0 --ext .ts,.tsx
```

### Development Server
```bash
npx vite
```
Dev server runs at `http://localhost:5173` (or next available port).

### Build
```bash
npx vite build
```

## Project Structure
- `src/` — Application source code
- `src/components/` — React components (UploadBox, Loader, Navbar, Footer, QuestionItem)
- `src/components/shared/` — Shared UI (Button, Spinner, ErrorBanner, IconButton)
- `src/pages/` — Page components (Home, Preview, Generated, MyForms, AuthCallback)
- `src/context/` — React context (AuthContext)
- `src/services/` — API services (api.ts, firebase.ts)
- `src/hooks/` — Custom React hooks (useGSAPAnimation, useFormState)
- `src/styles/` — CSS files (global.css)
- `src/types/` — TypeScript type definitions (form.ts, api.ts)

## Aliases
- `@/*` → `src/*`

## Conventions
- Use TypeScript with strict mode
- Use GSAP with ScrollTrigger for scroll-based animations
- Use animejs for micro-interactions
- Respect `prefers-reduced-motion` via `useGSAPAnimation` hook
- Prefix unused variables with `_` (e.g., `_setFile`)
