import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useRoyal } from "../../context/RoyalContext";
import { useTheme } from "../../context/ThemeContext";
import { cn } from "../../utils/cn";
import { buttonClasses } from "../ui/Button";
import { CartIcon, CloseIcon, CrownIcon, LogoMark, MenuIcon, MoonIcon, SunIcon } from "../ui/icons";
import { Container } from "./Container";

const navLink = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex min-h-11 items-center rounded-sm border-b-2 px-4 font-display text-xs font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-sunken",
    isActive ? "border-gold-500 text-crimson-600 dark:text-gold-400" : "border-transparent text-ink",
  );

export function Header() {
  const { user, isLoggedIn, logout } = useAuth();
  const { itemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { isMember } = useRoyal();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    setOpen(false);
    navigate("/");
  }

  const links = (
    <>
      <NavLink to="/" end className={navLink}>
        Catalog
      </NavLink>
      <NavLink to="/cart" className={navLink}>
        Cart
        {itemCount > 0 && (
          <span
            aria-label={`${itemCount} items in cart`}
            className="ml-2 min-w-5 rounded-full bg-crimson-600 px-1.5 text-center text-[11px] font-semibold leading-5 text-white"
          >
            {itemCount}
          </span>
        )}
      </NavLink>
      {isLoggedIn && (
        <>
          <NavLink to="/orders" className={navLink}>
            Orders
          </NavLink>
          <NavLink to="/profile" className={navLink}>
            Profile
          </NavLink>
        </>
      )}
    </>
  );

  const themeButton = (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-sunken"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );

  const account = isLoggedIn ? (
    <>
      <span className="hidden max-w-32 truncate text-sm text-muted lg:inline">Hi, {user?.firstName || user?.username}</span>
      <button type="button" onClick={handleLogout} className={buttonClasses("secondary")}>
        Log out
      </button>
    </>
  ) : (
    <>
      <Link to="/login" className={buttonClasses("ghost")}>
        Log in
      </Link>
      <Link to="/register" className={buttonClasses("primary")}>
        Sign up
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b-2 border-gold-600/70 bg-card/90 shadow-[0_6px_0_-4px_rgba(193,154,73,0.35)] backdrop-blur-md">
      <Container className="flex h-[4.5rem] items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5 rounded-full" aria-label="10X Shop, go to catalog">
          <LogoMark className="size-9 text-gold-500 drop-shadow-[0_1px_0_rgba(0,0,0,0.4)]" />
          <span className="flex items-baseline gap-2">
            <span className="gold-text font-display text-2xl font-bold leading-none tracking-wider">10X</span>
            <span className="eyebrow text-gold-700 dark:text-gold-400">Royal Shop</span>
          </span>
        </Link>

        <nav aria-label="Main" className="ml-6 hidden items-center gap-1 md:flex">
          {links}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {isMember && (
            <Link to={isLoggedIn ? "/profile" : "/"} className="royal-badge" aria-label="You are a Royal Member">
              <CrownIcon className="size-4 text-gold-400" />
              <span className="hidden sm:inline">Royal Member</span>
            </Link>
          )}
          {themeButton}
          <div className="hidden items-center gap-2 md:flex">{account}</div>
          <Link to="/cart" aria-label={`Cart, ${itemCount} items`} className="relative flex size-11 items-center justify-center rounded-full hover:bg-sunken md:hidden">
            <CartIcon />
            {itemCount > 0 && (
              <span className="absolute right-0.5 top-0.5 min-w-5 rounded-full bg-crimson-600 px-1 text-center text-[11px] font-semibold leading-5 text-white">{itemCount}</span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex size-11 items-center justify-center rounded-full hover:bg-sunken md:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </Container>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-page md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            <nav aria-label="Mobile" className="flex flex-col gap-1" onClick={() => setOpen(false)}>
              {links}
            </nav>
            <div className="mt-2 flex flex-col gap-2 border-t border-line pt-3 [&>*]:w-full" onClick={(e) => e.target instanceof HTMLAnchorElement && setOpen(false)}>
              {account}
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
