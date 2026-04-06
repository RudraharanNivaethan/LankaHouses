# Page Building Guide

A concise, practical walkthrough for building a new page in this project from scratch — following the established architecture of reusable UI components, domain section components, and clean page files.

The Home page is used as the concrete reference throughout.

---

## Architecture overview

```
src/
├── components/
│   ├── ui/          Generic, reusable building blocks (Button, SectionHeader, FeatureCard, …)
│   ├── layout/      Structural shells and wrappers (SectionContainer, ImageSection, FormLayout, …)
│   └── <domain>/    Page-specific section compositions (home/, auth/, …)
├── pages/
│   └── <PageName>/
│       └── <PageName>.tsx   Thin page file — imports and arranges section components only
├── router/
│   └── index.tsx    Route definitions
└── constants/
    └── routes.ts    Route path constants
```

**Rule of thumb:** the page file should contain no JSX beyond a fragment wrapping its section components. All visual logic lives in the section components, and all structural/styling primitives live in `ui/` and `layout/`.

---

## Step 1 — Identify what generic UI components you need

Before writing a single line of JSX, look at the design and map each pattern to an existing component:

| Pattern in the design | Component to reach for |
|---|---|
| Max-width + horizontal padding wrapper | `SectionContainer` |
| Background image + colour overlay section | `ImageSection` |
| Eyebrow + h2 + description heading block | `SectionHeader` |
| Pill label above a heading on a dark/image background | `Badge` |
| Large metric value + small label | `StatItem` |
| Icon-box + title + description hover card | `FeatureCard` |
| CTA or action button | `Button` |
| Property listing card | `PropertyCard` |

If a pattern does not match anything in `components/ui/` or `components/layout/`, create a new generic component there first (Step 2). If it is specific to one section only, keep it inline in the section component.

---

## Step 2 — Create any missing generic UI components

Add new files to `components/ui/` (for domain-agnostic atoms) or `components/layout/` (for structural wrappers). Follow these conventions:

- Accept only the data/configuration the component needs — no page-specific logic.
- Export a single named function component.
- Keep Tailwind classes inside the component; call sites pass only prop values, not classes (unless a `className` escape-hatch prop is offered).

**Example** — if you needed a `TestimonialCard` that does not exist yet:

```tsx
// components/ui/TestimonialCard.tsx
interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  avatarSrc: string
}

export function TestimonialCard({ quote, author, role, avatarSrc }: TestimonialCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-slate-600 italic">"{quote}"</p>
      <div className="mt-4 flex items-center gap-3">
        <img src={avatarSrc} alt={author} className="h-10 w-10 rounded-full object-cover" />
        <div>
          <p className="text-sm font-semibold text-slate-900">{author}</p>
          <p className="text-xs text-slate-500">{role}</p>
        </div>
      </div>
    </div>
  )
}
```

Document the new component in `docs/component-reference.md` under the appropriate section.

---

## Step 3 — Create the section components in `components/<domain>/`

Each distinct visual section of the page becomes its own component file inside a domain folder. For the Home page that folder is `components/home/`. For an "About" page it might be `components/about/`.

**Structure of a section component:**

1. Local data constants at the top (copy, image URLs, arrays of items).
2. The function component using `SectionContainer` as the first wrapper inside any `<section>` element.
3. Generic UI components composed inside — no repeated Tailwind structural patterns.

**Example** — a Testimonials section:

```tsx
// components/about/TestimonialsSection.tsx
import { SectionHeader } from '../ui/SectionHeader'
import { TestimonialCard } from '../ui/TestimonialCard'
import { SectionContainer } from '../layout/SectionContainer'

const TESTIMONIALS = [
  { quote: '…', author: 'Amara P.', role: 'Buyer', avatarSrc: '/avatars/amara.jpg' },
  { quote: '…', author: 'Rajan S.', role: 'Seller', avatarSrc: '/avatars/rajan.jpg' },
]

export function TestimonialsSection() {
  return (
    <section className="bg-slate-50 py-20">
      <SectionContainer>
        <div className="mb-12">
          <SectionHeader
            eyebrow="What clients say"
            title="Trusted by buyers and sellers"
            description="Real experiences from people who found their home with LankaHouses."
          />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.author} {...t} />
          ))}
        </div>
      </SectionContainer>
    </section>
  )
}
```

---

## Step 4 — Create the page file

The page file lives at `pages/<PageName>/<PageName>.tsx`. It imports the section components and returns them in order inside a fragment. Nothing else.

```tsx
// pages/About/AboutPage.tsx
import { HeroSection }        from '../../components/about/HeroSection'
import { TestimonialsSection } from '../../components/about/TestimonialsSection'
import { CtaSection }          from '../../components/home/CtaSection'   // reuse from home if appropriate

export function AboutPage() {
  return (
    <>
      <HeroSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  )
}
```

If the page requires data fetching or URL parameters, the page file is the right place to handle that — pass the data down as props to the section components.

---

## Step 5 — Add the route constant

Add the new path to `src/constants/routes.ts`:

```ts
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  PROFILE: '/profile',
  ABOUT: '/about',           // ← new
} as const
```

---

## Step 6 — Register the route

Open `src/router/index.tsx` and add the route inside the appropriate layout wrapper.

Most content pages sit inside `MainLayout` (which applies `Navbar` + `Footer` automatically):

```tsx
// Inside the MainLayout children in router/index.tsx
import { AboutPage } from '../pages/About/AboutPage'

// ...
<Route path={ROUTES.ABOUT} element={<AboutPage />} />
```

If the page should only be accessible when authenticated, wrap it in `<ProtectedRoute>`:

```tsx
<Route
  path={ROUTES.ABOUT}
  element={
    <ProtectedRoute>
      <AboutPage />
    </ProtectedRoute>
  }
/>
```

---

## Checklist

- [ ] Mapped every design pattern to an existing `ui/` or `layout/` component
- [ ] Created any missing generic components in `components/ui/` or `components/layout/`
- [ ] Created one section component per visual section in `components/<domain>/`
- [ ] Each section uses `SectionContainer` — no raw `mx-auto max-w-7xl …` divs
- [ ] Each section with an eyebrow + heading uses `SectionHeader`
- [ ] Background-image sections use `ImageSection`
- [ ] Page file contains only imports and a fragment — no inline JSX
- [ ] Route constant added to `constants/routes.ts`
- [ ] Route registered in `router/index.tsx` with the correct layout and guards
- [ ] New generic components documented in `docs/component-reference.md`

---

## What belongs where — quick reference

| File | Contains |
|---|---|
| `components/ui/Foo.tsx` | A generic, domain-agnostic UI atom (badge, card, stat, header, button, …) |
| `components/layout/Foo.tsx` | A structural wrapper or shell (container, image section, form layout, auth layout) |
| `components/<domain>/FooSection.tsx` | A page-specific composition of generic components |
| `pages/<Page>/<Page>Page.tsx` | Imports section components, handles routing data, renders nothing inline |
| `constants/routes.ts` | All route path strings |
| `router/index.tsx` | Route registration and layout/guard wrappers |
| `constants/mock<Entity>.ts` | Placeholder data for sections that will eventually be API-driven |
