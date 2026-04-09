# CLAUDE.md — Frontend (Cover: Mobile Cover E‑Commerce)

This file is the contract Claude must follow when working in `frontend/`. Read it fully before generating, refactoring, or scaffolding anything.

---

## 1. Product Context

We are building a **full‑stack e‑commerce web application for selling mobile phone covers / cases**.

- **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + shadcn/ui
- **Backend:** Django + Django REST Framework (DRF) with token auth, located in `../backend/`
- **Auth:** NextAuth (Credentials provider) wrapping the DRF token endpoint
- **State of the repo:** The frontend was bootstrapped from a *futsal booking template*. All `futsal*` files (interfaces, mappers, services, repositories) are placeholders and must be **replaced**, not extended, when building e‑commerce features. The architectural pattern is the part to keep — the domain entities are not.

### Core e‑commerce entities to build
| Entity | Purpose |
|---|---|
| `Product` | Mobile cover (name, slug, brand, model compatibility, price, discount, stock, images, description, rating) |
| `Category` | Brand / Phone Model / Material / Style |
| `Cart` / `CartItem` | Per‑user cart, quantity, variant |
| `Order` / `OrderItem` | Checkout result, status, address, payment ref |
| `Address` | Shipping addresses for a user |
| `Wishlist` | Saved products |
| `Review` | Rating + comment per product |
| `Coupon` | Discount codes |
| `Payment` | Khalti / eSewa / Stripe integration record |

### User roles
- `customer` — browses, carts, checks out, reviews
- `owner` (staff) — manages products, categories, orders, inventory (admin dashboard)

The role is derived in [src/app/api/auth/[...nextauth]/route.ts](src/app/api/auth/[...nextauth]/route.ts) from `is_staff` on the DRF user response.

---

## 2. Tech Stack (locked — do not swap)

- **Framework:** Next.js 16 App Router (`src/app`)
- **Language:** TypeScript, strict
- **Styling:** Tailwind CSS v4 + `tw-animate-css`
- **UI primitives:** shadcn/ui (Radix under the hood) — components live in [src/components/ui/](src/components/ui/). Add new ones via `npx shadcn@latest add <name>`. Never hand‑roll a primitive that shadcn provides.
- **Icons:** `lucide-react`
- **Forms:** `react-hook-form` + `zod` (via `@hookform/resolvers`)
- **HTTP:** `axios` with two pre‑configured instances in [src/lib/axios/](src/lib/axios/)
- **Auth:** `next-auth` (JWT strategy, Credentials provider)
- **Notifications:** `sonner`
- **Analytics:** `posthog-js` + `@posthog/react` (already in deps)
- **PWA:** `@ducanh2912/next-pwa`
- **Theme:** `next-themes` (light/dark)

Do **not** introduce: Redux, Zustand, TanStack Query, SWR, styled‑components, Material UI, Chakra, Bootstrap. The pattern is local hooks (`useFetch` / `useCreate` / `useUpdate` / `useDelete`) from [src/lib/hooks/useApi.ts](src/lib/hooks/useApi.ts).

---

## 3. Folder Architecture (Domain‑Driven)

