# Routing Quick Reference

A one-page cheat sheet for adding pages and navigating. For detailed explanations see `routing-guide.md`.

---

## Key files

| File | Purpose |
|---|---|
| `src/constants/routes.ts` | All route path strings — add yours here first |
| `src/router/index.tsx` | Route registration, guards, layouts |
| `src/pages/<Page>/<Page>Page.tsx` | Your page component |

---

## Adding a page in 3 steps

### 1. Add the path constant

```ts
// constants/routes.ts
export const ROUTES = {
  // ...
  ABOUT: '/about',   // ← add this
} as const
```

### 2. Create the page component

```
src/pages/About/AboutPage.tsx
```

### 3. Register the route

Open `src/router/index.tsx` and add the route **above** the `path="*"` catch-all.

**Public page** (Navbar + Footer) — add inside `MainLayout`'s `<Routes>`:

```tsx
<Route path={ROUTES.ABOUT} element={<AboutPage />} />
```

**Protected page** (login required) — same place, wrap in guard:

```tsx
<Route path={ROUTES.ABOUT} element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
```

**Full-screen auth page** (no Navbar) — add in the **outer** `<Routes>`:

```tsx
<Route path={ROUTES.VERIFY} element={<RedirectIfAuthenticated><VerifyPage /></RedirectIfAuthenticated>} />
```

---

## Linking between pages

```tsx
import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

// In JSX
<Link to={ROUTES.ABOUT}>About</Link>
```

Never use `<a href="...">` for internal routes — it causes a full page reload.

---

## Navigating after an action (e.g. form submit)

```tsx
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

const navigate = useNavigate()

navigate(ROUTES.HOME)                       // go to a page
navigate(ROUTES.HOME, { replace: true })    // go to a page, prevent back button
navigate(-1)                                // go back
```

---

## Three rules to remember

1. **Never hardcode paths** — always use `ROUTES.XXX` from `constants/routes.ts`.
2. **Route order matters** — place new routes above the `path="*"` wildcard or they'll never match.
3. **Pick the right tier** — regular pages go inside `MainLayout`; full-screen auth pages go in the outer `<Routes>`.

---

## Current routes

| Path | Guard | Layout |
|---|---|---|
| `/` | Public | Navbar + Footer |
| `/login` | `RedirectIfAuthenticated` | Full-screen |
| `/signup` | `RedirectIfAuthenticated` | Full-screen |
| `/forgot-password` | `RedirectIfAuthenticated` | Full-screen |
| `/profile` | `ProtectedRoute` | Navbar + Footer |
