import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Spinner } from "../ui/Spinner";
import { AnnouncementBar } from "./AnnouncementBar";
import { Container } from "./Container";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ScrollToTop } from "./ScrollToTop";

/** One layout for every route: Header + page (<Outlet />) + Footer. */
export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-card focus:px-4 focus:py-2 focus:font-semibold">
        Skip to content
      </a>
      <ScrollToTop />
      <AnnouncementBar />
      <Header />
      <main id="main" className="flex-1 py-8">
        <Container>
          {/* Pages are lazy-loaded: show a spinner while a page's code downloads. */}
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