```
src/
├── app/                          # Next.js App Router — routes only, no business logic
│   ├── (public)/                 # Unauthenticated route group: /, /products, /products/[slug], /cart…
│   ├── (auth)/                   # /login, /register
│   ├── (customer)/               # Authenticated customer: /account, /orders, /wishlist, /checkout
│   ├── (owner)/                  # Staff dashboard: /dashboard, /dashboard/products…
│   ├── api/auth/[...nextauth]/   # NextAuth route handler
│   ├── layout.tsx                # Root layout (providers, fonts, theme)
│   ├── providers.tsx             # Client providers (SessionProvider, ThemeProvider, PostHog, Sonner)
│   └── globals.css
│
├── components/
│   ├── ui/                       # shadcn primitives — DO NOT EDIT BY HAND beyond shadcn updates
│   └── custom/                   # App-specific composed components (ProductCard, CartDrawer, Header…)
│
├── domain/                       # Pure TS — no React, no Next imports
│   ├── interfaces/               # Two interfaces per entity: I<Entity>Api (snake_case from backend) + I<Entity> (camelCase frontend)
│   ├── mappers/                  # map<Entity>(api) → frontend shape. Pure functions.
│   ├── apiRepository/            # Thin axios calls. One file per resource. Returns raw axios response.
│   ├── services/                 # Orchestrates repository + mapper + error handling. What components/hooks call.
│   └── schema/                   # zod schemas for forms (LoginSchema, RegisterSchema, ProductSchema…)
│
├── lib/
│   ├── axios/                    # axiosInstance (auth header) + authAxiosInstance
│   ├── hooks/useApi.ts           # Generic CRUD hooks
│   └── utils.ts                  # cn() helper for shadcn
│
└── middleware.ts                 # Route protection via next-auth JWT
```

### The Golden Rule
**Data flows in exactly one direction:**

```
Backend (snake_case JSON)
   → apiRepository (axios)
   → service (calls repo, runs mapper, handles errors)
   → mapper (snake → camel)
   → hook (useFetch / useCreate…)
   → component (UI)
```

Components **never** import `axios`, `apiRepository`, or `mappers` directly. Components only know about `services` and `hooks`. Services are the only layer allowed to mix repo + mapper.

---

## 4. Naming & Style Conventions

| Layer | Casing |
|---|---|
| Backend JSON & `I*Api` interfaces | `snake_case` (e.g. `price_per_unit`, `is_active`) |
| Frontend `I*` interfaces, variables, props | `camelCase` (e.g. `pricePerUnit`, `isActive`) |
| React components & files in `components/` | `PascalCase.tsx` (e.g. `ProductCard.tsx`) |
| Route folders | `kebab-case` or Next.js conventions (`(group)`, `[slug]`) |
| Hooks | `useThing` |
| Services | `<entity>Service` (camelCase singleton object export) |
| Repositories | `<entity>ApiRepository` |
| Zod schemas | `<Thing>Schema.ts` exporting `<Thing>Schema` |

### TypeScript
- Strict mode is on. No `any` unless absolutely unavoidable — prefer `unknown` + narrowing.
- Always declare an `I<Entity>Api` shape AND an `I<Entity>` shape, even if identical, so the mapper boundary stays explicit.
- Mappers must be pure and total (no `undefined` leaks for required fields).

### Imports
- Use the `@/` path alias (configured in [tsconfig.json](tsconfig.json)) — never relative `../../../`.

### Comments
- Don't narrate code. Comment only the *why* when it's non‑obvious.

---

## 5. How to Add a New Feature (Recipe)

Suppose we are adding **Products**. Follow these steps in order:

1. **Interfaces** — [src/domain/interfaces/productInterface.ts](src/domain/interfaces/productInterface.ts)
   - `IProductApi` (snake_case, mirrors DRF serializer output)
   - `IProduct` (camelCase, what the UI consumes)
2. **Mapper** — [src/domain/mappers/productMapper.ts](src/domain/mappers/productMapper.ts)
   - `mapProduct(api: IProductApi): IProduct`
3. **Repository** — [src/domain/apiRepository/productApiRepository.ts](src/domain/apiRepository/productApiRepository.ts)
   - `getProducts`, `retrieveProduct(slug)`, `createProduct`, `updateProduct`, `deleteProduct`
   - Use `instance` from [src/lib/axios/axiosInstance.ts](src/lib/axios/axiosInstance.ts)
   - Endpoints follow DRF: `products/products/`, `products/products/<slug>/`
4. **Service** — [src/domain/services/productService.ts](src/domain/services/productService.ts)
   - Calls the repo, applies `mapProduct`, returns the typed `IProduct` (or `IResponseApi<IProduct[]>` for paginated lists — see [src/domain/interfaces/apiResponse.ts](src/domain/interfaces/apiResponse.ts))
