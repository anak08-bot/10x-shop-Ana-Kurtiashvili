import { useFormik } from "formik";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthShell } from "../components/ui/AuthShell";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { useAuth } from "../context/AuthContext";
import type { LoginFormValues } from "../types/user";
import { loginSchema } from "../utils/schemas";
import { getFrom } from "../utils/routerState";

export default function LoginPage() {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = getFrom(location.state);

  // Formik owns the form state; the Yup schema owns the validation rules.
  const formik = useFormik<LoginFormValues>({
    initialValues: { username: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      login(values.username);
      navigate(from ?? "/", { replace: true }); // back to /checkout if that is where the user came from
    },
  });

  if (isLoggedIn) return <Navigate to={from ?? "/"} replace />;

  const error = (name: keyof LoginFormValues) => (formik.touched[name] ? formik.errors[name] : undefined);

  return (
    <AuthShell
      title="Welcome back"
      subtitle={from ? "Log in to continue where you left off." : "Log in to check out and see your orders."}
      footer={
        <>
          New here?{" "}
          <Link to="/register" state={location.state} className="font-semibold text-crimson-600 underline underline-offset-2 dark:text-crimson-500">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
        <FormField
          label="Username"
          name="username"
          autoComplete="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={error("username")}
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={error("password")}
          hint="Demo shop: any username works with a password of 6+ characters (e.g. emilys / emilyspass)."
        />
        <Button type="submit" fullWidth disabled={formik.isSubmitting}>
          Log In
        </Button>
      </form>
    </AuthShell>
  );
}
