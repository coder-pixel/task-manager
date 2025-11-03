"use client";

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
import useRegister from "@/hooks/useRegister";

export default function RegisterPage() {
  const { formFields, errors, loading, handleOnChange, handleSubmit } =
    useRegister();

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

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formFields?.email}
                onChange={(e) => handleOnChange("email", e.target.value)}
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
                onChange={(e) => handleOnChange("password", e.target.value)}
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
                  handleOnChange("confirmPassword", e.target.value)
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
