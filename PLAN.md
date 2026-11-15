# PLAN - 10X Shop

## Goal and scope
Build the 10X Shop SPA (React + TypeScript + Tailwind v4 + DummyJSON). **CORE first**, then selected FULL items.

| Module | CORE | FULL I plan to do |
| --- | --- | --- |
| React | components, props/children, state/effects, map/key, controlled Login + Checkout, Router, Context, Cart | custom hooks, reducer, Formik + Yup, Orders, Profile, Sign up |
| TypeScript | strict, typed props/state/API, typecheck = 0 | generics, ApiClient, type guards, unions, OOP classes |
| Optimization | responsive, Error Boundary, DEBUG-LOG | lazy routes, lazy images |
| Tailwind | v4 integration, utilities, grid/flex, responsive, hover/focus | `@theme`, dark mode, custom utility |
| Process | README, PLAN, REPORT, deploy, real Git history | - |

## Work breakdown (hours are estimates)
**Week 1 (17-23 Oct): foundation, Login, Catalog**
- Setup Vite + TS strict + Tailwind v4, repo, PLAN.md (2h)
- Types, Layout/Header, Router (3h)
- AuthContext, Login (Formik + Yup), checkout guard (4h)
- Catalog fetch + ProductCard/Grid + loading/error/empty (5h)

**Week 2 (24-30 Oct): Product, Cart, Checkout**
- Product details + gallery + stepper (4h)
- CartContext + reducer + Cart page (5h)
- Checkout + order confirmation (4h)
- Search, category, sort, pagination, URL state (5h)

**Week 3 (31 Oct - 6 Nov): finish and ship**
- Reviews, related, promo, Orders, Profile, Sign up (8h)
- Responsive pass at 375px, hover/focus states, dark mode (4h)
- Error Boundary, DEBUG-LOG, README/REPORT (3h)
- Deploy, SPA refresh check, final QA (3h)

## Risks
| Risk | Mitigation |
| --- | --- |
| DummyJSON is slow or down | clear error state with Retry; keep UI usable |
| Search and category cannot be combined in the API | make them mutually exclusive in the UI and URL |
| Stale responses overwrite new ones | AbortController in `useFetch` |
| localStorage has corrupt data | read through `StorageService` + type guards |
| Time runs out | CORE is finished and deployed before any FULL work |

## Definition of Done (per task)
Works in the browser at 375px and desktop, no TypeScript errors, no console errors, committed with a meaningful message.
