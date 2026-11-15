import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogoMark } from "../ui/icons";
import { Container } from "./Container";

const SHOP_LINKS: ReadonlyArray<{ to: string; label: string }> = [
  { to: "/", label: "All products" },
  { to: "/?category=smartphones", label: "Smartphones" },
  { to: "/?category=laptops", label: "Laptops" },
  { to: "/?category=fragrances", label: "Fragrances" },
  { to: "/?category=beauty", label: "Beauty" },
  { to: "/?category=furniture", label: "Furniture" },
];

const linkClass = "inline-flex min-h-9 items-center text-sm text-ivory/70 transition-colors hover:text-gold-400";

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="eyebrow mb-3 font-sans text-gold-400">{title}</h2>
      {children}
    </div>
  );
}

/** Navy footer: who we are, where to go, your account and the shop's standing offers. */
export function Footer() {
  const { isLoggedIn } = useAuth();

  return (
    <footer className="mt-20 border-t-4 border-double border-gold-600/70 bg-navy-950 text-ivory">
      <div className="h-px bg-linear-to-r from-transparent via-gold-400 to-transparent" aria-hidden="true" />
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-2.5" aria-label="10X Shop, go to catalog">
            <LogoMark className="size-9 text-gold-500" />
            <span className="gold-text font-display text-2xl font-bold tracking-wider">10X Royal Shop</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/70">
            Treasures chosen for the royal court, and a checkout worthy of a coronation. Made in Tbilisi.
          </p>
        </div>

        <Column title="Shop">
          <ul>
            {SHOP_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </Column>

        <Column title="Your account">
          <ul>
            <li>
              <Link to="/cart" className={linkClass}>
                Cart
              </Link>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <Link to="/orders" className={linkClass}>
                    Orders
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className={linkClass}>
                    Profile
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className={linkClass}>
                    Log in
                  </Link>
                </li>
                <li>
                  <Link to="/register" className={linkClass}>
                    Create an account
                  </Link>
                </li>
              </>
            )}
          </ul>
        </Column>

        <Column title="Good to know">
          <ul className="space-y-2.5 text-sm leading-relaxed text-ivory/70">
            <li>Free shipping over $100, otherwise a flat $10.</li>
            <li>
              Promo code <strong className="font-semibold text-gold-400">10X10</strong> takes 10% off your order.
            </li>
            <li>Order status updates by itself on the Orders page.</li>
            <li>This is a demo store: checkout is simulated and no payment is taken.</li>
          </ul>
        </Column>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-5 text-xs text-ivory/60 sm:flex-row">
          <p>© 2026 10X Shop. Product data from DummyJSON.</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 font-medium tracking-wide text-ivory/80 transition-colors hover:bg-white/10 hover:text-gold-400"
          >
            Back to top <span aria-hidden="true">↑</span>
          </button>
        </Container>
      </div>
    </footer>
  );
}
