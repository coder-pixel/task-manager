"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
} from "@mui/material";
import { REGEX_CONFIG } from "../Config/RegexConfig";
import { errorToast, successToast } from "../helper-methods/Toaster";
import { useAuthStore } from "@/store/authStore";

const initialFormFields = {
  email: "",
  password: "",
  confirmPassword: "",
};
const initialIsDirty = {
  email: false,
  password: false,
  confirmPassword: false,
};
const initialErrors = {
  email: null as string | null,
  password: null as string | null,
  confirmPassword: null as string | null,
};

type FormFields = typeof initialFormFields;
type IsDirty = typeof initialIsDirty;
type Errors = typeof initialErrors;

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuthStore();

  const [formFields, setFormFields] = useState<FormFields>(initialFormFields);
  const [isDirty, setIsDirty] = useState<IsDirty>(initialIsDirty);
  const [errors, setErrors] = useState<Errors>(initialErrors);

  const [loading, setLoading] = useState(false);

  const _handleOnChange = (key: keyof FormFields, value: string) => {
    const newFormFields = { ...formFields, [key]: value };
    const newIsDirty = { ...isDirty, [key]: true };

    setFormFields(newFormFields);
    setIsDirty(newIsDirty);

    _validateFormFields({ newFormFields, newIsDirty });
  };

  const _validateFormFields = ({
    newFormFields,
    newIsDirty,
  }: {
    newFormFields: FormFields;
    newIsDirty: IsDirty;
  }) => {
    return new Promise((resolve) => {
      const newErrors = { ...errors };
      let isFormValid = true;

      Object.keys(newFormFields)?.forEach((key: string) => {
        if (newIsDirty[key as keyof IsDirty]) {
          switch (key) {
            case "email":
              if (!newFormFields[key]?.trim()?.length) {
                newErrors[key] = "*Email is required";
                isFormValid = false;
              } else if (!REGEX_CONFIG?.email?.test(newFormFields?.[key])) {
                newErrors[key] = "*Invalid email";
                isFormValid = false;
              } else {
                newErrors[key] = null;
                newIsDirty[key] = false;
              }
              break;

            case "password":
              if (!newFormFields?.[key]?.trim()?.length) {
                newErrors[key] = "*Password is required";
                isFormValid = false;
              } else if (!REGEX_CONFIG?.password?.test(newFormFields[key])) {
                newErrors[key] = "*Invalid password";
                isFormValid = false;
              } else {
                newErrors[key] = null;
                newIsDirty[key] = false;
              }
              break;

            case "confirmPassword":
              if (!newFormFields?.[key]?.trim()?.length) {
                newErrors[key] = "*Confirm password is required";
                isFormValid = false;
              } else if (newFormFields?.[key] !== newFormFields?.["password"]) {
                newErrors[key] = "*Passwords do not match";
                isFormValid = false;
              } else {
                newErrors[key] = null;
                newIsDirty[key] = false;
              }
              break;
            default:
              break;
          }
        }
      });

      setErrors(newErrors);
      setIsDirty(newIsDirty);

      resolve(isFormValid);
    });
  };

  const _markAllIsDirty = async (): Promise<IsDirty> => {
    return new Promise((resolve) => {
      Object.keys(isDirty)?.forEach((key: string) => {
        isDirty[key as keyof IsDirty] = true;
      });

      setIsDirty(isDirty);
      resolve(isDirty);
    });
  };

  const _handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      if (e) e.preventDefault();
      setLoading(true);

      const newFormFields = { ...formFields };
      const newIsDirty = await _markAllIsDirty();

      const isFormValid = await _validateFormFields({
        newFormFields,
        newIsDirty,
      });

      console.log({ isFormValid });

      // return if form not valid
      if (!isFormValid) return;

      // sign up via API route
      await signUp(formFields.email, formFields.password);

      successToast("Registered Successfully");
      // redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      errorToast(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box className="min-h-screen flex items-center justify-center py-4">
        <Card sx={{ width: "100%", boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              align="center"
              sx={{ mb: 3, fontWeight: "bold" }}
            >
              Create Account
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mb: 4 }}
            >
              Sign up to get started
            </Typography>

            <Box component="form" onSubmit={_handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formFields?.email}
                onChange={(e) => _handleOnChange("email", e.target.value)}
                margin="normal"
                required
                autoComplete="email"
                autoFocus
              />
              {errors?.email && (
                <Typography
                  variant="body2"
                  color="error"
                  sx={{ fontSize: "12px" }}
                  className="mt-1"
                >
                  {errors?.email}
                </Typography>
              )}

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formFields?.password}
                onChange={(e) => _handleOnChange("password", e.target.value)}
                margin="normal"
                required
                autoComplete="new-password"
                // helperText="Must be at least 6 characters"
              />
              {errors?.password && (
                <Typography
                  variant="body2"
                  color="error"
                  sx={{ fontSize: "12px" }}
                  className="mt-1"
                >
                  {errors?.password}
                </Typography>
              )}

              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={formFields?.confirmPassword}
                onChange={(e) =>
                  _handleOnChange("confirmPassword", e.target.value)
                }
                margin="normal"
                required
                autoComplete="new-password"
              />
              {errors?.confirmPassword && (
                <Typography
                  variant="body2"
                  color="error"
                  sx={{ fontSize: "12px" }}
                  className="mt-1"
                >
                  {errors?.confirmPassword}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading}
              >
                Sign Up{" "}
                {loading ? (
                  <CircularProgress size={16} className="ml-2 text-white" />
                ) : null}
              </Button>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    underline="hover"
                    sx={{ cursor: "pointer", fontWeight: "medium" }}
                  >
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
