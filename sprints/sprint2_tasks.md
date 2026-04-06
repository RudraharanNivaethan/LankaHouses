# Sprint 2 — Admin Panel & Property Management

---

## Pages to build

| Page | Route | Description |
|---|---|---|
| Admin Dashboard | `/admin/dashboard` | Stats overview with cards linking to admin sub-pages |
| Manage Houses | `/admin/houses` | Table of all properties (active, sold, removed) with status badges and actions |
| Add House | `/admin/houses/new` | Multi-field form with image upload to create a new listing |
| Edit House | `/admin/houses/:id/edit` | Pre-filled version of the Add House form for an existing listing |
| View Inquiries | `/admin/inquiries` | Filterable table of all inquiries with status tabs and counts |
| Inquiry Detail | `/admin/inquiries/:id` | Full inquiry view with admin reply form |

All admin pages are protected by the `AdminRoute` guard (already built in Sprint 1). Non-admin users see a 404 page — the routes are not discoverable.

---

## Build order and prerequisites

```
Phase 1 — Infrastructure (no pages yet)
  INFRA-05  Cloudinary + Multer setup
  PROP-01-B Property model + validation schemas

Phase 2 — Property CRUD (backend first, then frontend)
  PROP-01-B ──► PROP-01-F Add House page
  PROP-02-B ──► PROP-02-F Edit House page (reuses Add House form)
  PROP-03-B ──► PROP-03-F Image management (builds on Add/Edit House)
  PROP-04-B ──► PROP-04-F Status management (builds on house list)
  PROP-05-B ──► PROP-05-F Manage Houses page (needs PROP-04 for status badges)
  PROP-06-B   Soft-delete endpoint (no dedicated frontend — uses existing status dropdown)

Phase 3 — Dashboard & Inquiries (needs property data to be meaningful)
  DASH-01-B ──► DASH-01-F Admin Dashboard page
  INQ-01-B  ──► INQ-01-F  View Inquiries page (needs DASH for sidebar link)
  INQ-01-F  ──► INQ-02-F  Inquiry Detail page
  DASH-02-B ──► DASH-02-F Notification badge (needs inquiry endpoints)
```

**Key dependencies:**
- Add House must be built before Edit House (Edit reuses the same form component).
- Image management (PROP-03) builds on the Add/Edit House form.
- Manage Houses page (PROP-05) needs status management (PROP-04) for status badges and dropdown.
- Dashboard (DASH-01) needs property and inquiry API endpoints to display stats.
- Inquiry Detail (INQ-02) requires the View Inquiries page (INQ-01) to navigate from.
- Notification badge (DASH-02) requires the inquiry count endpoint from INQ-01-B.

---

## Existing infrastructure from Sprint 1

These are already built and available for Sprint 2 to use:

- **`AdminRoute` guard** — `frontend/src/router/index.tsx` — renders 404 for non-admins
- **`authenticate` + `authorize('admin')` middleware** — `backend/middleware/authMiddleware.js` — protects backend endpoints
- **Admin JWT secrets** — separate signing keys for admin access/refresh tokens
- **Admin seeder** — `backend/seeds/adminSeed.js` — creates the dev admin account in Firebase + MongoDB
- **Blank `AdminDashboardPage`** — `frontend/src/pages/Admin/AdminDashboardPage.tsx` — placeholder to be replaced
- **`ADMIN_DASHBOARD` route constant** — `frontend/src/constants/routes.ts`
- **Reusable UI components** — `SectionHeader`, `SectionContainer`, `Badge`, `FeatureCard`, `StatItem`, `Button`, `Input`, `FormLayout`, `AlertBanner`, `SuccessBanner`, `Spinner`

---

## Phase 1 — Infrastructure

### INFRA-05: Cloudinary + Multer image upload setup

**Assignee:** Backend

