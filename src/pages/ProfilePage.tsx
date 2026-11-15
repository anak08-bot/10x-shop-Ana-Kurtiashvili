import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { FormField } from "../components/ui/FormField";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";
import { useRoyal } from "../context/RoyalContext";
import { CrownIcon } from "../components/ui/icons";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import { reviewsStorage } from "../models/storage";
import type { ProfileForm } from "../types/user";
import { validateProfile } from "../utils/validation";

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const { clearCart } = useCart();
  const { orders, clearOrders } = useOrders();
  const { theme, toggleTheme } = useTheme();
  const { isMember, since, purchases } = useRoyal();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [values, setValues] = useState<ProfileForm>({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  });
  const [submitted, setSubmitted] = useState(false);
  const errors = validateProfile(values);

  const bind = (name: keyof ProfileForm) => ({
    name,
    value: values[name],
    error: submitted ? errors[name] : undefined,
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValues((v) => ({ ...v, [name]: value }));
    },
  });

  function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    updateProfile({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
    });
    setSubmitted(false);
    showToast("Profile updated ✓");
  }

  function handleClearData() {
    if (!window.confirm("Clear your cart, orders and reviews? You will stay logged in.")) return;
    clearCart();
    clearOrders();
    reviewsStorage.remove();
    showToast("Local data cleared", "info");
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  if (!user) return null; // ProtectedRoute guarantees a user; this keeps TypeScript honest

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">Your profile</h1>
        <p className="mt-1 text-muted">
          Signed in as <span className="font-semibold text-ink">{user.username}</span>. You have {orders.length} {orders.length === 1 ? "order" : "orders"}.
        </p>
      </div>

      <Card className="flex items-center gap-4 p-5 sm:p-7">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-gold-500 bg-linear-to-b from-crimson-600 to-crimson-900 text-gold-300">
          <CrownIcon className="size-8" />
        </span>
        <div>
          <h2 className="font-display text-xl font-semibold">{isMember ? "Royal Member" : "Commoner, for now"}</h2>
          <p className="text-sm text-muted">
            {isMember && since
              ? `Crowned on ${new Date(since).toLocaleDateString()} · ${purchases} ${purchases === 1 ? "royal purchase" : "royal purchases"}.`
              : "Make your first purchase and be crowned a Royal Member."}
          </p>
        </div>
      </Card>

      <form onSubmit={handleSave} noValidate>
        <Card className="space-y-4 p-5 sm:p-7">
          <h2 className="font-display text-xl font-semibold">Personal details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="First name" autoComplete="given-name" {...bind("firstName")} />
            <FormField label="Last name" autoComplete="family-name" {...bind("lastName")} />
          </div>
          <FormField label="Email" type="email" autoComplete="email" {...bind("email")} />
          <FormField label="Phone (optional)" type="tel" autoComplete="tel" {...bind("phone")} />
          <Button type="submit">Save changes</Button>
        </Card>
      </form>

      <Card className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-7">
        <div>
          <h2 className="font-display text-xl font-semibold">Appearance</h2>
          <p className="text-sm text-muted">Currently using the {theme} theme.</p>
        </div>
        <Button variant="secondary" onClick={toggleTheme}>
          Switch to {theme === "dark" ? "light" : "dark"}
        </Button>
      </Card>

      <Card className="space-y-4 p-5 sm:p-7">
        <h2 className="font-display text-xl font-semibold">Your data</h2>
        <p className="text-sm text-muted">Everything is stored in this browser only. Clearing it removes your cart, orders and reviews. Your login and theme stay.</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="danger" onClick={handleClearData}>
            Clear local data
          </Button>
          <Button variant="secondary" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </Card>
    </div>
  );
}
