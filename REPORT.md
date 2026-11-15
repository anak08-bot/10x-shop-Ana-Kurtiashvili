# REPORT - 10X Shop

## Planned vs delivered
| Module | Item | Level | Status |
| --- | --- | --- | --- |
| React | Router, Layout, 404 | CORE | ✅ Done |
| React | Login + AuthContext + checkout redirect | CORE | ✅ Done |
| React | Catalog, Product, Cart, Checkout | CORE | ✅ Done |
| React | Search / category / sort / pagination / URL state | FULL | ✅ Done |
| React | Reviews, related products, promo code | FULL | ✅ Done |
| React | Orders, Profile, Sign up, Formik + Yup | FULL | ✅ Done |
| TypeScript | strict, typecheck = 0 | CORE | ✅ Done (`npm run typecheck` reports 0 errors) |
| TypeScript | generics, ApiClient, type guards, classes | FULL | ✅ Done |
| Optimization | Error Boundary, DEBUG-LOG | CORE | ✅ Done (3 entries in `DEBUG-LOG.md`) |
| Optimization | lazy routes / images | FULL | Lazy routes ✅ Done · lazy images ⚠ VERIFY (`grep -rn 'loading="lazy"' src`) |
| Tailwind | v4, utilities, responsive, hover/focus | CORE | ✅ Done |
| Tailwind | `@theme`, dark mode, `@utility` | FULL / BONUS | ✅ Done (design tokens in `@theme`, dark mode, custom `eyebrow` utility) |
| Process | README, PLAN, REPORT, deploy, Git | CORE | ✅ Done (live link: ⚠ PASTE URL) |

**What I did not do, and why:**
- Real authentication and real payments: out of scope by design. Login and Checkout are local simulations, as the PRD requires.
- The FULL process items: GitHub Issues/Projects board, PR flow, weekly progress notes, demo video, and the cross-browser matrix (`COMPATIBILITY.md`). My PLAN marked these as "-" from the start, because I put my limited time into finishing and deploying CORE first and then into the product features (search/URL state, orders, profile, dark mode).
- Search and category filtering at the same time: the DummyJSON API cannot combine them, so I made them mutually exclusive in the UI and the URL instead of faking it on the client.

## Metrics
| Metric | Value |
| --- | --- |
| Commits / working days | ⚠ `<N>` commits / `<N>` days (`git rev-list --count HEAD` and `git log --date=short --format=%ad \| sort -u \| wc -l`) |
| Main bundle size (gzip) | ⚠ `<N> kB` (from the `npm run build` output) |
| Lighthouse (mobile) before -> after | ⚠ `<before> -> <after>` or write "not measured" |
| Planned effort | ~50 h (Week 1: 14 h, Week 2: 18 h, Week 3: 18 h, from PLAN.md) |

## The 3 hardest problems
1. **Stale API responses overwriting newer ones.** With a slow connection, an older catalog request could finish last and replace the correct results. I found it in the Network tab and fixed it with an `AbortController` in `useFetch`, ignoring the abort error. Details: `DEBUG-LOG.md` #1.
2. **Keeping catalog state in the URL when the API is limited.** Search, category, sort and page all had to survive refresh, Back/Forward and shared links, but DummyJSON cannot combine search with a category. I made the two mutually exclusive and treated the URL (`?q=&category=&sort=&page=`) as the single source of truth, so the UI never disagrees with the address bar.
3. **Deep links returning 404 after deploy.** Refreshing `/products/5` worked locally but not on the host, because the server did not know about client-side routes. I fixed it with rewrites for Vercel and Netlify. Details: `DEBUG-LOG.md` #2.

## What I would do differently
- Write the first small automated tests (Vitest) for the pure parts, like the cart reducer and the price/URL helpers, instead of only testing by hand.
- Deploy on day one and redeploy after every feature. I found the refresh bug late because I had only tested on localhost.
- Run Lighthouse before building the FULL features, so there would be a real "before" to compare against.
- Work in short feature branches with pull requests and Issues from the start, so the Git history shows the process as clearly as the code does.

## AI usage summary
I used Claude to scaffold the project (Vite/TypeScript/Tailwind setup, folder structure, config files) and to produce first drafts of components and documentation. I ran, read and tested everything myself, and I changed the parts that did not match the PRD or my plan. The scope decisions were mine: CORE first, then a chosen set of FULL features, and search and category as mutually exclusive. I kept login and checkout as simulations and did not store passwords. I can explain every file in the project, including the cart reducer, `useFetch` and the type guards, at the defense. ⚠ EDIT: replace this paragraph's general statements with 1-2 concrete things you actually changed or rejected, in your own words.