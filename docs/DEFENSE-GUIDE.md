# დაცვის გზამკვლევი (ქართულად, შენთვის)

ეს ფაილი მხოლოდ შენთვისაა: გაიგე, რა სად არის კოდში და როგორ უპასუხო შემფასებელს. რეპოში დატოვება არ არის სავალდებულო.

## 0. სანამ რამეს გააკეთებ
1. `npm install && npm run typecheck && npm run lint && npm run build`. თუ რამე ჩავარდა, ჩაწერე შეცდომა და გაასწორე (ეს თავისთავად კარგი DEBUG-LOG ჩანაწერია, თუ რეალურად შენ გადაჭრი).
2. გაუშვი `npm run dev` და ხელით გაიარე მთელი ფლოუ: Catalog → Product → Cart → Login → Checkout → Thank you.
3. **დასტურდება ვადა:** PRD-ის მიხედვით რეპოს ჩაბარების ბოლო ვადა 6 ნოემბერი 23:59-ია, ხოლო დაცვა 7–8 ნოემბერს. თუ ეს ვადა გასულია, აუცილებლად დაუკავშირდი ორგანიზატორებს და ჰკითხე, არსებობს თუ არა გადაბარება/გახანგრძლივება.

## 1. Git ისტორია: პატიოსნად
PRD მოითხოვს **რეალურ** და შინაარსიან ისტორიას. არ შეცვალო commit-ების თარიღები და არ ითამაშო დროებით. რეკომენდებული წესი:
- დაიწყე ახალი რეპოთი `10x-shop-{სახელი}`; პირველ commit-ში ჩადე მხოლოდ `PLAN.md` და `.gitignore`.
- შემდეგ ფაილები დაამატე ლოგიკური ნაწილებით და **ყოველი ნაწილის გაშვების/გაგების შემდეგ** გააკეთე commit. მაგალითი თანმიმდევრობა:
  1. `chore: scaffold Vite + React + TS + Tailwind v4`
  2. `feat: add domain types and constants`
  3. `feat: layout, header and router`
  4. `feat: auth context and login with Formik + Yup`
  5. `feat: catalog with loading/error/empty states`
  6. `feat: product page and gallery`
  7. `feat: cart context, reducer and cart page`
  8. `feat: checkout form and order confirmation`
  9. `feat: search, category, sort, pagination in URL`
  10. `feat: reviews, related products, promo code`
  11. `feat: orders, profile, sign up`
  12. `style: dark mode and responsive polish`
  13. `docs: README, REPORT, DEBUG-LOG`

## 2. Deploy
Vercel: New Project → import GitHub repo → Framework "Vite" → Deploy. `vercel.json` უკვე გადაწერს ყველა მისამართს `index.html`-ზე. შემდეგ გახსენი პირდაპირ `<შენი-ლინკი>/products/5` და გააკეთე refresh. ლინკი ჩასვი README-ში.

## 3. რა სად არის (CORE ჩეკლისტი)
| მოთხოვნა | ფაილი |
| --- | --- |
| Props, `children` | `components/ui/Card.tsx`, `layout/Container.tsx`, `routes/ProtectedRoute.tsx` |
| `useState` / `useEffect` | `hooks/useFetch.ts`, `pages/CheckoutPage.tsx` |
| `map()` + key | `components/product/ProductGrid.tsx` (`key={product.id}`) |
| Controlled form (useState) | `pages/CheckoutPage.tsx`, `pages/ProfilePage.tsx` |
| Formik + Yup (FULL) | `pages/LoginPage.tsx`, `RegisterPage.tsx`, `utils/schemas.ts` |
| Router + Layout + 404 | `routes/AppRoutes.tsx`, `components/layout/Layout.tsx`, `pages/NotFoundPage.tsx` |
| Context | `context/AuthContext.tsx`, `CartContext.tsx` |
| Immutable updates | `context/cart.reducer.ts` |
| Checkout guard | `routes/ProtectedRoute.tsx` (+ `from` state, `utils/routerState.ts`) |
| Loading / error / empty | `pages/CatalogPage.tsx`, `ProductPage.tsx`, `components/ui/StateMessages.tsx` |
| Error Boundary | `components/ErrorBoundary.tsx` |
| Tailwind v4 | `vite.config.ts`, `src/index.css` (`@import "tailwindcss"`, `@theme`) |
| Responsive grid | `ProductGrid.tsx` (`grid-cols-1 min-[560px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`) |
| hover / focus / disabled | `components/ui/Button.tsx`, `FormField.tsx` |

## 4. კითხვები, რომლებიც შეიძლება დაგისვან
- **რატომ `key={product.id}` და არა index?** index იცვლება სიის შეცვლისას, React ელემენტებს აურევს. id სტაბილურია.
- **რატომ არის reducer სუფთა ფუნქცია, localStorage კი `CartProvider`-ის `useEffect`-ში?** reducer-ს გვერდითი ეფექტი არ უნდა ჰქონდეს; შენახვა ეფექტია.
- **რას აკეთებს `AbortController` `useFetch`-ში?** ახალი მოთხოვნისას ძველს აუქმებს, რომ ნელმა ძველმა პასუხმა ახალი არ გადაფაროს.
- **რატომ არის `useEffect`-ში `[path, attempt]`?** path-ის ცვლილებისას (მაგ. სხვა პროდუქტი) ახალი მოთხოვნა უნდა დაიწყოს; `attempt` Retry-სთვისაა.
- **რატომ `key={state.data.id}` `ProductDetails`-ზე?** პროდუქტის შეცვლისას რაოდენობა, გალერეა და ტაბი თავიდან იწყება.
- **interface vs type?** ობიექტის ფორმა, რომელიც შეიძლება გაფართოვდეს (`Product`, `CartItem`) → `interface`; union/alias (`SortOption`, `AsyncState<T>`) → `type`.
- **ერთი generic:** `useFetch<T>` / `StorageService<T>` / `useLocalStorage<T>`.
- **ერთი type guard:** `isCartState` ან `isApiError` (`utils/guards.ts`, `api/ApiError.ts`). localStorage-იდან წაკითხული JSON `unknown`-ია, guard ამოწმებს ფორმას.
- **რატომ `Cart` კლასი?** ფასის ყველა გამოთვლა ერთ ადგილას, UI-ს გარეშე.
- **რატომ ძებნა და კატეგორია ერთად არ მუშაობს?** DummyJSON-ის `/products/search` კატეგორიას არ იღებს; ამიტომ ისინი ურთიერთგამომრიცხავია (URL-შიც).
- **რატომ არის URL სიმართლის წყარო?** refresh, Back/Forward და ბმულის გაზიარება თავისთავად მუშაობს.
- **Login რეალური არ არის, რატომ?** PRD ითხოვს ლოკალურ სიმულაციას (Context). პაროლი არსად ინახება.
- **როგორ დაამტკიცებ Error Boundary-ს?** დროებით ჩააგდე `throw new Error("test")` ნებისმიერ კომპონენტში; ეკრანზე უნდა გამოჩნდეს „Something went wrong.“ + Reload.

## 5. სანამ გააგზავნი
- `README.md`: ჩასვი ლაივ ბმული. `REPORT.md` და `DEBUG-LOG.md`: შეავსე **შენი** რეალური ჩანაწერებით.
- ჩაწერე `Credits`-ში, რომ AI გამოიყენე (PRD ამას ნებას რთავს, მაგრამ დაცვაზე უნდა ახსნა ყველა ფაილი).
- ბოლოს ისევ გაუშვი: `npm install && npm run typecheck && npm run build`.