5. **(If a form)** Zod schema in `src/domain/schema/`
6. **UI components** — `src/components/custom/ProductCard.tsx`, `ProductGrid.tsx`, etc.
7. **Pages** — under the appropriate route group:
   - Listing → `src/app/(public)/products/page.tsx`
   - Detail → `src/app/(public)/products/[slug]/page.tsx`
   - Admin CRUD → `src/app/(owner)/dashboard/products/...`
8. **Hook usage in component:**
   ```tsx
   const { data, loading } = useFetch<IResponseApi<IProduct[]>>(
     () => productService.getProducts(page),
     [page.toString()]
   );
   ```

### Checklist when scaffolding a new entity
- [ ] `I<Entity>Api` and `I<Entity>` exist
- [ ] Mapper is pure and tested mentally against backend serializer
- [ ] Repository has no business logic — just axios calls
- [ ] Service is the only layer that imports both repo and mapper
- [ ] Component imports only `service` + `useApi` hooks
- [ ] No hardcoded URLs — `NEXT_PUBLIC_BASEURL` is the base
- [ ] No `console.log` left behind (errors are fine inside `catch`)

---

## 6. Auth Flow

1. User submits credentials on `/login`.
2. NextAuth `Credentials.authorize` calls `authServices.login`, which hits Django `/api/auth/login/` ([backend ObtainAuthToken](../backend/backend/users/api/views.py)).
3. Backend returns `{ token, user: { id, email, username, is_staff, phone } }`.
4. NextAuth JWT callback stores `accessToken`, `role` (`owner` if `is_staff` else `customer`), `userId`, `email`, `phone`, `username`.
5. Subsequent axios requests attach `Authorization: Token <accessToken>` via the interceptor in [src/lib/axios/axiosInstance.ts](src/lib/axios/axiosInstance.ts).
6. [src/middleware.ts](src/middleware.ts) protects routes — currently scoped via `matcher`. **Update the matcher when adding protected routes** (e.g. `/checkout`, `/account`, `/dashboard/:path*`).

### Role gating
- `(customer)` group → require token, reject `owner`‑only pages
- `(owner)` group → require `token.role === "owner"`
- `(public)` and `(auth)` → open

When extending middleware, uncomment and adapt the role‑routing block already sketched at the bottom of `middleware.ts`.

---

## 7. UI / UX Conventions

- **Design system:** shadcn/ui defaults, Tailwind tokens. Theme variables come from `globals.css`.
- **Layouts:** Root `<Header />` lives in [src/components/custom/Header.tsx](src/components/custom/Header.tsx). Each route group has its own `layout.tsx` for shell variants (customer vs owner vs public).
- **Forms:** Always `react-hook-form` + `zodResolver` + shadcn `<Form>` components. Show field‑level errors via `<FormMessage />`. Submit buttons disable while `loading`.
- **Toasts:** `sonner` — `toast.success("Added to cart")`, `toast.error(...)` for failures from services.
- **Loading:** Use the `loading` flag from `useApi` hooks. Skeletons over spinners for content; spinners only on buttons.
- **Images:** Use `next/image`. Backend returns absolute URLs (or prefix with `NEXT_PUBLIC_MEDIA_URL` if relative).
- **Currency:** Display in NPR (`Rs.`) by default — single helper `formatPrice(n)` in `lib/utils.ts` (add it when first needed).
- **Responsive:** Mobile‑first. Product grid: 2 cols mobile → 3 tablet → 4 desktop.
- **Accessibility:** Keep shadcn's Radix semantics. All interactive elements need labels.

---

## 8. E‑commerce Pages to Build

### Public
- `/` — Hero, featured products, categories, brand strip, testimonials
- `/products` — Filterable grid (brand, model, price, material), pagination
- `/products/[slug]` — Image gallery, variant selector, add to cart, reviews, related products
- `/categories/[slug]` — Category landing
- `/search` — Query results

