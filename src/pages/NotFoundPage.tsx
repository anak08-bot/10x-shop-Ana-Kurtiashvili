import { Link } from "react-router-dom";
import { buttonClasses } from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <p className="font-display text-7xl font-semibold text-crimson-600 dark:text-crimson-500" aria-hidden="true">
        404
      </p>
      <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">Page not found</h1>
      <p className="mt-2 text-muted">The page you are looking for does not exist.</p>
      <Link to="/" className={buttonClasses("primary", false, "mt-6")}>
        Go to catalog
      </Link>
    </div>
  );
}
