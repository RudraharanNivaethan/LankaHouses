# Component Reference

A plain-English guide to every reusable component in the frontend. No code — just what each component does, what props it accepts, and when to use it.

---

## Folder structure

```
src/components/
├── layout/     Page-level shells and structural containers
├── ui/         Generic, app-agnostic building blocks
├── auth/       Authentication-specific components
└── home/       Home page section compositions
```

---

## Layout components

### `AuthLayout`

**Location:** `components/layout/AuthLayout.tsx`

The full-page shell used exclusively by the three standalone auth pages (Login, Signup, Forgot Password). It splits the viewport into two panels:

- **Left panel** (desktop only, hidden on mobile) — a dark image background with a gradient overlay, the app logo, and a customisable content area for taglines, stats, or feature lists.
- **Right panel** — a scrollable white area containing the mobile logo bar, the form content slot, and a small copyright line at the bottom.

| Prop | Type | Purpose |
|---|---|---|
| `panelImage` | `string` | URL of the background image shown in the left panel |
| `panelContent` | `ReactNode` | Custom content rendered at the bottom of the left panel (tagline, stats, etc.) |
| `children` | `ReactNode` | The form or content rendered in the right panel |

Use this only for full-screen auth pages. For regular pages use the main `Navbar` + `Footer` layout that the router already applies.

---

### `FormLayout`

**Location:** `components/layout/FormLayout.tsx`

The universal form template. Any form in the app — auth, profile, contact, inquiry, admin — uses this as its structural container. It renders a complete form: heading, banner slot, field children, a submit button, and an optional footer navigation link.

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `onSubmit` | `FormEventHandler` | required | Form submission handler |
| `title` | `string` | required | The form heading |
| `subtitle` | `string` | — | A supporting sentence below the heading |
| `level` | `1 \| 2` | `1` | Heading level: `1` renders a large `h1` for page-level forms, `2` renders a smaller `h2` for section-level forms inside a page |
| `submitLabel` | `string` | required | Button text in the idle state |
| `submitLoadingLabel` | `string` | required | Button text shown while submitting |
| `isLoading` | `boolean` | required | Controls the loading state of the submit button |
| `submitSize` | `'md' \| 'lg'` | `'lg'` | Size of the submit button |
| `submitClassName` | `string` | `'w-full justify-center'` | Tailwind classes for the submit button |
| `footerText` | `string` | — | Plain text before the footer link (e.g. "Already have an account?") |
| `footerLinkTo` | `string` | — | Route the footer link navigates to |
| `footerLinkLabel` | `string` | — | Clickable label of the footer link |
| `alerts` | `ReactNode` | — | Slot for banners (AlertBanner, SuccessBanner, or both). Rendered between the heading and the field children |
| `children` | `ReactNode` | required | The form fields |

The footer link only renders when all three footer props (`footerText`, `footerLinkTo`, `footerLinkLabel`) are provided.

---

### `SectionContainer`

**Location:** `components/layout/SectionContainer.tsx`

The standard `max-width` + horizontal padding wrapper used inside every content section. Ensures all sections share the same maximum width and responsive padding without repeating the classes manually.

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `children` | `ReactNode` | required | Section content |
| `className` | `string` | `''` | Extra Tailwind classes (e.g. `'text-center'` for centred sections) |

