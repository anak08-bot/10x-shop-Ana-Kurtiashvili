# DEBUG-LOG

Three bugs I hit while running 10X Shop. Each entry: symptom → reproduction → tool → root cause → fix → what I learned.

## 1. Stale catalog response overwrote the newer one
- **Symptom:** On a slow connection, changing the search text or category quickly sometimes left the grid showing products from the *previous* query, while the URL and the filter controls already showed the new one.
- **Reproduction:** DevTools → Network → throttling "Slow 4G". Open `/`, search for one term, then immediately switch to another term or category. Wait for both requests to finish.
- **Tool used and what it showed:** The Network tab showed two `/products...` requests in flight at the same time, and the *older* one finished last. React DevTools → Components showed the `data` state of `useFetch` holding the older request's result even though the `url` value was already the new one.
- **Root cause:** The fetch inside `useEffect` had no cleanup. Responses can arrive out of order, so whichever request finished last called `setState` and won, even if it was no longer the current request.
- **Fix (commit):** Create an `AbortController` in the effect, call `controller.abort()` in the cleanup function, and ignore the resulting `AbortError` so it is not shown as an error state. `<commit-url>`
- **What I learned:** An effect that fetches data always needs a cleanup. Out-of-order responses are normal, not rare. An aborted request is not a failure, so the `catch (e: unknown)` branch has to tell the two apart with a type guard instead of showing "Something went wrong".

## 2. Refreshing `/products/5` returned 404 on the deployed site
- **Symptom:** The app worked locally and when navigating inside the site, but on the live URL pressing F5 on a product page (or opening a shared `/products/5` link in a new tab) showed the host's 404 page instead of the app.
- **Reproduction:** Open the live site, click any product, press F5. Or paste `https://<live-url>/products/5` into a new tab.
- **Tool used and what it showed:** Network tab → the document request for `/products/5` returned status 404 and no JavaScript bundle was requested at all, while the request for `/` returned 200. This did not reproduce in `npm run dev`, because the dev server already falls back to `index.html`, which is why it only appeared after deploy.
- **Root cause:** `BrowserRouter` uses real URL paths (History API), but the hosting server only has a file for `/`. For any other path it looked for a file that does not exist and answered 404, so React Router never got a chance to start.
- **Fix (commit):** Added a catch-all rewrite to `index.html` in `vercel.json` (`/(.*)` → `/index.html`) and `public/_redirects` (`/*  /index.html  200`) for Netlify. `<commit-url>`
- **What I learned:** Client-side routing needs a server-side fallback. "It works on localhost" does not cover deep links, so after every deploy I now hard-refresh a deep link such as `/products/5` as part of my checklist.

## 3. Wrong theme flashed on page reload
- **Symptom:** After switching to the non-default theme, reloading the page briefly showed the default theme before switching to the saved one (a visible flash).
- **Reproduction:** Switch the theme, then hard-reload (Ctrl+Shift+R) with Network throttled to "Slow 4G" and CPU throttled in the Performance panel so the JavaScript bundle is slow to run.
- **Tool used and what it showed:** Elements panel → the `data-theme` attribute on `<html>` still had its default value in the first frames. The Performance panel's filmstrip showed those frames being painted before `main.tsx` had executed.
- **Root cause:** The saved theme was only applied from React after the app mounted, but the browser paints the HTML before the JavaScript bundle runs, so the first paint always used the default theme.
- **Fix (commit):** A small inline script in `index.html` reads `shop_theme` from `localStorage` and sets `document.documentElement.dataset.theme` before first paint. It is wrapped in `try/catch` because storage can be unavailable or contain invalid JSON. `<commit-url>`
- **What I learned:** Anything that must be correct on the very first paint cannot wait for React. Reading from `localStorage` always needs a safe fallback, because the value is user-editable and has no type.