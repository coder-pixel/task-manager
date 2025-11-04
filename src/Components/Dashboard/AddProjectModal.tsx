import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { Errors, FormFields } from "@/hooks/useDashboard";

const AddProjectModal = ({
  isOpen,
  projectForm,
  errors,
  loading,
  toggleAddProjectDialog,
  handleProjectFormChange,
  handleCreateProject,
}: {
  isOpen: boolean;
  projectForm: FormFields;
  errors: Errors;
  loading: boolean;
  toggleAddProjectDialog: (isOpen: boolean, data: null) => void;
  handleProjectFormChange: (field: string, value: string) => void;
  handleCreateProject: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => toggleAddProjectDialog(false, null)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Add New Project</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Project Name"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={projectForm?.projectName}
            onChange={(e) =>
              handleProjectFormChange("projectName", e.target.value)
            }
            placeholder="Enter project name"
          />
          {errors?.projectName && (
            <Typography variant="body2" color="error" sx={{ fontSize: "12px" }}>
              {errors?.projectName}
            </Typography>
          )}

          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={projectForm?.description}
            onChange={(e) =>
              handleProjectFormChange("description", e.target.value)
            }
            placeholder="Enter project description"
          />
          {errors?.description && (
            <Typography variant="body2" color="error" sx={{ fontSize: "12px" }}>
              {errors?.description}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={() => toggleAddProjectDialog(false, null)}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
            handleCreateProject(
              e as unknown as React.FormEvent<HTMLFormElement>
            )
          }
          variant="contained"
          color="primary"
          disabled={loading}
        >
          Create Project
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProjectModal;
