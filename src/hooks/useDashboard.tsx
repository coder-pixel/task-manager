import { errorToast, successToast } from "@/helper-methods/Toaster";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

const initialFormFields = {
  projectName: "",
  description: "",
};
const initialIsDirty = {
  projectName: false,
  description: false,
};
const initialErrors = {
  projectName: null as string | null,
  description: null as string | null,
};

export type FormFields = typeof initialFormFields;
export type Errors = typeof initialErrors;
type IsDirty = typeof initialIsDirty;

const useDashboard = () => {
  const { user, signOut } = useAuthStore();
  const router = useRouter();

  const [projectForm, setProjectForm] = useState<FormFields>(initialFormFields);
  const [isDirty, setIsDirty] = useState<IsDirty>(initialIsDirty);
  const [errors, setErrors] = useState<Errors>(initialErrors);

  const [loading, setLoading] = useState(false);

  const [openProjectDialog, setOpenProjectDialog] = useState({
    isOpen: false,
    data: null,
  });

  const _toggleAddProjectDialog = (isOpen: boolean, data: null) => {
    setOpenProjectDialog({
      isOpen,
      data,
    });

    _resetFormFields();
  };

  const _resetFormFields = () => {
    setProjectForm(initialFormFields);
    setIsDirty(initialIsDirty);
    setErrors(initialErrors);
  };

  const _handleOnChange = (field: string, value: string) => {
    const newFormFields = { ...projectForm, [field]: value };
    const newIsDirty = { ...isDirty, [field]: true };

    setProjectForm(newFormFields);
    setIsDirty(newIsDirty);

    _validateFormFields({ newFormFields, newIsDirty });
  };

  const _validateFormFields = ({
    newFormFields,
    newIsDirty,
  }: {
    newFormFields: FormFields;
    newIsDirty: IsDirty;
  }) => {
    return new Promise((resolve) => {
      const newErrors = { ...errors };
      let isFormValid = true;

      Object.keys(newFormFields).forEach((key: string) => {
        if (newIsDirty[key as keyof IsDirty]) {
          switch (key) {
            case "projectName":
              if (!newFormFields?.[key]?.trim()?.length) {
                newErrors.projectName = "*Project name is required";
                isFormValid = false;
              } else {
                newErrors.projectName = null;
                newIsDirty[key] = false;
              }
              break;
            case "description":
              if (!newFormFields?.[key]?.trim()?.length) {
                newErrors.description = "*Description is required";
                isFormValid = false;
              } else {
                newErrors.description = null;
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
      Object.keys(isDirty)?.forEach((key: string) => {
        isDirty[key as keyof IsDirty] = true;
      });

      setIsDirty(isDirty);
      resolve(isDirty);
    });
  };

  const _handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      if (e) e.preventDefault();
      setLoading(true);

      const newFormFields = { ...projectForm };
      const newIsDirty = await _markAllIsDirty();

      const isFormValid = await _validateFormFields({
        newFormFields,
        newIsDirty,
      });

      if (!isFormValid) return;

      // create project via API route
      // await createProject(projectForm);

      successToast("Project created successfully");
      _resetFormFields();

      _toggleAddProjectDialog(false, null);
    } catch (error) {
      errorToast(error || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const _handleSignOutAlert = async () => {
    Swal.fire({
      title: "Are you sure you want to sign out?",
      text: "You will be redirected to the login page",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sign Out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result?.isConfirmed) {
        _handleSignOut();
      }
    });
  };

  const _handleSignOut = async () => {
    try {
      await signOut();
      successToast("Signed out successfully");
      router.push("/login");
    } catch (error) {
      errorToast(error || "Failed to sign out");
    }
  };

  return {
    handleSignOutAlert: _handleSignOutAlert,
    user,
    openProjectDialog,
    projectForm,
    loading,
    errors,
    toggleAddProjectDialog: _toggleAddProjectDialog,
    handleProjectFormChange: _handleOnChange,
    handleCreateProject: _handleSubmit,
  };
};

export default useDashboard;
