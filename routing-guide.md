# Frontend Routing Guide

Everything a developer needs to know about how pages are reached, protected, and rendered in this project.

---

## Table of contents

1. [Technology and library](#technology-and-library)
2. [File map](#file-map)
3. [Route constants](#route-constants)
4. [Router architecture — the two-tier layout](#router-architecture--the-two-tier-layout)
5. [Route guards](#route-guards)
6. [How to add a new public page](#how-to-add-a-new-public-page)
7. [How to add a new protected page](#how-to-add-a-new-protected-page)
8. [How to add a new auth page (full-screen, no Navbar)](#how-to-add-a-new-auth-page-full-screen-no-navbar)
9. [Navigation — linking between pages](#navigation--linking-between-pages)
10. [Programmatic navigation](#programmatic-navigation)
11. [The 404 catch-all](#the-404-catch-all)
12. [Loading states while auth is resolving](#loading-states-while-auth-is-resolving)
13. [Common mistakes and how to avoid them](#common-mistakes-and-how-to-avoid-them)
14. [Quick-reference cheat sheet](#quick-reference-cheat-sheet)

---

## Technology and library

Routing is handled entirely by **React Router v6** (`react-router-dom`). Key concepts to understand before reading further:

| Concept | What it means |
|---|---|
| `<BrowserRouter>` | The top-level wrapper that enables client-side routing using the browser's History API |
| `<Routes>` | A container that renders the first `<Route>` whose `path` matches the current URL |
| `<Route>` | Declares a URL pattern and the component to render when that pattern matches |
| `<Navigate>` | Immediately redirects the user to a different path when rendered |
| `<Link>` | A clickable element that navigates to a route without a full page reload |
| `useNavigate()` | A hook that returns a function for programmatic navigation (e.g. after form submission) |
| `useParams()` | A hook that returns dynamic URL parameters (e.g. `/listings/:id` → `{ id: '42' }`) |
| `useSearchParams()` | A hook for reading and writing query string parameters (e.g. `?page=2&sort=price`) |
| `useLocation()` | A hook that returns the current location object (pathname, search, hash, state) |

---

## File map

```
src/
├── constants/
│   └── routes.ts           All route path strings (single source of truth)
├── router/
│   └── index.tsx            BrowserRouter, Routes, route guards, layouts, 404
├── context/
│   └── AuthContext.tsx       Provides isAuthenticated / isLoading to route guards
└── pages/
    ├── Home/HomePage.tsx
    ├── Auth/LoginPage.tsx
    ├── Auth/SignupPage.tsx
    ├── Auth/ForgotPasswordPage.tsx
    └── Profile/ProfilePage.tsx
```

---

## Route constants

Every route path in the app is defined once in `src/constants/routes.ts`:

```ts
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  PROFILE: '/profile',
  LISTINGS: '/listings',
  ABOUT: '/about',
  CONTACT: '/contact',
  INQUIRY: '/inquiry',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
```

**Rules:**

- Never hardcode a path string like `'/login'` anywhere in the codebase. Always import and use `ROUTES.LOGIN`.
- When you add a new page, add its path here first.
- The `as const` assertion and `AppRoute` type let TypeScript catch typos at compile time when you reference a route.

---

## Router architecture — the two-tier layout

The router uses a two-level structure. Understanding this is the single most important concept in this file.

```
BrowserRouter
└── AuthProvider                    ← wraps everything so auth state is available
    └── Routes (outer)
        ├── /login       → RedirectIfAuthenticated → LoginPage
        ├── /signup      → RedirectIfAuthenticated → SignupPage
        ├── /forgot-password → RedirectIfAuthenticated → ForgotPasswordPage
        └── *            → MainLayout
                            ├── Navbar
                            ├── <main>
                            │   └── Routes (inner)
                            │       ├── /           → HomePage
                            │       ├── /profile    → ProtectedRoute → ProfilePage
                            │       └── *           → NotFound (404)
                            └── Footer
```

### Why two levels of `<Routes>`?

**Outer Routes** — handles pages that need their own full-screen layout (auth pages use `AuthLayout` with no Navbar or Footer).

**Inner Routes (inside MainLayout)** — handles every other page. `MainLayout` wraps them all in `Navbar` + `<main>` + `Footer` so you never have to import those in each page.

The `path="*"` on the outer `<Route>` that renders `MainLayout` is the key — it acts as a catch-all that delegates to the inner Routes for any path that isn't an auth page.

---

## Route guards

Route guards are wrapper components that check authentication state before rendering their children.

### `RedirectIfAuthenticated`

Wraps auth pages (login, signup, forgot password). If the user is already logged in, they are redirected to the home page instead of seeing the auth form again.

**Behaviour:**
- `isLoading` is `true` → renders nothing (prevents flash of auth form)
- `isAuthenticated` is `true` → `<Navigate to={ROUTES.HOME} replace />`
- Otherwise → renders children normally

**When to use:** wrap any page that should only be visible to unauthenticated users.

### `ProtectedRoute`

Wraps pages that require authentication. If the user is not logged in, they are redirected to the login page.

**Behaviour:**
- `isLoading` is `true` → renders nothing (prevents flash of protected content)
- `isAuthenticated` is `false` → `<Navigate to={ROUTES.LOGIN} replace />`
- Otherwise → renders children normally

**When to use:** wrap any page that requires a logged-in user (profile, dashboard, settings, etc.).

### How `isLoading` prevents flicker

When the app first loads, `AuthProvider` makes an API call (`getMe`) to check if the user has a valid session cookie. Until that call resolves, `isLoading` is `true`. Both guards return `null` during this time, so:

- A logged-in user visiting `/login` won't briefly see the login form before being redirected.
- A logged-out user visiting `/profile` won't briefly see the profile page before being redirected.

---

## How to add a new public page

A page anyone can access, with Navbar and Footer (e.g. an About page).

### 1. Add the route constant (if not already present)

```ts
// constants/routes.ts
export const ROUTES = {
  // ...existing routes
  ABOUT: '/about',
} as const
```

### 2. Create the page component

```
src/pages/About/AboutPage.tsx
```

The page file imports section components and renders them. See `page-building-guide.md` for detailed instructions.

### 3. Register the route inside `MainLayout`

Open `src/router/index.tsx` and add a `<Route>` inside the inner `<Routes>` block within `MainLayout`:

```tsx
// Inside MainLayout's <Routes>
<Route path={ROUTES.ABOUT} element={<AboutPage />} />
```

Add the import at the top:

```tsx
import { AboutPage } from '../pages/About/AboutPage'
```

**Place the new route above the catch-all `<Route path="*">`** — React Router matches top-to-bottom, and the `*` wildcard matches everything. Routes below it would never be reached.

---

## How to add a new protected page

A page only logged-in users can see (e.g. a Dashboard).

Follow the same steps as a public page, but wrap the element in `<ProtectedRoute>`:

```tsx
<Route
  path={ROUTES.DASHBOARD}
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

If the user is not authenticated, they will be redirected to `/login` automatically.

---

## How to add a new auth page (full-screen, no Navbar)

A standalone auth page like a password-change confirmation or email verification page.

### 1. Add the route constant

```ts
VERIFY_EMAIL: '/verify-email',
```

### 2. Create the page component

Use `AuthLayout` as the page shell (see `component-reference.md` for props).

### 3. Register the route in the outer `<Routes>`

This is the critical difference — auth pages go in the **outer** Routes, not inside `MainLayout`:

```tsx
// Inside AppRouter's outer <Routes>, ABOVE the path="*" catch-all
<Route
  path={ROUTES.VERIFY_EMAIL}
  element={
    <RedirectIfAuthenticated>
      <VerifyEmailPage />
    </RedirectIfAuthenticated>
  }
/>
```

This keeps the page full-screen with no Navbar or Footer.

---

## Navigation — linking between pages

### Declarative links with `<Link>`

Use React Router's `<Link>` component for all in-app navigation. Never use raw `<a href="...">` for internal routes — that causes a full page reload.

```tsx
import { Link } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

<Link to={ROUTES.ABOUT}>About Us</Link>
```

### Styled links

`<Link>` renders a plain `<a>` tag. Add Tailwind classes directly:

```tsx
<Link
  to={ROUTES.LOGIN}
  className="font-semibold text-brand hover:text-brand-dark transition-colors"
>
  Sign in
</Link>
```

### Links with the `Button` component

The project's `Button` component renders a `<button>` element, not a link. If you need a button that navigates, wrap it in a `<Link>`:

```tsx
<Link to={ROUTES.LISTINGS}>
  <Button variant="primary" size="lg">Browse Properties</Button>
</Link>
```

Or use programmatic navigation (next section) if the navigation should happen after some logic.

---

## Programmatic navigation

Use the `useNavigate` hook when navigation needs to happen in response to code execution (after a form submit, after an API call, etc.):

```tsx
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

function SomeComponent() {
  const navigate = useNavigate()

  async function handleSubmit() {
    await saveData()
    navigate(ROUTES.HOME)              // navigate forward
    // navigate(ROUTES.HOME, { replace: true })  // replace current history entry
    // navigate(-1)                     // go back one step
  }
}
```

**`replace: true`** — use this when the user should not be able to press the browser back button to return to the current page (e.g. after login, you replace `/login` in history so pressing back doesn't return to the login form).

The existing login and register hooks already use `navigate(ROUTES.HOME, { replace: true })` after successful authentication for this reason.

---

## The 404 catch-all

The `<Route path="*" element={<NotFound />} />` inside `MainLayout` catches any URL that doesn't match a defined route. It renders a simple 404 page with a link back to home.

Because this route is inside `MainLayout`, the 404 page still has the Navbar and Footer — the user isn't stranded on a blank screen.

**Important:** Always place new routes **above** the `path="*"` catch-all. Routes are matched top-to-bottom.

---

## Loading states while auth is resolving

`AuthContext` starts with `isLoading: true` and resolves to `false` after the initial `getMe()` call completes. During this period:

- Both `RedirectIfAuthenticated` and `ProtectedRoute` render `null`.
- The user sees nothing (a blank screen) for the brief moment the session check takes.

If the loading period becomes perceptible (slow network, cold start), consider adding a global loading spinner inside the guards:

```tsx
if (isLoading) return <FullPageSpinner />
```

This is not implemented yet but is the recommended approach if needed.

---

## Common mistakes and how to avoid them

### 1. Hardcoding path strings

**Wrong:**
```tsx
navigate('/login')
<Link to="/profile">Profile</Link>
```

**Right:**
```tsx
navigate(ROUTES.LOGIN)
<Link to={ROUTES.PROFILE}>Profile</Link>
```

A single change in `routes.ts` updates the path everywhere. Hardcoded strings silently break when paths change.

---

### 2. Putting a new page route below the `path="*"` catch-all

```tsx
// WRONG — AboutPage will NEVER render because * matches first
<Route path="*" element={<NotFound />} />
<Route path={ROUTES.ABOUT} element={<AboutPage />} />
```

Always place specific routes above the wildcard.

---

### 3. Putting a Navbar/Footer page in the outer Routes

```tsx
// WRONG — this renders AboutPage without Navbar/Footer
<Route path={ROUTES.ABOUT} element={<AboutPage />} />
<Route path="*" element={<MainLayout />} />
```

Regular pages go inside `MainLayout`'s inner `<Routes>`. Only full-screen auth pages go in the outer Routes.

---

### 4. Using `<a href>` instead of `<Link to>`

```tsx
// WRONG — causes a full browser reload, destroys React state
<a href="/about">About</a>

// RIGHT — client-side navigation, preserves state
<Link to={ROUTES.ABOUT}>About</Link>
```

---

### 5. Forgetting to wrap a protected page in `<ProtectedRoute>`

If you forget the guard, unauthenticated users can reach the page. The page may crash or show empty data because `useAuth().user` is `null`.

---

### 6. Importing page components at the top level (bundle size)

Currently all pages are eagerly imported. When the app grows, consider lazy loading:

```tsx
import { lazy, Suspense } from 'react'

const AboutPage = lazy(() => import('../pages/About/AboutPage').then(m => ({ default: m.AboutPage })))

// In the route definition:
<Route
  path={ROUTES.ABOUT}
  element={
    <Suspense fallback={<FullPageSpinner />}>
      <AboutPage />
    </Suspense>
  }
/>
```

This is not required yet but is the standard approach for larger apps.

---

## Quick-reference cheat sheet

| I want to… | Do this |
|---|---|
| Add a public page (with Navbar/Footer) | Add constant → create page → add `<Route>` inside `MainLayout`'s `<Routes>` |
| Add a protected page | Same as public but wrap element in `<ProtectedRoute>` |
| Add a full-screen auth page (no Navbar) | Add constant → create page → add `<Route>` in outer `<Routes>` with `<RedirectIfAuthenticated>` |
| Link to another page in JSX | `<Link to={ROUTES.FOO}>…</Link>` |
| Navigate after an action in code | `const navigate = useNavigate()` → `navigate(ROUTES.FOO)` |
| Navigate and prevent going back | `navigate(ROUTES.FOO, { replace: true })` |
| Go back one page | `navigate(-1)` |
| Read a URL parameter like `/listings/:id` | `const { id } = useParams()` |
| Read a query string like `?page=2` | `const [searchParams] = useSearchParams()` → `searchParams.get('page')` |
| Redirect logged-in users away from a page | Wrap in `<RedirectIfAuthenticated>` |
| Redirect logged-out users away from a page | Wrap in `<ProtectedRoute>` |
| Handle unknown URLs | Already handled — the `path="*"` catch-all renders `NotFound` |

---

## Current route table

| Path | Page | Guard | Layout |
|---|---|---|---|
| `/` | `HomePage` | None (public) | MainLayout (Navbar + Footer) |
| `/login` | `LoginPage` | `RedirectIfAuthenticated` | Full-screen (AuthLayout) |
| `/signup` | `SignupPage` | `RedirectIfAuthenticated` | Full-screen (AuthLayout) |
| `/forgot-password` | `ForgotPasswordPage` | `RedirectIfAuthenticated` | Full-screen (AuthLayout) |
| `/profile` | `ProfilePage` | `ProtectedRoute` | MainLayout (Navbar + Footer) |
| Any other path | `NotFound` | None | MainLayout (Navbar + Footer) |

Routes defined in `constants/routes.ts` but not yet wired to pages: `/listings`, `/about`, `/contact`, `/inquiry`.
