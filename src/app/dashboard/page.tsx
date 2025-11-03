"use client";

import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { capitalizeFirstLetter } from "../../helper-methods";
import useDashboard from "@/hooks/useDashboard";

export default function DashboardPage() {
  const { user, handleSignOutAlert } = useDashboard();
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
            <Button
              variant="outlined"
              color="primary"
              onClick={handleSignOutAlert}
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