Use this as the first wrapper inside any `<section>` element (or inside `ImageSection`'s children slot). Never write `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` as a raw `div` in a section file.

---

### `ImageSection`

**Location:** `components/layout/ImageSection.tsx`

A `<section>` element with a full-bleed background image and a colour or gradient overlay div. The pattern used by `HeroSection` and `CtaSection` is identical — this component eliminates the duplication.

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `src` | `string` | required | Background image URL |
| `alt` | `string` | `''` | Alt text. An empty string marks the image as decorative (`aria-hidden`) |
| `overlay` | `string` | required | Tailwind class(es) for the overlay `div` (e.g. `'bg-brand-dark/90'` or `'bg-gradient-to-br from-slate-900/85 ...'`) |
| `className` | `string` | `''` | Additional classes on the `<section>` element (e.g. `'py-24'` for vertical padding) |
| `extras` | `ReactNode` | — | Optional content rendered as a direct child of the `<section>`, outside the main `z-10` content wrapper. Use for elements that need to be absolutely positioned relative to the section (e.g. a scroll-down indicator pinned to the bottom) |
| `children` | `ReactNode` | required | Main content, rendered inside a `relative z-10` wrapper above the image and overlay |

---

### `Navbar`

**Location:** `components/layout/Navbar.tsx`

The sticky top navigation bar rendered on every non-auth page. It contains:

- App logo (links to home)
- Desktop navigation links (Browse, About, Contact)
- Desktop CTA area — shows Sign In + Register buttons when unauthenticated, or a clickable avatar/name + Logout button when authenticated
- Responsive hamburger menu that expands into a full-width mobile drawer

The Navbar reads authentication state from `AuthContext` automatically. No props required. The avatar block links to the profile page and the logout button calls `useLogout`.

---

### `Footer`

**Location:** `components/layout/Footer.tsx`

The dark full-width footer rendered on every non-auth page. It contains four columns (brand, quick links, property types, contact info) arranged in a responsive grid, and a copyright bar at the bottom. No props required.

---

## UI components

These components know nothing about authentication or the app's specific domain. They can be used anywhere.

---

### `Button`

**Location:** `components/ui/Button.tsx`

A styled `<button>` element. Extends all native `ButtonHTMLAttributes` so it accepts `onClick`, `disabled`, `type`, etc. alongside its own props.

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `variant` | `'primary' \| 'outline' \| 'ghost'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Padding and text size |
| `className` | `string` | `''` | Additional Tailwind classes (merged last) |
| `children` | `ReactNode` | required | Button label or content |

All variants share the same focus ring, disabled state, and active-scale transition.

---

### `Input`

**Location:** `components/ui/Input.tsx`

A labelled form field that wraps a native `<input>`. Extends all `InputHTMLAttributes` so it works directly with `react-hook-form`'s `register` spread. For `type="password"` it automatically renders a show/hide toggle button.

| Prop | Type | Purpose |
|---|---|---|
| `label` | `string` | Visible label above the input (also used to generate the `id`) |
| `error` | `string` | Error message shown below the input in red (hides the hint) |
| `hint` | `string` | Helper text shown below the input in grey (only visible when there is no error) |

The `id` is auto-generated from the label text unless overridden via `id`.

---

### `Spinner`

**Location:** `components/ui/Spinner.tsx`

An animated SVG circle used to indicate loading. Intentionally minimal — it renders only the spinning icon with no text or wrapping element.

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `className` | `string` | `'h-4 w-4'` | Tailwind size and colour classes |

---

### `AlertBanner`

**Location:** `components/ui/AlertBanner.tsx`

A red error alert block with an icon. Renders `null` when `message` is falsy — call sites do not need to conditionally wrap it.

| Prop | Type | Purpose |
|---|---|---|
| `message` | `string \| null \| undefined` | Error text to display. Nothing renders when this is falsy |

Has `role="alert"` for screen-reader accessibility.

---

### `SuccessBanner`

**Location:** `components/ui/SuccessBanner.tsx`

A green success notification with a checkmark icon. Same null-when-falsy behaviour as `AlertBanner`.

| Prop | Type | Purpose |
|---|---|---|
| `message` | `string \| null \| undefined` | Success text to display. Nothing renders when this is falsy |

Has `role="status"` for screen-reader accessibility.

---

### `FormShell`

**Location:** `components/ui/FormShell.tsx`

The raw `<form>` element wrapper. Sets `noValidate` (disables browser validation in favour of Zod) and applies the standard `flex flex-col gap-5` spacing. Every form in the app uses this instead of a raw `<form>`.

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `onSubmit` | `FormEventHandler` | required | Submission handler |
| `className` | `string` | `''` | Extra Tailwind classes appended to the form |
| `children` | `ReactNode` | required | Form content |

---

### `FormHeader`

**Location:** `components/ui/FormHeader.tsx`

A heading + optional subtitle pair used at the top of a form. Supports two visual levels to cover both page-level and section-level usage without repeating the styling.

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `title` | `string` | required | The heading text |
| `subtitle` | `string` | — | Supporting sentence below the heading |
| `level` | `1 \| 2` | `1` | `1` = `h1` at `text-2xl` (auth pages), `2` = `h2` at `text-base` (sections inside a page) |

---

### `FormSubmitButton`

**Location:** `components/ui/FormSubmitButton.tsx`

A primary submit button that shows a `Spinner` + loading label while submitting, and switches back to the idle label when done. Always `type="submit"`.

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `isLoading` | `boolean` | required | Triggers the spinner and loading label |
| `label` | `string` | required | Button text in the idle state |
| `loadingLabel` | `string` | required | Button text shown while loading |
| `size` | `'md' \| 'lg'` | `'lg'` | Passed to `Button` |
| `className` | `string` | `'w-full justify-center'` | Passed to `Button` |

---

### `FormFooterLink`

**Location:** `components/ui/FormFooterLink.tsx`

A centred paragraph containing a plain text hint and a branded `Link`. Used at the bottom of forms to help users navigate between related pages (e.g. "Don't have an account? Create one").

| Prop | Type | Purpose |
|---|---|---|
| `text` | `string` | The plain-text prefix (e.g. "Don't have an account?") |
| `to` | `string` | The route the link navigates to |
| `label` | `string` | The clickable link text |

---

### `SectionHeader`

**Location:** `components/ui/SectionHeader.tsx`

The eyebrow label + `h2` + description paragraph pattern that tops every content section. Use this instead of writing the heading block inline.

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `title` | `string` | required | The section `h2` heading |
| `eyebrow` | `string` | — | Small uppercase label above the title (e.g. `"Why choose us"`) |
| `description` | `string` | — | Supporting paragraph below the title |
| `align` | `'left' \| 'center'` | `'center'` | Text alignment. Use `'left'` when the header sits beside another element (e.g. a button) |

---

### `StatItem`

**Location:** `components/ui/StatItem.tsx`

A single metric display — large bold value + small label below it. Designed for use in a row of stats on dark/image backgrounds.

| Prop | Type | Purpose |
|---|---|---|
| `value` | `string` | The metric (e.g. `"200+"`) |
| `label` | `string` | The description below the value (e.g. `"Properties Listed"`) |

---

### `FeatureCard`

**Location:** `components/ui/FeatureCard.tsx`

An icon-box + title + description card with a hover lift and icon colour transition. Used in feature grids like "Why Choose Us". The icon slot accepts any SVG element.

| Prop | Type | Purpose |
|---|---|---|
| `icon` | `ReactNode` | SVG icon element rendered inside the coloured icon box |
| `title` | `string` | Card heading |
| `description` | `string` | Supporting paragraph |

On hover, the card lifts slightly, the border tints to brand colour, and the icon box changes from brand-tinted to solid brand background with white icon.

---

### `Badge`

**Location:** `components/ui/Badge.tsx`

A pill/label tag used above headings on dark or image backgrounds. Two visual styles cover the two use cases in the current design.

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `children` | `ReactNode` | required | Badge text |
| `variant` | `'brand' \| 'ghost'` | `'brand'` | `brand` — brand-tinted background, brand-light text, pulsing dot. `ghost` — translucent white background, white/80 text, no dot |

Use `brand` above headings on the hero image. Use `ghost` above headings on the solid brand-dark CTA background.

---

### `PropertyCard`

**Location:** `components/ui/PropertyCard.tsx`

A card used to display a single property listing. Accepts a `Property` object (from `src/types/property.ts`) and renders the image, price, title, location, and stats (bedrooms, bathrooms, area). Includes a subtle hover lift-and-scale animation.

| Prop | Type | Purpose |
|---|---|---|
| `property` | `Property` | The property data object to display |

---

## Auth components

These components handle authentication-specific UI. They depend on auth hooks and are only appropriate inside auth flows.

---

### `GoogleSignInButton`

**Location:** `components/auth/GoogleSignInButton.tsx`

A white bordered button with the Google logo that triggers Google OAuth sign-in. Renders a spinner while the OAuth popup is in flight.

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `onClick` | `() => void` | required | Called when the button is pressed |
| `isLoading` | `boolean` | required | Shows a spinner in place of the Google logo |
| `disabled` | `boolean` | `false` | Disables the button (used when the email/password flow is also loading) |
| `loadingLabel` | `string` | `'Loading…'` | Text shown while loading |

---

### `OAuthDivider`

**Location:** `components/auth/OAuthDivider.tsx`

A horizontal rule with centred label text, used to visually separate the OAuth button from the email/password fields.

| Prop | Type | Purpose |
|---|---|---|
| `label` | `string` | The text rendered between the two rule lines (e.g. "or sign in with email") |

---

### `BaseAuthForm`

**Location:** `components/auth/BaseAuthForm.tsx`

A thin auth-specific wrapper around `FormLayout`. It adds only one thing: an `error` prop that it passes to `AlertBanner` via `FormLayout`'s `alerts` slot. All other props are forwarded directly to `FormLayout`.

Use this for any form that needs to display a single server-side error banner. For forms that also need a success banner (like the profile form) use `FormLayout` directly and pass both banners in the `alerts` slot.

| Prop | Type | Purpose |
|---|---|---|
| `error` | `string \| null \| undefined` | Server error message. Displayed as an `AlertBanner` |
| All `FormLayout` props | — | Forwarded unchanged to `FormLayout` |

---

### `LoginForm`

**Location:** `components/auth/LoginForm.tsx`

The email + password login form. Uses `BaseAuthForm` as its container. Internally calls `useLogin` for form state and validation, and `useGoogleLogin` for OAuth. Renders `GoogleSignInButton`, `OAuthDivider`, and two `Input` fields (email, password) plus the forgot password link.

No props.

---

### `RegisterForm`

**Location:** `components/auth/RegisterForm.tsx`

The account creation form. Uses `BaseAuthForm` as its container. Internally calls `useRegister` and `useGoogleLogin`. Renders `GoogleSignInButton`, `OAuthDivider`, and four `Input` fields (name, email, phone — optional, password).

No props.

---

### `ForgotPasswordForm`

**Location:** `components/auth/ForgotPasswordForm.tsx`

The password reset form. Uses `BaseAuthForm` as its container. On successful submission it switches to a static confirmation screen (no reload or redirect). Internally calls `useForgotPassword`.

No props.

---

### `ProfileForm`

**Location:** `components/auth/ProfileForm.tsx`

The user profile editor. Uses `FormLayout` directly (not `BaseAuthForm`) because it needs both an `AlertBanner` (for server errors) and a `SuccessBanner` (for save confirmation) passed together in the `alerts` slot. Renders the avatar header, read-only account info panel, and an editable sub-form with name and phone fields.

No props. Reads the current user from `AuthContext` and renders `null` if no user is authenticated.

---

## Home section components

These are page-specific compositions that build the Home page from generic UI and layout components. They live in `components/home/` rather than `pages/` because sections are reusable compositions — a section like `FeaturedProperties` could appear on a Listings page or a landing page without modification.

---

### `HeroSection`

**Location:** `components/home/HeroSection.tsx`

The full-viewport hero banner. Uses `ImageSection` for the background image + gradient overlay, `SectionContainer` for content padding, `Badge` for the pill label, `StatItem` for the three metrics row, and `Button` for the CTA pair.

The scroll-down indicator is absolutely positioned at the bottom of the section via `ImageSection`'s `extras` slot.

No props. Data (image URL, stats, copy) is defined as constants inside the file.

---

### `FeaturedProperties`

**Location:** `components/home/FeaturedProperties.tsx`

A white section displaying a grid of `PropertyCard` components. Uses `SectionContainer`, `SectionHeader` (left-aligned to sit beside the "View All Listings" button), `Button`, and `PropertyCard`.

No props. Pulls data from `src/constants/mockProperties.ts`.

---

### `WhyUsSection`

**Location:** `components/home/WhyUsSection.tsx`

A light-grey section displaying a 4-column feature grid. Uses `SectionContainer`, `SectionHeader` (centred), and `FeatureCard`.

No props. The `PILLARS` data array (icon, title, description for each card) is defined as a constant inside the file — the SVG icons are section-specific and not abstracted further.

---

### `CtaSection`

**Location:** `components/home/CtaSection.tsx`

A full-bleed call-to-action banner with a brand-dark overlay. Uses `ImageSection` for the background, `SectionContainer` for content padding, `Badge` (ghost variant) for the pill label, and `Button` for the two CTA buttons.

No props. Data (image URL, copy) is defined as constants inside the file.
