"use client";

import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import { capitalizeFirstLetter } from "../../helper-methods";
import useDashboard from "@/hooks/useDashboard";
import AddProjectModal from "@/Components/Dashboard/AddProjectModal";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function DashboardPage() {
  const router = useRouter();

  const {
    user,
    projects,
    openProjectDialog,
    projectForm,
    loading,
    errors,
    handleSignOutAlert,
    toggleAddProjectDialog,
    handleProjectFormChange,
    handleCreateProject,
  } = useDashboard();

  const [loadingTransition, startTransition] = useTransition();

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1">
            Dashboard
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => toggleAddProjectDialog(true, null)}
            >
              Add New Project
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleSignOutAlert}
            >
              Sign Out
            </Button>
          </Box>
        </Box>

        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Welcome,{" "}
              {user?.email
                ? capitalizeFirstLetter(user?.email?.split("@")[0])
                : "User"}
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
          Your Projects ({projects?.length ?? ""})
        </Typography>

        {projects && projects?.length > 0 ? (
          <Grid container spacing={3}>
            {projects?.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project?.id}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: "10px",
                    transition: "box-shadow 0.2s, transform 0.2s",
                    boxShadow: 2,
                    "&:hover": {
                      boxShadow: 8,
                      transform: "translateY(-4px) scale(1.03)",
                    },
                  }}
                  // onClick={() => router.push(`/project/${project?.id}`)}
                >
                  <CardContent
                    title="Click to view project tasks"
                    className="flex flex-col justify-between h-full"
                  >
                    <Box className="flex flex-col justify-start h-full">
                      <Box className="flex items-baseline justify-between">
                        <Typography variant="h6" component="h3" gutterBottom>
                          {project?.projectName || "N/A"}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          Total Tasks: {project?.totalTasks || 0}
                        </Typography>
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {project?.description || "N/A"}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between ",
                        alignItems: "baseline",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Created:{" "}
                        {new Date(project?.createdAt)?.toLocaleDateString()}
                      </Typography>

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          startTransition(() =>
                            router.push(`/project/${project?.id}`)
                          )
                        }
                        className="p-0 text-primary"
                        disabled={loadingTransition}
                      >
                        Manage Tasks{" "}
                        {loadingTransition ? (
                          <CircularProgress size={20} className="ml-2" />
                        ) : null}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card>
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                No projects yet. Create your first project to get started!
              </Typography>
            </CardContent>
          </Card>
        )}
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
