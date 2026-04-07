# Component Composition Guide

How to combine existing components to build new pages and features without repeating code. Each section shows a scenario, which components to use, and how they fit together.

---

## Core principle

The component hierarchy has three levels. Always build downward — never skip a level.

```
Layout components      — page shells (AuthLayout, Navbar + Footer, FormLayout)
  └── UI components    — generic building blocks (Button, Input, Spinner, banners, form primitives)
        └── Auth / domain components — specific compositions (LoginForm, ProfileForm, etc.)
```

---

## Scenario 1 — A new standalone full-page auth form

**Example:** An invitation acceptance page, a two-factor verification page.

**Use:** `AuthLayout` as the page shell. Pass a background image and left-panel content as props. Render your form component as `children`.

**Minimum components involved:**
- `AuthLayout` — the two-panel page shell
- `FormLayout` — the form template inside the right panel
- `Input` — the form fields
- `AlertBanner` — server error display (passed via `alerts` prop)
- `FormSubmitButton` — implicitly rendered by `FormLayout`

**Pattern:**

The new page component supplies `panelImage` and `panelContent` to `AuthLayout`. The new form component uses `FormLayout` (or `BaseAuthForm` if only one error banner is needed) and passes its fields as `children`.

```
NewPage
└── AuthLayout (panelImage, panelContent)
    └── NewForm
        └── BaseAuthForm (title, subtitle, submitLabel, error, footerLinkTo, ...)
            ├── [field children: Input, Input, ...]
            └── (FormLayout handles header, banner, submit button, footer link)
```

---

## Scenario 2 — A form embedded inside a regular page

**Example:** A contact form on the Contact page, a property inquiry form on a listing detail page, an admin settings form.

**Use:** The page is wrapped in the standard `Navbar` + `Footer` layout (the router handles this automatically). Inside the page, use `FormLayout` directly for the form section.

**Minimum components involved:**
- `FormLayout` — form template (`level={2}` if it is a section inside a page that already has an `h1`)
- `Input` — form fields
- `AlertBanner` and/or `SuccessBanner` — passed via the `alerts` prop

**Pattern:**

```
ContactPage (standard layout — Navbar + Footer applied by router)
└── FormLayout (level=2, title="Send a message", alerts=<AlertBanner ...>)
    ├── Input (name)
    ├── Input (email)
    └── Input (message)
```

The `alerts` slot accepts any ReactNode, so you can pass a single banner, both banners wrapped in a fragment, or nothing at all:

```
// Error only
alerts={<AlertBanner message={error} />}

// Success only
alerts={<SuccessBanner message={isSuccess ? 'Sent!' : null} />}

// Both (the banner renders null internally when its message is falsy)
alerts={<><AlertBanner message={error} /><SuccessBanner message={successMsg} /></>}
```

---

## Scenario 3 — A new auth-specific form (email + Google sign-in options)

**Example:** A team invitation accept form that also allows Google sign-in.

**Use:** `BaseAuthForm` as the container. Add `GoogleSignInButton` and `OAuthDivider` as the first children, followed by the email/password fields.

**Minimum components involved:**
- `BaseAuthForm` — wraps `FormLayout` and handles the error banner automatically
- `GoogleSignInButton` — OAuth button (wire to `useGoogleLogin`)
- `OAuthDivider` — the separator between OAuth and email
- `Input` — email/password fields

**Pattern:**

```
NewAuthForm
└── BaseAuthForm (title, error, submitLabel, footerLinkTo, ...)
    ├── GoogleSignInButton (onClick, isLoading)
    ├── OAuthDivider (label)
    ├── Input (email)
    └── Input (password)
```

---

## Scenario 4 — A property listing card grid

**Example:** A search results page, a featured properties section.

**Use:** `PropertyCard` inside a responsive CSS grid. No wrapper component is needed — just map over the data array.

**Minimum components involved:**
- `PropertyCard` — one card per listing
- A grid `div` with Tailwind responsive grid classes

**Pattern:**

```
ListingsPage
└── <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    └── PropertyCard × N (one per property in the list)
```

---

## Scenario 5 — A loading submit button anywhere

**Example:** Any button that triggers an async action and should show a spinner.

**Use:** `FormSubmitButton` if it is a form submit, or `Button` + `Spinner` side by side if it is a non-form action (e.g. a delete confirmation button).

**For form submit:**
```
FormSubmitButton (isLoading, label, loadingLabel)
```

**For non-form async button:**
```
Button (variant, disabled={isLoading})
└── Spinner (when isLoading)
└── label text (when not loading)
```

---

## Scenario 6 — A dismissable error or success notification

**Use:** `AlertBanner` for errors, `SuccessBanner` for success. Both render `null` automatically when their `message` prop is falsy — no `{condition && <Banner />}` wrapper is needed.

