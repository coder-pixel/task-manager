"use client";

import React, { useTransition } from "react";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  IconButton,
  Grid,
  Paper,
} from "@mui/material";
import { ArrowBack, Delete, Add, Edit } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import useProjectDetails from "@/hooks/useProjectDetails";
import AddTaskModal from "@/Components/Project/AddTaskModal";
import { TASK_STATUSES } from "@/Config";
import { Task, TaskStatusEnum } from "@/store/projectStore";

// const _getStatusColor = (status: TaskStatusEnum) => {
//   switch (status) {
//     case TaskStatusEnum.TODO:
//       return "default";
//     case TaskStatusEnum.IN_PROGRESS:
//       return "primary";
//     case TaskStatusEnum.DONE:
//       return "success";
//     default:
//       return "default";
//   }
// };

const ProjectPage = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const {
    project,
    loading,
    formFields,
    errors,
    openTaskDialog,
    toggleAddTaskDialog,
    handleTaskFormChange,
    handleAddUpdateTask,
    handleUpdateTaskStatus,
    handleDeleteTaskAlert,
  } = useProjectDetails(projectId);

  const [loadingTransition, startTransition] = useTransition();

  // only show loading if project is not fetched yet and loading is true
  if (!project && loading?.fetchLoading) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "70vh",
            px: { xs: 2, sm: 0 },
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!project && !loading?.fetchLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 4, sm: 6, md: 8 }, px: { xs: 2, sm: 0 } }}>
          <Card>
            <CardContent sx={{ p: { xs: 3, sm: 4 }, textAlign: "center" }}>
              <Typography
                variant="h6"
                color="error"
                gutterBottom
                sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
              >
                Project not found
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push("/dashboard")}
                sx={{
                  mt: 2,
                  width: { xs: "100%", sm: "auto" },
                  minWidth: { sm: "200px" },
                }}
              >
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  }

  // Group tasks by status
  const tasksByStatus = {
    [TaskStatusEnum.TODO]:
      project?.tasks?.filter((task) => task?.status === TaskStatusEnum.TODO) ||
      [],
    [TaskStatusEnum.IN_PROGRESS]:
      project?.tasks?.filter(
        (task) => task?.status === TaskStatusEnum.IN_PROGRESS
      ) || [],
    [TaskStatusEnum.DONE]:
      project?.tasks?.filter((task) => task?.status === TaskStatusEnum.DONE) ||
      [],
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 0 } }}>
        {/* Header */}
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <Button
            startIcon={
              loadingTransition ? <CircularProgress size={20} /> : <ArrowBack />
            }
            onClick={() => startTransition(() => router.push("/dashboard"))}
            sx={{ mb: 2 }}
            disabled={loadingTransition}
          >
            Back to Dashboard
          </Button>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              gap: { xs: 2, md: 0 },
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "baseline" },
                  justifyContent: "space-between",
                  gap: { xs: 2, sm: 0 },
                  mb: { xs: 2, sm: 0 },
                }}
              >
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
                  }}
                >
                  {project?.projectName || "N/A"}
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  onClick={() => toggleAddTaskDialog(true, null)}
                  disabled={loading?.submitLoading}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    minWidth: { sm: "150px" },
                  }}
                >
                  Add Task
                </Button>
              </Box>

              <Typography
                variant="body1"
                color="text.secondary"
                gutterBottom
                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
              >
                {project?.description || "N/A"}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
              >
                Created:{" "}
                {project?.createdAt
                  ? new Date(project?.createdAt).toLocaleDateString()
                  : "N/A"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Task Statistics */}
        <Grid
          container
          spacing={{ xs: 1.5, sm: 2 }}
          sx={{ mb: { xs: 3, sm: 4 } }}
        >
          <Grid item xs={12} sm={4}>
            <Paper
              sx={{
                p: { xs: 1.5, sm: 2 },
                textAlign: "center",
                bgcolor: "grey.800",
                color: "primary.contrastText",
              }}
            >
              <Typography
                variant="h4"
                color="inherit"
                sx={{ fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
              >
                {tasksByStatus[TaskStatusEnum.TODO]?.length || 0}
              </Typography>
              <Typography
                variant="body2"
                color="primary.contrastText"
                sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
              >
                To Do
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper
              sx={{
                p: { xs: 1.5, sm: 2 },
                textAlign: "center",
                bgcolor: "primary.light",
                color: "primary.contrastText",
              }}
            >
              <Typography
                variant="h4"
                color="inherit"
                sx={{
                  fontSize: { xs: "1.75rem", sm: "2.125rem" },
                  color: "inherit",
                }}
              >
                {tasksByStatus[TaskStatusEnum.IN_PROGRESS]?.length || 0}
              </Typography>
              <Typography
                variant="body2"
                color="inherit"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  color: "inherit",
                }}
              >
                In Progress
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper
              sx={{
                p: { xs: 1.5, sm: 2 },
                textAlign: "center",
                bgcolor: "success.light",
                color: "success.contrastText",
              }}
            >
              <Typography
                variant="h4"
                color="inherit"
                sx={{
                  fontSize: { xs: "1.75rem", sm: "2.125rem" },
                  color: "inherit",
                }}
              >
                {tasksByStatus[TaskStatusEnum.DONE]?.length || 0}
              </Typography>
              <Typography
                variant="body2"
                color="inherit"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  color: "inherit",
                }}
              >
                Done
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Tasks List */}
        <Typography
          variant="h5"
          component="h2"
          className="mb-2 sm:mb-3 text-lg sm:text-xl"
        >
          Tasks
        </Typography>

        {project?.tasks && project?.tasks?.length > 0 ? (
          <Box className="flex gap-2 flex-wrap">
            {project?.tasks?.map((task) => (
              <Card
                key={task?.id}
                className="mx-auto mb-2"
                sx={{
                  transition: "box-shadow 0.2s",
                  "&:hover": {
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent className="md:w-[350px] w-[300px] flex flex-col justify-between items-start h-full">
                  <Typography
                    variant="h6"
                    gutterBottom
                    className="text-lg font-bold w-full mb-2 text-wrap"
                  >
                    {task?.title || "N/A"}
                  </Typography>

                  <Box className="flex flex-col justify-between items-start gap-2 w-full">
                    <Box
                      className="w-full"
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", sm: "center" },
                        flexWrap: "wrap",
                        gap: { xs: 0.5, sm: 0 },
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mr: { sm: 2 }, mb: { xs: 0.5, sm: 0 } }}
                      >
                        Created:{" "}
                        {task?.createdAt
                          ? new Date(task?.createdAt).toLocaleDateString()
                          : "N/A"}
                      </Typography>

                      {task?.dueDate && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: { sm: 2 }, mb: { xs: 0.5, sm: 0 } }}
                        >
                          Due:{" "}
                          {task?.dueDate
                            ? new Date(task?.dueDate).toLocaleDateString()
                            : "N/A"}
                        </Typography>
                      )}
                    </Box>

                    <Box className="flex justify-between items-start w-full">
                      <>
                        <Select
                          value={task?.status || "N/A"}
                          onChange={(e) =>
                            handleUpdateTaskStatus(
                              task?.id || "",
                              e.target.value
                            )
                          }
                          title="Update Task Status"
                          size="small"
                          disabled={!!loading?.statusUpdateLoading}
                          sx={{ minWidth: 140 }}
                          color="primary"
                        >
                          {TASK_STATUSES?.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                        {loading?.statusUpdateLoading === task?.id ? (
                          <CircularProgress size={20} />
                        ) : null}
                      </>

                      <div>
                        <IconButton
                          color="primary"
                          onClick={() => toggleAddTaskDialog(true, task)}
                          disabled={loading?.submitLoading || !task?.id}
                          title="Edit Task"
                        >
                          <Edit />
                        </IconButton>

                        <IconButton
                          color="error"
                          onClick={() => handleDeleteTaskAlert(task?.id || "")}
                          disabled={loading?.deleteLoading || !task?.id}
                          title="Delete Task"
                        >
                          <Delete />
                        </IconButton>
                      </div>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Card>
            <CardContent sx={{ p: { xs: 3, sm: 4 }, textAlign: "center" }}>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
              >
                No tasks yet. Create your first task to get started!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => toggleAddTaskDialog(true, null)}
                sx={{
                  mt: 2,
                  width: { xs: "100%", sm: "auto" },
                  minWidth: { sm: "150px" },
                }}
              >
                Add Task
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>

      <AddTaskModal
        isOpen={openTaskDialog?.isOpen}
        data={openTaskDialog?.data}
        formFields={formFields}
        errors={errors}
        loading={loading?.submitLoading}
        toggleAddTaskDialog={(isOpen: boolean, data: Task | null) =>
          toggleAddTaskDialog(isOpen, data)
        }
        handleTaskFormChange={handleTaskFormChange}
        handleAddUpdateTask={handleAddUpdateTask}
      />
    </Container>
  );
};

export default ProjectPage;
