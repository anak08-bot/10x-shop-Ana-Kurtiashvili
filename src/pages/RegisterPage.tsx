import { useFormik } from "formik";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthShell } from "../components/ui/AuthShell";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import type { RegisterFormValues } from "../types/user";
import { getFrom } from "../utils/routerState";
import { registerSchema } from "../utils/schemas";

export default function RegisterPage() {
  const { register, isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = getFrom(location.state);

  const formik = useFormik<RegisterFormValues>({
    initialValues: { firstName: "", lastName: "", username: "", email: "", password: "", confirmPassword: "" },
    validationSchema: registerSchema,
    onSubmit: (values, helpers) => {
      const result = register({
        username: values.username,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: "",
      });
      if (!result.ok) {
        helpers.setFieldError("username", result.message);
        return;
      }
      showToast(`Welcome to 10X Shop, ${values.firstName.trim()}!`);
      navigate(from ?? "/", { replace: true });
    },
  });

  if (isLoggedIn) return <Navigate to={from ?? "/"} replace />;

  const error = (name: keyof RegisterFormValues) => (formik.touched[name] ? formik.errors[name] : undefined);
  const field = (name: keyof RegisterFormValues) => ({
    name,
    value: formik.values[name],
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: error(name),
  });

  return (
    <AuthShell
      title="Create your account"
      subtitle="It takes a minute and makes checkout faster."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" state={location.state} className="font-semibold text-crimson-600 underline underline-offset-2 dark:text-crimson-500">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="First name" autoComplete="given-name" {...field("firstName")} />
          <FormField label="Last name" autoComplete="family-name" {...field("lastName")} />
        </div>
        <FormField label="Username" autoComplete="username" {...field("username")} />
        <FormField label="Email" type="email" autoComplete="email" {...field("email")} />
        <FormField label="Password" type="password" autoComplete="new-password" hint="At least 6 characters." {...field("password")} />
        <FormField label="Confirm password" type="password" autoComplete="new-password" {...field("confirmPassword")} />
        <Button type="submit" fullWidth disabled={formik.isSubmitting}>
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
