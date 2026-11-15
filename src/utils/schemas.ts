import * as yup from "yup";

// Yup validation schemas used by Formik (Login and Register forms).

const passwordRule = yup
  .string()
  .required("Password is required")
  .test(
    "min-length",
    "Password must be at least 6 characters",
    (value) => value === undefined || value.length === 0 || value.length >= 6,
  );

export const loginSchema = yup.object({
  username: yup.string().trim().required("Username is required"),
  password: passwordRule,
});

export const registerSchema = yup.object({
  firstName: yup.string().trim().required("First name is required").min(2, "First name must be at least 2 characters"),
  lastName: yup.string().trim().required("Last name is required").min(2, "Last name must be at least 2 characters"),
  username: yup
    .string()
    .trim()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .matches(/^[A-Za-z0-9_.-]+$/, "Use letters, numbers, dots, dashes or underscores only"),
  email: yup.string().trim().required("Email is required").email("Please enter a valid email address"),
  password: passwordRule,
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});
