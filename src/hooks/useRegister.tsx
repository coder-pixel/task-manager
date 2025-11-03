import { REGEX_CONFIG } from "@/Config/RegexConfig";
import { errorToast, successToast } from "@/helper-methods/Toaster";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const initialFormFields = {
  email: "",
  password: "",
  confirmPassword: "",
};
const initialIsDirty = {
  email: false,
  password: false,
  confirmPassword: false,
};
const initialErrors = {
  email: null as string | null,
  password: null as string | null,
  confirmPassword: null as string | null,
};

type FormFields = typeof initialFormFields;
type IsDirty = typeof initialIsDirty;
type Errors = typeof initialErrors;

const useRegister = () => {
  const router = useRouter();
  const { signUp } = useAuthStore();

  const [formFields, setFormFields] = useState<FormFields>(initialFormFields);
  const [isDirty, setIsDirty] = useState<IsDirty>(initialIsDirty);
  const [errors, setErrors] = useState<Errors>(initialErrors);

  const [loading, setLoading] = useState(false);

  const _handleOnChange = (key: keyof FormFields, value: string) => {
    const newFormFields = { ...formFields, [key]: value };
    const newIsDirty = { ...isDirty, [key]: true };

    setFormFields(newFormFields);
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

      Object.keys(newFormFields)?.forEach((key: string) => {
        if (newIsDirty[key as keyof IsDirty]) {
          switch (key) {
            case "email":
              if (!newFormFields[key]?.trim()?.length) {
                newErrors[key] = "*Email is required";
                isFormValid = false;
              } else if (!REGEX_CONFIG?.email?.test(newFormFields?.[key])) {
                newErrors[key] = "*Invalid email";
                isFormValid = false;
              } else {
                newErrors[key] = null;
                newIsDirty[key] = false;
              }
              break;

            case "password":
              if (!newFormFields?.[key]?.trim()?.length) {
                newErrors[key] = "*Password is required";
                isFormValid = false;
              } else if (!REGEX_CONFIG?.password?.test(newFormFields[key])) {
                newErrors[key] = "*Invalid password";
                isFormValid = false;
              } else {
                newErrors[key] = null;
                newIsDirty[key] = false;
              }
              break;

            case "confirmPassword":
              if (!newFormFields?.[key]?.trim()?.length) {
                newErrors[key] = "*Confirm password is required";
                isFormValid = false;
              } else if (newFormFields?.[key] !== newFormFields?.["password"]) {
                newErrors[key] = "*Passwords do not match";
                isFormValid = false;
              } else {
                newErrors[key] = null;
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

  const _handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      if (e) e.preventDefault();
      setLoading(true);

      const newFormFields = { ...formFields };
      const newIsDirty = await _markAllIsDirty();

      const isFormValid = await _validateFormFields({
        newFormFields,
        newIsDirty,
      });

      console.log({ isFormValid });

      // return if form not valid
      if (!isFormValid) return;

      // sign up via API route
      await signUp(formFields.email, formFields.password);

      successToast("Registered Successfully");
      // redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      errorToast(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    formFields,
    errors,
    loading,
    handleOnChange: _handleOnChange,
    handleSubmit: _handleSubmit,
  };
};

export default useRegister;
