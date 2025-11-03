"use client";

import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { useAuthStore } from "@/store/authStore";
import { capitalizeFirstLetter } from "../helper-methods";
import { errorToast, successToast } from "../helper-methods/Toaster";

export default function DashboardPage() {
  const { user, signOut } = useAuthStore();
  const router = useRouter();

  const _handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
      successToast("Signed out successfully");
    } catch (error) {
      errorToast(error || "Failed to sign out");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Welcome,{" "}
              {user?.email
                ? capitalizeFirstLetter(user?.email?.split("@")[0])
                : "User"}
            </Typography>
            <Button variant="outlined" color="primary" onClick={_handleSignOut}>
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