### Customer (auth required)
- `/cart` — Line items, quantity, totals, coupon
- `/checkout` — Address, payment method, summary, place order
- `/account` — Profile
- `/account/orders` — List + detail with status timeline
- `/account/addresses` — CRUD
- `/account/wishlist`

### Owner / Admin (`is_staff`)
- `/dashboard` — KPIs (orders, revenue, low stock)
- `/dashboard/products` — Table + create/edit
- `/dashboard/categories`
- `/dashboard/orders` — Status updates
- `/dashboard/coupons`
- `/dashboard/users`

### Auth
- `/login`, `/register`, `/forgot-password`

---

## 9. Backend Contract (what the frontend expects)

The Django backend lives in `../backend/`. It uses:
- DRF + `rest_framework.authtoken`
- `drf-spectacular` for OpenAPI
- `drf-standardized-errors`
- Routers under [config/api_router.py](../backend/config/api_router.py)
- Custom user at [backend/users/models.py](../backend/backend/users/models.py)

When a frontend feature needs an endpoint that doesn't exist on the backend yet, **build it on the backend in the same change**. Don't mock, don't stop — implement the model, serializer, viewset, and URL registration in `../backend/`, then wire the frontend `apiRepository` against it. See [../backend/CLAUDE.md](../backend/CLAUDE.md) for backend conventions. The URL convention is `/api/<app>/<resource>/`, e.g. `/api/catalog/products/`, `/api/orders/orders/`, `/api/expenses/expenses/`.

Standard list response shape (see [apiResponse.ts](src/domain/interfaces/apiResponse.ts)):
```ts
interface IResponseApi<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T;
}
```

---

## 10. Things NOT to Do

- ❌ Don't keep, extend, or reference any `futsal*` file in new code. Delete the futsal files as their replacements (`product`, `cart`, `order`, etc.) are scaffolded.
- ❌ Don't fetch in components with raw `axios` or `fetch`. Always go through a service.
- ❌ Don't put backend snake_case keys into JSX. The mapper exists for a reason.
- ❌ Don't introduce a global state library. Local state + `useApi` + URL state is enough.
- ❌ Don't write CSS files outside `globals.css`. Tailwind only.
- ❌ Don't hand‑edit files in `components/ui/` beyond what `shadcn` regenerates.
- ❌ Don't ship `console.log`s. `console.error` inside `catch` is acceptable.
- ❌ Don't hardcode tokens, URLs, or secrets. Use `process.env.NEXT_PUBLIC_*` (frontend) and refer to [backend/.env](../backend/.env) for backend env keys (never read its values into committed code).
- ❌ Don't bypass middleware role checks by gating only in the component.
- ❌ Don't skip the `I<Entity>Api` ↔ `I<Entity>` split, even when shapes look identical.
- ❌ Don't add documentation files (`*.md`) unprompted.

---

## 11. Definition of Done for Any Task

A change is "done" when:
1. Types compile (`npm run build` or at minimum `tsc --noEmit` clean)
2. Lint passes (`npm run lint`)
3. The data flow respects the layering (interface → mapper → repo → service → hook → component)
4. Auth/role gating is enforced both in middleware (route) and in the UI (visibility)
5. Loading and error states are handled — no naked `data!` access
6. The feature works for both `customer` and `owner` where applicable
7. No leftover futsal references

---

## 12. Quick Reference

- Base URL env: `NEXT_PUBLIC_BASEURL` (e.g. `http://localhost:8000/api/`)
- NextAuth secret: `NEXTAUTH_SECRET`
- Run dev: `npm run dev`
- Add shadcn component: `npx shadcn@latest add <name>`
- Path alias: `@/*` → `src/*`

When in doubt about an architectural choice: **mirror the existing `futsal*` pattern's *shape*, but for the e‑commerce entity** — that pattern is the canonical reference even though the entity itself is being thrown away.
