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

export default function DashboardPage() {
  const { user, signOut } = useAuthStore();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
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
            <Button variant="outlined" color="primary" onClick={handleSignOut}>
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
