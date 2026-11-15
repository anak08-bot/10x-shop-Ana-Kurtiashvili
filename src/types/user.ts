export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

/** A locally registered account. No password is ever stored. */
export interface StoredAccount extends UserProfile {
  username: string;
}

export interface AuthUser extends StoredAccount {
  isLoggedIn: boolean;
}

export interface LoginFormValues {
  username: string;
  password: string;
}

export interface RegisterFormValues {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/** Editable part of the profile (utility type: Pick). */
export type ProfileForm = Pick<AuthUser, "firstName" | "lastName" | "email" | "phone">;