**What to build:**
1. Create `backend/config/cloudinary.js` — initialize the Cloudinary SDK using `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` from `.env`
2. Create `backend/middleware/uploadMiddleware.js` — configure Multer with `memoryStorage()` (files stay in memory as buffers, not written to disk)
3. Create `backend/utils/imageUpload.js` — helper function that takes a file buffer, uploads it to Cloudinary (folder: `lankahouses/properties`), and returns `{ url, public_id }`
4. Add a helper to delete an image from Cloudinary by `public_id`
5. Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` to `.env.example`

**Acceptance criteria:**
- Multer accepts up to 10 image files per request, max 5 MB each
- Images are uploaded to Cloudinary and a CDN URL + `public_id` are returned
- Images can be deleted from Cloudinary by `public_id`
- No files are written to the server filesystem

---

## Phase 2 — Property CRUD

### PROP-01-B: Property model, validation, and create endpoint

**Assignee:** Backend

**What to build:**
1. Create `backend/models/Property.js` — Mongoose schema with fields: `title`, `description`, `price`, `location` (district, city, address), `propertyType` (house, apartment, land, villa, commercial), `bedrooms`, `bathrooms`, `area` (sq ft), `images` (array of `{ url, public_id }`), `status` (enum: active, sold, removed — default: active), `features` (array of strings), `createdBy` (ref to User)
2. Create `backend/validation/schemas/propertySchema.js` — Zod schema for property creation with all required field validation
3. Create `backend/controllers/propertyController.js` — `createProperty` handler that processes uploaded images via `imageUpload.js` and saves the document
4. Create `backend/routes/adminPropertyRoutes.js` — `POST /api/admin/properties` protected by `authenticate` + `authorize('admin')` + upload middleware
5. Register the route in `backend/app.js`

**Acceptance criteria:**
- `POST /api/admin/properties` accepts multipart form data with fields and up to 10 images
- All required fields are validated; invalid requests return structured error messages
- Images are uploaded to Cloudinary; CDN URLs and public_ids are stored in the document
- New listings default to `status: 'active'`
- Only admin users can access the endpoint (401 for unauthenticated, 403 for non-admin)

---

### PROP-01-F: Add House page

**Assignee:** Frontend

**Prerequisite:** PROP-01-B

**Page:** `/admin/houses/new`

**What to build:**
1. Create `frontend/src/schemas/property.ts` — Zod schema mirroring the backend property validation
2. Create `frontend/src/types/property.ts` — TypeScript types for Property, PropertyFormData (update the existing `types/property.ts` if it exists, or create it)
3. Create `frontend/src/services/adminPropertyService.ts` — `createProperty(formData: FormData)` function that POSTs multipart data to `/api/admin/properties`
4. Create `frontend/src/hooks/useCreateProperty.ts` — custom hook managing form state, image file selection, upload progress, submission, and error handling
5. Create `frontend/src/components/admin/PropertyForm.tsx` — the form component with all fields (title, description, price, location fields, property type dropdown, bedrooms, bathrooms, area, features, image upload zone). Use existing `Input`, `Button`, `FormLayout`, `AlertBanner` components
6. Create `frontend/src/pages/Admin/AddHousePage.tsx` — page wrapper rendering `PropertyForm` in create mode
7. Add `ADMIN_ADD_HOUSE: '/admin/houses/new'` to `routes.ts`
8. Register the route in the router inside `AdminRoute`

**Acceptance criteria:**
- Form validates all required fields before submission
- Multiple images can be selected and previewed before upload
- On submit, images and fields are sent as `multipart/form-data`
- Success redirects to the Manage Houses page
- Errors display in an `AlertBanner`

---

### PROP-02-B: Get single property and update endpoint

**Assignee:** Backend

**Prerequisite:** PROP-01-B

**What to build:**
1. Add `getPropertyById` to `propertyController.js` — returns the full property document
2. Add `updateProperty` to `propertyController.js` — validates incoming fields, updates the document, returns the updated property
3. Add routes: `GET /api/admin/properties/:id` and `PUT /api/admin/properties/:id` to `adminPropertyRoutes.js`, both protected by `authenticate` + `authorize('admin')`
4. Create `backend/validation/schemas/propertyUpdateSchema.js` — Zod schema for partial property updates (all fields optional, at least one required)

**Acceptance criteria:**
- `GET /api/admin/properties/:id` returns the full property document including images
- `PUT /api/admin/properties/:id` accepts partial updates; only provided fields are changed
- Invalid property IDs return 404
- Only admin users can access both endpoints

---

### PROP-02-F: Edit House page

**Assignee:** Frontend

**Prerequisites:** PROP-01-F, PROP-02-B

**Page:** `/admin/houses/:id/edit`

**What to build:**
1. Add `getProperty(id)` and `updateProperty(id, formData)` to `adminPropertyService.ts`
2. Create `frontend/src/hooks/useEditProperty.ts` — fetches the existing property on mount, pre-fills the form, handles submission as a PUT request
3. Reuse `PropertyForm.tsx` in edit mode — accept an optional `initialData` prop to pre-fill all fields and display existing images
4. Create `frontend/src/pages/Admin/EditHousePage.tsx` — reads `:id` from URL params, fetches property data, renders `PropertyForm` with `initialData`
5. Add `ADMIN_EDIT_HOUSE: '/admin/houses/:id/edit'` to `routes.ts`
6. Register the route in the router inside `AdminRoute`

**Acceptance criteria:**
- All fields are pre-filled with the existing property data on page load
- Changes are saved on submit; success shows a toast or success banner and redirects to Manage Houses
- Existing images are displayed and can be kept or removed
- New images can be added alongside existing ones

---

### PROP-03-B: Individual image add/remove endpoints

**Assignee:** Backend

**Prerequisite:** PROP-01-B

**What to build:**
1. Add `addImages` to `propertyController.js` — accepts new image files, uploads to Cloudinary, appends to the property's `images` array
2. Add `removeImage` to `propertyController.js` — accepts a `public_id`, deletes from Cloudinary, removes from the property's `images` array
3. Add routes: `POST /api/admin/properties/:id/images` and `DELETE /api/admin/properties/:id/images/:publicId` to `adminPropertyRoutes.js`

**Acceptance criteria:**
- New images can be added to an existing property without re-submitting the entire form
- Individual images can be deleted by `public_id`; the image is removed from both Cloudinary and the database
- The updated images array is returned in the response

---

### PROP-03-F: Image management in property form

**Assignee:** Frontend

**Prerequisites:** PROP-02-F, PROP-03-B

**What to build:**
1. Add `addImages(propertyId, files)` and `removeImage(propertyId, publicId)` to `adminPropertyService.ts`
2. Update `PropertyForm.tsx` to support inline image management in edit mode: a delete button on each existing image thumbnail, and an "Add more images" button that uploads immediately without re-submitting the form
3. Show upload progress per image

**Acceptance criteria:**
- Each existing image has a visible delete button; clicking it removes the image from Cloudinary and updates the display immediately
- New images can be uploaded individually without a full form re-submit
- The total image count (existing + new) is enforced client-side

---

### PROP-04-B: Property status update endpoint

**Assignee:** Backend

**Prerequisite:** PROP-01-B

**What to build:**
1. Add `updatePropertyStatus` to `propertyController.js` — accepts a `status` value (active, sold, removed), validates it, updates the document
2. Add route: `PATCH /api/admin/properties/:id/status` to `adminPropertyRoutes.js`
3. Create `backend/validation/schemas/propertyStatusSchema.js` — Zod schema accepting only valid status values

**Acceptance criteria:**
- Status can be changed to active, sold, or removed
- Invalid status values are rejected with a validation error
- The updated property is returned in the response

---

### PROP-04-F: Status dropdown on property list/edit

**Assignee:** Frontend

**Prerequisite:** PROP-04-B

**What to build:**
1. Add `updatePropertyStatus(id, status)` to `adminPropertyService.ts`
2. Create a `StatusDropdown` component (or add inline to the house list row) that calls the status update endpoint
3. Visual feedback: status badge colour changes immediately on success

**Acceptance criteria:**
- Admin can change status from a dropdown on the house list or edit page
- Setting "sold" disables the public inquiry button (enforced by public API, not just frontend)
- Setting "removed" hides the listing from the public site
- Status badge colour updates immediately without page reload

---

### PROP-05-B: List all properties endpoint (admin) + public filtered endpoint

**Assignee:** Backend

**Prerequisite:** PROP-01-B

**What to build:**
1. Add `getAllPropertiesAdmin` to `propertyController.js` — returns ALL properties regardless of status, sorted by newest first, with pagination
2. Add `getActiveProperties` to `propertyController.js` — returns only `status: 'active'` properties for public consumption, with pagination
3. Add routes: `GET /api/admin/properties` (protected) and `GET /api/properties` (public)
4. Register the public route in `backend/app.js`

**Acceptance criteria:**
- Admin endpoint returns all properties with all statuses, supports `?page=1&limit=20` pagination
- Public endpoint returns only active properties, same pagination
- Both endpoints return total count for frontend pagination
- Admin endpoint is protected; public endpoint is open

---

### PROP-05-F: Manage Houses page

**Assignee:** Frontend

**Prerequisites:** PROP-04-F, PROP-05-B

**Page:** `/admin/houses`

**What to build:**
1. Add `getAllProperties(params)` to `adminPropertyService.ts`
2. Create `frontend/src/hooks/useAdminProperties.ts` — fetches the admin property list with pagination and optional status filter
3. Create `frontend/src/components/admin/PropertyTable.tsx` — table displaying property title, location, price, status badge, image count, and action buttons (Edit, Change Status)
4. Create `frontend/src/pages/Admin/ManageHousesPage.tsx` — page wrapper with the table, an "Add New Property" button linking to Add House, and pagination controls
5. Add `ADMIN_HOUSES: '/admin/houses'` to `routes.ts`
6. Register the route in the router inside `AdminRoute`

**Acceptance criteria:**
- Table lists all properties with colour-coded status badges (green = active, yellow = sold, red = removed)
- Each row has Edit and Status Change actions
- "Add New Property" button navigates to `/admin/houses/new`
- Pagination works; page state is reflected in the URL (`?page=2`)
- Empty state shown when no properties exist

---

### PROP-06-B: Soft-delete endpoint

**Assignee:** Backend

**Prerequisite:** PROP-04-B

**What to build:**
1. Add `deleteProperty` to `propertyController.js` — sets `status: 'removed'` instead of deleting the document
2. Add route: `DELETE /api/admin/properties/:id` to `adminPropertyRoutes.js`

**Acceptance criteria:**
- `DELETE` request changes status to "removed" — no document is destroyed
- The property is hidden from the public endpoint but still visible in the admin list
- Returns the updated property with `status: 'removed'`

---

## Phase 3 — Dashboard & Inquiries

### DASH-01-B: Dashboard stats endpoint

**Assignee:** Backend

**What to build:**
1. Add `getDashboardStats` to a new `backend/controllers/dashboardController.js` — returns: total active listings, total inquiries, pending inquiries count
2. Add route: `GET /api/admin/dashboard/stats` protected by `authenticate` + `authorize('admin')`
3. Create `backend/routes/adminDashboardRoutes.js` and register in `app.js`

**Acceptance criteria:**
- Returns `{ activeListings: number, totalInquiries: number, pendingInquiries: number }`
- Only admin users can access the endpoint

---

### DASH-01-F: Admin Dashboard page

**Assignee:** Frontend

**Prerequisites:** DASH-01-B, existing blank `AdminDashboardPage`

**Page:** `/admin/dashboard` (update existing `/admin` to `/admin/dashboard`)

**What to build:**
1. Create `frontend/src/services/adminDashboardService.ts` — `getStats()` function
2. Create `frontend/src/hooks/useDashboardStats.ts` — fetches stats on mount
3. Create `frontend/src/components/admin/StatCard.tsx` — a clickable stat card (value, label, icon, link)
4. Create `frontend/src/components/admin/AdminSidebar.tsx` — sidebar navigation for all admin pages (Dashboard, Houses, Inquiries)
5. Create `frontend/src/components/layout/AdminLayout.tsx` — layout shell with `AdminSidebar` + content area, replacing the default `MainLayout` Navbar/Footer for admin pages
6. Replace the blank `AdminDashboardPage` with real stat cards: Active Listings, Total Inquiries, Pending Inquiries — each linking to the corresponding admin page
7. Update route constants: change `ADMIN_DASHBOARD` from `/admin` to `/admin/dashboard`, add `ADMIN_ROOT: '/admin'` as a redirect to `/admin/dashboard`

**Acceptance criteria:**
- Dashboard shows three stat cards with live data from the API
- Each card links to the corresponding admin page
- Admin sidebar allows navigation between Dashboard, Houses, and Inquiries
- Admin layout has its own navigation distinct from the public Navbar

---

### INQ-01-B: Inquiry model, create, and list endpoints

**Assignee:** Backend

**What to build:**
1. Create `backend/models/Inquiry.js` — schema with fields: `property` (ref to Property), `name`, `email`, `phone`, `message`, `status` (enum: pending, contacted, closed — default: pending), `adminNotes` (string)
2. Create `backend/validation/schemas/inquirySchema.js` — Zod schemas for creating and updating inquiries
3. Create `backend/controllers/inquiryController.js` — `createInquiry` (public), `getAllInquiries` (admin, with status filter + pagination), `getInquiryById` (admin)
4. Create `backend/routes/inquiryRoutes.js` — public `POST /api/inquiries` (rate-limited)
5. Create `backend/routes/adminInquiryRoutes.js` — protected `GET /api/admin/inquiries` and `GET /api/admin/inquiries/:id`
6. Register both route files in `app.js`

**Acceptance criteria:**
- Public users can submit an inquiry for a property (only if status is active)
- Admin can list all inquiries with optional `?status=pending` filter and pagination
- Admin can view a single inquiry with full details including the linked property info
- Inquiry creation is rate-limited (e.g. 5 per 15 minutes per IP)

---

### INQ-01-F: View Inquiries page

**Assignee:** Frontend

**Prerequisites:** INQ-01-B, DASH-01-F (for admin layout/sidebar)

**Page:** `/admin/inquiries`

**What to build:**
1. Create `frontend/src/services/adminInquiryService.ts` — `getInquiries(params)` with status filter and pagination
2. Create `frontend/src/hooks/useAdminInquiries.ts` — fetches inquiries with filter state
3. Create `frontend/src/components/admin/InquiryTable.tsx` — table showing inquiry date, property title, sender name, email, status badge, and a "View" link
4. Create `frontend/src/components/admin/InquiryStatusTabs.tsx` — tabs (All / Pending / Contacted / Closed) with count per tab
5. Create `frontend/src/pages/Admin/ViewInquiriesPage.tsx` — page with status tabs + inquiry table + pagination
6. Add `ADMIN_INQUIRIES: '/admin/inquiries'` to `routes.ts`
7. Register the route in the router inside `AdminRoute` within `AdminLayout`

**Acceptance criteria:**
- Table lists all inquiries, sorted newest first
- Status tabs filter the table; active tab is reflected in the URL (`?status=pending`)
- Each tab shows its count
- Each row links to the inquiry detail page
- Pagination works

---

### INQ-02-B: Inquiry update and reply endpoint

**Assignee:** Backend

**Prerequisite:** INQ-01-B

**What to build:**
1. Add `updateInquiry` to `inquiryController.js` — allows admin to update `status` and `adminNotes`
2. Add route: `PATCH /api/admin/inquiries/:id` to `adminInquiryRoutes.js`

**Acceptance criteria:**
- Admin can change inquiry status to contacted or closed
- Admin can add/update notes
- Returns the updated inquiry

---

### INQ-02-F: Inquiry Detail page

**Assignee:** Frontend

**Prerequisites:** INQ-01-F, INQ-02-B

**Page:** `/admin/inquiries/:id`

**What to build:**
1. Add `getInquiry(id)` and `updateInquiry(id, data)` to `adminInquiryService.ts`
2. Create `frontend/src/hooks/useInquiryDetail.ts` — fetches single inquiry, handles status update and note saving
3. Create `frontend/src/pages/Admin/InquiryDetailPage.tsx` — displays full inquiry info (sender details, property summary, message), status dropdown, and admin notes text area with save button
4. Add `ADMIN_INQUIRY_DETAIL: '/admin/inquiries/:id'` to `routes.ts`
5. Register the route in the router inside `AdminRoute`

**Acceptance criteria:**
- Full inquiry is displayed with all sender details and the linked property summary
- Admin can change the status via dropdown
- Admin can write and save notes
- Success/error feedback via banners
- Back link returns to the inquiries list

---

### DASH-02-B: Pending inquiry count endpoint

**Assignee:** Backend

**Prerequisite:** INQ-01-B

**What to build:**
1. Add `getPendingCount` to `inquiryController.js` — returns `{ count: number }`
2. Add route: `GET /api/admin/inquiries/count/pending` to `adminInquiryRoutes.js`

**Acceptance criteria:**
- Returns the count of inquiries with `status: 'pending'`
- Lightweight query (count only, no documents fetched)

---

### DASH-02-F: Notification badge in admin sidebar

**Assignee:** Frontend

**Prerequisite:** DASH-02-B, DASH-01-F

**What to build:**
1. Add `getPendingCount()` to `adminInquiryService.ts`
2. Create `frontend/src/hooks/usePendingInquiryCount.ts` — polls the count endpoint every 30 seconds
3. Update `AdminSidebar.tsx` — display a red badge with the pending count next to the "Inquiries" link. Badge hides when count is 0

**Acceptance criteria:**
- Badge shows the current pending inquiry count
- Count refreshes automatically every 30 seconds without full page reload
- Badge disappears when count reaches 0
- Polling stops when the component unmounts (cleanup in the hook)

---

### DASH-03-F: Inquiry status filter with URL sync

**Assignee:** Frontend

**Prerequisite:** INQ-01-F

**What to build:**
1. Update `useAdminInquiries.ts` to read and write the `?status=` query parameter using `useSearchParams`
2. Update `InquiryStatusTabs.tsx` to sync the active tab with the URL parameter
3. Ensure browser back/forward navigates between filter states

**Acceptance criteria:**
- Clicking a status tab updates the URL to `?status=pending` (or removes the param for "All")
- Refreshing the page preserves the active filter
- Browser back/forward buttons navigate between filter states
- Counts per tab are fetched from the API

---

## Task summary by assignee

### Backend tasks (in order)

| ID | Task | Depends on |
|---|---|---|
| INFRA-05 | Cloudinary + Multer setup | — |
| PROP-01-B | Property model + create endpoint | INFRA-05 |
| PROP-02-B | Get single + update property endpoints | PROP-01-B |
| PROP-03-B | Image add/remove endpoints | PROP-01-B |
| PROP-04-B | Property status update endpoint | PROP-01-B |
| PROP-05-B | List all properties (admin + public) endpoints | PROP-01-B |
| PROP-06-B | Soft-delete endpoint | PROP-04-B |
| DASH-01-B | Dashboard stats endpoint | PROP-01-B |
| INQ-01-B | Inquiry model + create + list endpoints | — |
| INQ-02-B | Inquiry update + reply endpoint | INQ-01-B |
| DASH-02-B | Pending inquiry count endpoint | INQ-01-B |

### Frontend tasks (in order)

| ID | Task | Depends on |
|---|---|---|
| PROP-01-F | Add House page | PROP-01-B |
| PROP-02-F | Edit House page | PROP-01-F, PROP-02-B |
| PROP-03-F | Image management in form | PROP-02-F, PROP-03-B |
| PROP-04-F | Status dropdown | PROP-04-B |
| PROP-05-F | Manage Houses page | PROP-04-F, PROP-05-B |
| DASH-01-F | Admin Dashboard + Layout + Sidebar | DASH-01-B |
| INQ-01-F | View Inquiries page | INQ-01-B, DASH-01-F |
| INQ-02-F | Inquiry Detail page | INQ-01-F, INQ-02-B |
| DASH-02-F | Notification badge | DASH-02-B, DASH-01-F |
| DASH-03-F | Inquiry filter URL sync | INQ-01-F |

---

## New files to create (overview)

### Backend
```
backend/
├── config/cloudinary.js
├── middleware/uploadMiddleware.js
├── utils/imageUpload.js
├── models/Property.js
├── models/Inquiry.js
├── validation/schemas/propertySchema.js
├── validation/schemas/propertyUpdateSchema.js
├── validation/schemas/propertyStatusSchema.js
├── validation/schemas/inquirySchema.js
├── controllers/propertyController.js
├── controllers/inquiryController.js
├── controllers/dashboardController.js
├── routes/adminPropertyRoutes.js
├── routes/adminInquiryRoutes.js
└── routes/adminDashboardRoutes.js
```

### Frontend
```
frontend/src/
├── schemas/property.ts
├── types/property.ts  (update if exists)
├── services/adminPropertyService.ts
├── services/adminInquiryService.ts
├── services/adminDashboardService.ts
├── hooks/useCreateProperty.ts
├── hooks/useEditProperty.ts
├── hooks/useAdminProperties.ts
├── hooks/useInquiryDetail.ts
├── hooks/useAdminInquiries.ts
├── hooks/useDashboardStats.ts
├── hooks/usePendingInquiryCount.ts
├── components/admin/PropertyForm.tsx
├── components/admin/PropertyTable.tsx
├── components/admin/StatCard.tsx
├── components/admin/AdminSidebar.tsx
├── components/admin/InquiryTable.tsx
├── components/admin/InquiryStatusTabs.tsx
├── components/layout/AdminLayout.tsx
├── pages/Admin/AdminDashboardPage.tsx  (replace existing blank)
├── pages/Admin/AddHousePage.tsx
├── pages/Admin/EditHousePage.tsx
├── pages/Admin/ManageHousesPage.tsx
├── pages/Admin/ViewInquiriesPage.tsx
└── pages/Admin/InquiryDetailPage.tsx
```
