"use client";

import { useRouter } from "next/navigation";
import { Container, Box, Button, Typography, Stack } from "@mui/material";

export default function Home() {
  const router = useRouter();

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
            onClick={() => router.push("/login")}
            className="px-4 py-1.5"
          >
            Sign In
          </Button>

          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => router.push("/register")}
            className="px-4 py-1.5"
          >
            Sign Up
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