Place them directly above the relevant content, or pass them into a `FormLayout`'s `alerts` slot when they are associated with a form.

```
// Standalone (outside a form)
<AlertBanner message={fetchError} />
<SuccessBanner message={saveSuccess ? 'Changes saved.' : null} />

// Inside a form (pass both to FormLayout's alerts slot)
<FormLayout alerts={<><AlertBanner message={err} /><SuccessBanner message={ok ? '...' : null} /></>}>
  ...
</FormLayout>
```

---

## Scenario 7 — A content page made up of sections

**Example:** A home page, an "About" page, a "Browse listings" page.

**Use:** Each visual section of the page is its own component in `components/home/` (or a domain-appropriate subfolder). Each section uses `SectionContainer` for consistent padding, `SectionHeader` for the eyebrow + heading + description block, and whatever generic UI components its content needs.

**Minimum components involved:**
- `SectionContainer` — max-width + padding wrapper inside every section
- `SectionHeader` — eyebrow + h2 + description (for sections with a heading)
- `ImageSection` — background image + overlay (for hero or CTA sections)
- `Badge` — pill label above headings on dark backgrounds
- `StatItem` — individual metric in a stats row
- `FeatureCard` — icon + title + description card in feature grids
- `Button` — CTAs
- `PropertyCard` — property listing cards

**Pattern:**

```
HomePage (pages/Home/HomePage.tsx)
├── HeroSection     (components/home/HeroSection.tsx)
│   └── ImageSection + SectionContainer + Badge + StatItem × 3 + Button × 2
├── FeaturedProperties (components/home/FeaturedProperties.tsx)
│   └── SectionContainer + SectionHeader + PropertyCard × N + Button
├── WhyUsSection    (components/home/WhyUsSection.tsx)
│   └── SectionContainer + SectionHeader + FeatureCard × 4
└── CtaSection      (components/home/CtaSection.tsx)
    └── ImageSection + SectionContainer + Badge + Button × 2
```

The page file (`HomePage.tsx`) imports and composes its section components. It contains no JSX of its own beyond the fragment wrapper.

---

## Scenario 8 — A page with a split layout (image + form)

**Use:** `AuthLayout` even outside of strict authentication if the UX calls for a branded two-panel view (e.g. a marketing landing page with a lead capture form on the right).

Provide a `panelContent` with whatever copy or stats are appropriate for that page. The right-panel `children` can be any component, not just a form.

---

## Decision tree — which component do I start with?

```
Do I need a full-page layout?
├── Yes, it is a standalone auth page → AuthLayout
└── Yes, it is a regular app page → rely on router (Navbar + Footer auto-applied)

Is the page built from visual sections (hero, features, CTA, etc.)?
├── Each section → its own component in components/<domain>/
├── Section needs max-width + padding → SectionContainer (inside every section)
├── Section has a heading block → SectionHeader
├── Section has a background image + overlay → ImageSection
├── Section has stats → StatItem row
├── Section has a feature grid → FeatureCard × N
└── Section has a pill label above a heading → Badge

Do I need a form?
├── The form IS the main content of a standalone auth page
│   └── BaseAuthForm (if error banner only)
│       OR FormLayout with alerts slot (if error + success banners needed)
├── The form is a section inside a regular page
│   └── FormLayout with level={2}
└── The form needs a Google sign-in option
    └── BaseAuthForm + GoogleSignInButton + OAuthDivider as children

Do I need to show feedback?
├── Error → AlertBanner
├── Success → SuccessBanner
└── Loading state on a button → FormSubmitButton OR Button + Spinner

Do I need to render a property?
└── PropertyCard
```

---

## What to never repeat

These are already handled by components — never write them inline:

| Pattern | Component to use instead |
|---|---|
| `<form noValidate className="flex flex-col gap-5">` | `FormShell` |
| Title + subtitle heading at the top of a form | `FormHeader` |
| Submit button with spinner + loading text | `FormSubmitButton` |
| "Already have an account? Sign in" paragraph | `FormFooterLink` |
| Red error alert with icon | `AlertBanner` |
| Green success alert with icon | `SuccessBanner` |
| Animated SVG spinner | `Spinner` |
| Google OAuth button with logo | `GoogleSignInButton` |
| "— or — " horizontal rule | `OAuthDivider` |
| Complete form shell (heading + alerts + fields + submit + footer link) | `FormLayout` |
| `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` div inside a section | `SectionContainer` |
| `<section>` with absolute background image + overlay div | `ImageSection` |
| Eyebrow + `h2` + description paragraph at top of a section | `SectionHeader` |
| Large bold value + small label metric | `StatItem` |
| Icon-box + title + description hover card | `FeatureCard` |
| Pill label tag above a heading on a dark background | `Badge` |
