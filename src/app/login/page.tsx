"use client";

import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useLogin from "@/hooks/useLogin";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const { formFields, errors, loading, handleOnChange, handleSubmit } =
    useLogin();

  const [loadingTransition, startTransition] = useTransition();

  return (
    <Container maxWidth="sm">
      <Box className="min-h-screen flex items-center justify-center py-4">
        <Card sx={{ width: "100%", boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 2 }}>
              <IconButton
                onClick={() => router.push("/")}
                size="small"
                sx={{ color: "text.secondary" }}
                aria-label="back to home"
                title="Back to home"
              >
                <ArrowBackIcon />
              </IconButton>
            </Box>

            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              align="center"
              sx={{ mb: 3, fontWeight: "bold" }}
            >
              Sign In
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mb: 4 }}
            >
              Enter your credentials to access your account
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="text"
                value={formFields?.email}
                onChange={(e) => handleOnChange("email", e.target.value)}
                margin="normal"
                autoFocus
                disabled={loading}
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
                autoComplete="current-password"
                disabled={loading}
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                Sign In{" "}
                {loading ? (
                  <CircularProgress size={16} className="ml-2 text-white" />
                ) : null}
              </Button>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Don&apos;t have an account?{" "}
                  <Button
                    variant="text"
                    size="small"
                    onClick={() =>
                      startTransition(() => {
                        router.push("/register");
                      })
                    }
                    disabled={loadingTransition}
                    className="font-medium cursor-pointer text-primary"
                  >
                    Sign up{" "}
                    {loadingTransition ? (
                      <CircularProgress size={16} className="ml-2 text-white" />
                    ) : null}
                  </Button>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
