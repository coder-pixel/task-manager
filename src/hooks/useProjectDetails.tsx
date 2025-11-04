import { errorToast, successToast } from "@/helper-methods/Toaster";
import { Project, Task, TaskStatusEnum } from "@/store/projectStore";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const initialFormFields = {
  title: "",
  dueDate: "",
  status: TaskStatusEnum.TODO,
};

const initialIsDirty = {
  title: false,
  dueDate: false,
  status: false,
};

const initialErrors = {
  title: null as string | null,
  dueDate: null as string | null,
  status: null as string | null,
};

export type FormFields = typeof initialFormFields;
export type Errors = typeof initialErrors;
type IsDirty = typeof initialIsDirty;

const useProjectDetails = (projectId: string) => {
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);

  const [formFields, setFormFields] = useState<FormFields>(initialFormFields);
  const [isDirty, setIsDirty] = useState<IsDirty>(initialIsDirty);
  const [errors, setErrors] = useState<Errors>(initialErrors);

  const [loading, setLoading] = useState<{
    fetchLoading: boolean;
    submitLoading: boolean;
    statusUpdateLoading: string | null;
    deleteLoading: boolean;
  }>({
    fetchLoading: false,
    submitLoading: false,
    statusUpdateLoading: null,
    deleteLoading: false,
  });

  const [openTaskDialog, setOpenTaskDialog] = useState({
    isOpen: false,
    data: null as Task | null,
  });

  const _manageLoading = (
    key: keyof typeof loading,
    value: boolean | string | null
  ) => {
    setLoading((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Fetch project details on mount
  useEffect(() => {
    if (projectId) {
      _fetchProject();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const _fetchProject = async () => {
    try {
      _manageLoading("fetchLoading", true);

      // Get user from localStorage
      const authStorage = localStorage?.getItem("auth-storage");
      const user = authStorage ? JSON.parse(authStorage).state?.user : null;

      if (!user) {
        router.push("/login");
        throw new Error("No user found. Please login again.");
      }

      const response = await fetch(`/api/projects/${projectId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.uid || ""}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch project");
      }

      setProject(data.project);
    } catch (error) {
      errorToast(error || "Failed to fetch project");
    } finally {
      _manageLoading("fetchLoading", false);
    }
  };

  const _toggleAddTaskDialog = (isOpen: boolean, data: Task | null) => {
    setOpenTaskDialog({
      isOpen,
      data,
    });

    if (isOpen && data) {
      setFormFields({
        title: data?.title || "",
        dueDate: data?.dueDate || "",
        status: data?.status || TaskStatusEnum.TODO,
      });
    } else {
      _resetTaskForm();
    }
  };

  const _resetTaskForm = () => {
    setFormFields(initialFormFields);
    setIsDirty(initialIsDirty);
    setErrors(initialErrors);

    setLoading({
      fetchLoading: false,
      submitLoading: false,
      statusUpdateLoading: null,
      deleteLoading: false,
    });
  };

  const _handleTaskFormChange = (field: string, value: string) => {
    const newFormFields = { ...formFields, [field]: value };
    const newIsDirty = { ...isDirty, [field]: true };

    setFormFields(newFormFields);
    setIsDirty(newIsDirty);

    _validateTaskForm({ newFormFields, newIsDirty });
  };

  const _validateTaskForm = ({
    newFormFields,
    newIsDirty,
  }: {
    newFormFields: FormFields;
    newIsDirty: IsDirty;
  }) => {
    return new Promise((resolve) => {
      const newErrors = { ...errors };
      let isFormValid = true;

      Object.keys(newFormFields)?.forEach((key: string) => {
        if (newIsDirty?.[key as keyof IsDirty]) {
          switch (key) {
            case "title":
              if (!newFormFields?.[key]?.trim()?.length) {
                newErrors.title = "*Task title is required";
                isFormValid = false;
              } else {
                newErrors.title = null;
                newIsDirty[key] = false;
              }
              break;
            case "status":
              if (!newFormFields?.[key]?.trim()?.length) {
                newErrors.status = "*Status is required";
                isFormValid = false;
              } else {
                newErrors.status = null;
                newIsDirty[key] = false;
              }
              break;
            default:
              break;
          }
        }
      });

      setErrors(newErrors);
      setIsDirty(newIsDirty);

      resolve(isFormValid);
    });
  };

  const _markAllIsDirty = async (): Promise<IsDirty> => {
    return new Promise((resolve) => {
      const newIsDirty = { ...isDirty };
      Object.keys(newIsDirty).forEach((key: string) => {
        newIsDirty[key as keyof IsDirty] = true;
      });

      setIsDirty(newIsDirty);
      resolve(newIsDirty);
    });
  };

  const _handleAddUpdateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      if (e) e.preventDefault();
      _manageLoading("submitLoading", true);

      const newFormFields = { ...formFields };
      const newIsDirty = await _markAllIsDirty();

      const isFormValid = await _validateTaskForm({
        newFormFields,
        newIsDirty,
      });

      if (!isFormValid) return;

      // Get user from localStorage
      const authStorage = localStorage?.getItem("auth-storage");
      const user = authStorage ? JSON.parse(authStorage).state?.user : null;

      if (!user) {
        throw new Error("No user found. Please login again.");
      }

      let response: Response | null = null;
      if (openTaskDialog?.data) {
        // update task
        response = await fetch(`/api/projects/${projectId}/tasks`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.uid}`,
          },
          body: JSON.stringify({
            taskId: openTaskDialog?.data?.id,
            status: formFields?.status,
            title: formFields?.title,
            dueDate: formFields?.dueDate || null,
          }),
        });
      } else {
        // create task
        response = await fetch(`/api/projects/${projectId}/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.uid || ""}`,
          },
          body: JSON.stringify({
            title: formFields?.title,
            dueDate: formFields?.dueDate || null,
            status: formFields?.status,
          }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create task");
      }

      successToast("Task created successfully");
      _resetTaskForm();
      _toggleAddTaskDialog(false, null);

      // Refresh project to get updated tasks
      await _fetchProject();
    } catch (error) {
      errorToast(error || "Failed to create task");
    } finally {
      _manageLoading("submitLoading", false);
    }
  };

  const _handleUpdateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      _manageLoading("statusUpdateLoading", taskId);

      // Get user from localStorage
      const authStorage = localStorage?.getItem("auth-storage");
      const user = authStorage ? JSON.parse(authStorage).state?.user : null;

      if (!user) {
        throw new Error("No user found. Please login again.");
      }

      const response = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.uid}`,
        },
        body: JSON.stringify({
          taskId,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update task status");
      }

      successToast("Task status updated successfully");

      // Refresh project to get updated tasks
      await _fetchProject();
    } catch (error) {
      errorToast(error || "Failed to update task status");
    } finally {
      _manageLoading("statusUpdateLoading", null);
    }
  };

  const _handleDeleteTaskAlert = async (taskId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete this task?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    }).then(async (result) => {
      if (result?.isConfirmed) {
        await _handleDeleteTask(taskId);
      }
    });
  };

  const _handleDeleteTask = async (taskId: string) => {
    try {
      _manageLoading("deleteLoading", true);

      // Get user from localStorage
      const authStorage = localStorage?.getItem("auth-storage");
      const user = authStorage ? JSON.parse(authStorage).state?.user : null;

      if (!user) {
        throw new Error("No user found. Please login again.");
      }

      const response = await fetch(
        `/api/projects/${projectId}/tasks?taskId=${taskId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.uid || ""}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete task");
      }

      successToast("Task deleted successfully");

      // Refresh project to get updated tasks
      await _fetchProject();
    } catch (error) {
      errorToast(error || "Failed to delete task");
    } finally {
      _manageLoading("deleteLoading", false);
    }
  };

  return {
    project,
    loading,
    formFields,
    errors,
    openTaskDialog,
    toggleAddTaskDialog: _toggleAddTaskDialog,
    handleTaskFormChange: _handleTaskFormChange,
    handleAddUpdateTask: _handleAddUpdateTask,
    handleUpdateTaskStatus: _handleUpdateTaskStatus,
    handleDeleteTaskAlert: _handleDeleteTaskAlert,
  };
};

export default useProjectDetails;
