"use client";

import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  Button,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useTransition } from "react";

export default function Home() {
  const router = useRouter();

  const [loadingLoginTransition, startLoginTransition] = useTransition();
  const [loadingRegisterTransition, startRegisterTransition] = useTransition();

  return (
    <Container maxWidth="md">
      <Box className="flex min-h-screen flex-col items-center justify-center text-center py-4">
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          className="font-bold mb-2"
        >
          Task Manager
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          className="mb-6 max-w-600px"
        >
          Organize your tasks efficiently and boost your productivity
        </Typography>

        <Stack direction="row" gap={2} className="mt-2">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => startLoginTransition(() => router.push("/login"))}
            className="px-4 py-1.5"
            disabled={loadingLoginTransition}
          >
            Sign In
            {loadingLoginTransition ? (
              <CircularProgress size={16} className="ml-2 text-white" />
            ) : null}
          </Button>

          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() =>
              startRegisterTransition(() => router.push("/register"))
            }
            className="px-4 py-1.5"
            disabled={loadingRegisterTransition}
          >
            Sign Up
            {loadingRegisterTransition ? (
              <CircularProgress size={16} className="ml-2 text-white" />
            ) : null}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
