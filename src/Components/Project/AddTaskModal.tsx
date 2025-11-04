import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { FormFields, Errors } from "@/hooks/useProjectDetails";
import { Task, TaskStatusEnum } from "@/store/projectStore";
import { TASK_STATUSES } from "@/Config";

interface AddTaskModalProps {
  isOpen: boolean;
  data: Task | null;
  formFields: FormFields;
  errors: Errors;
  loading: boolean;
  toggleAddTaskDialog: (isOpen: boolean, data: Task | null) => void;
  handleTaskFormChange: (field: string, value: string) => void;
  handleAddUpdateTask: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  data,
  formFields,
  errors,
  loading,
  toggleAddTaskDialog,
  handleTaskFormChange,
  handleAddUpdateTask,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => !loading && toggleAddTaskDialog(false, null)}
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={handleAddUpdateTask}>
        <DialogTitle>{data?.title ? "Edit Task" : "Add New Task"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <Box>
              <TextField
                fullWidth
                label="Task Title"
                value={formFields?.title}
                onChange={(e) => handleTaskFormChange("title", e.target.value)}
                disabled={loading}
              />
              {errors?.title ? (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors?.title}
                </Typography>
              ) : null}
            </Box>

            <Box>
              <TextField
                fullWidth
                select
                label="Status"
                value={formFields?.status}
                onChange={(e) => handleTaskFormChange("status", e.target.value)}
                disabled={loading}
              >
                {TASK_STATUSES?.map((status: TaskStatusEnum) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
              {errors?.status ? (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors?.status}
                </Typography>
              ) : null}
            </Box>

            <Box>
              <TextField
                fullWidth
                type="date"
                label="Due Date (Optional)"
                value={formFields?.dueDate}
                onChange={(e) =>
                  handleTaskFormChange("dueDate", e.target.value)
                }
                disabled={loading}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => toggleAddTaskDialog(false, null)}
            disabled={loading}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {data ? "Update Task" : "Create Task"}{" "}
            {loading ? (
              <span style={{ marginLeft: 8 }}>
                <CircularProgress size={18} color="inherit" />
              </span>
            ) : null}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddTaskModal;
