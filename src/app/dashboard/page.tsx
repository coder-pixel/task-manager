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
import AddProjectModal from "@/Components/Dashboard/AddProjectModal";

export default function DashboardPage() {
  const {
    user,
    openProjectDialog,
    projectForm,
    loading,
    errors,
    handleSignOutAlert,
    toggleAddProjectDialog,
    handleProjectFormChange,
    handleCreateProject,
  } = useDashboard();

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => toggleAddProjectDialog(true, null)}
          >
            Add New Project
          </Button>
        </Box>

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

      <AddProjectModal
        isOpen={openProjectDialog?.isOpen}
        projectForm={projectForm}
        errors={errors}
        loading={loading}
        toggleAddProjectDialog={toggleAddProjectDialog}
        handleProjectFormChange={handleProjectFormChange}
        handleCreateProject={(e) => handleCreateProject(e)}
      />
    </Container>
  );
}
