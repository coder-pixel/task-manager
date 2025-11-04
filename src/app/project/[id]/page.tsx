"use client";

import React from "react";
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
  Chip,
  Grid,
  Paper,
} from "@mui/material";
import { ArrowBack, Delete, Add, Edit } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import useProjectDetails from "@/hooks/useProjectDetails";
import AddTaskModal from "@/Components/Project/AddTaskModal";
import { TASK_STATUSES } from "@/Config";
import { Task, TaskStatusEnum } from "@/store/projectStore";

const _getStatusColor = (status: TaskStatusEnum) => {
  switch (status) {
    case TaskStatusEnum.TODO:
      return "default";
    case TaskStatusEnum.IN_PROGRESS:
      return "primary";
    case TaskStatusEnum.DONE:
      return "success";
    default:
      return "default";
  }
};

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
        <Box sx={{ py: 8 }}>
          <Card>
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="error" gutterBottom>
                Project not found
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push("/dashboard")}
                sx={{ mt: 2 }}
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
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push("/dashboard")}
            sx={{ mb: 2 }}
          >
            Back to Dashboard
          </Button>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Box className="flex items-baseline justify-between">
                <Typography variant="h4" component="h1" gutterBottom>
                  {project?.projectName || "N/A"}
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  className="w-[200px]"
                  startIcon={<Add />}
                  onClick={() => toggleAddTaskDialog(true, null)}
                  disabled={loading?.submitLoading}
                >
                  Add Task
                </Button>
              </Box>

              <Typography variant="body1" color="text.secondary" gutterBottom>
                {project?.description || "N/A"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Created:{" "}
                {project?.createdAt
                  ? new Date(project?.createdAt).toLocaleDateString()
                  : "N/A"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Task Statistics */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h4" color="text.secondary">
                {tasksByStatus[TaskStatusEnum.TODO]?.length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                To Do
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h4" color="primary">
                {tasksByStatus[TaskStatusEnum.IN_PROGRESS]?.length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In Progress
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h4" color="success.main">
                {tasksByStatus[TaskStatusEnum.DONE]?.length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Done
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Tasks List */}
        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
          Tasks
        </Typography>

        {project?.tasks && project?.tasks?.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {project?.tasks?.map((task) => (
              <Card
                key={task.id}
                sx={{
                  transition: "box-shadow 0.2s",
                  "&:hover": {
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {task?.title || "N/A"}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          flexWrap: "wrap",
                        }}
                      >
                        <Chip
                          label={task?.status || "N/A"}
                          color={_getStatusColor(task?.status)}
                          size="small"
                        />
                        {task?.dueDate && (
                          <Typography variant="caption" color="text.secondary">
                            Due:{" "}
                            {task?.dueDate
                              ? new Date(task?.dueDate).toLocaleDateString()
                              : "N/A"}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          Created:{" "}
                          {task?.createdAt
                            ? new Date(task?.createdAt).toLocaleDateString()
                            : "N/A"}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <>
                        <Select
                          value={task?.status || "N/A"}
                          onChange={(e) =>
                            handleUpdateTaskStatus(
                              task?.id || "",
                              e.target.value
                            )
                          }
                          size="small"
                          disabled={!!loading?.statusUpdateLoading}
                          sx={{ minWidth: 140 }}
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

                      <IconButton
                        color="primary"
                        onClick={() => toggleAddTaskDialog(true, task)}
                        disabled={loading?.submitLoading || !task?.id}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteTaskAlert(task?.id || "")}
                        disabled={loading?.deleteLoading || !task?.id}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Card>
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                No tasks yet. Create your first task to get started!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => toggleAddTaskDialog(true, null)}
                sx={{ mt: 2 }}
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
