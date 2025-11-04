import { toast } from "sonner";

type ToastTypes = "default" | "destructive";
type ShowToastFn = {
  title?: string;
  description?: string;
  type?: ToastTypes;
};

export const showToast = ({
  title = "",
  description = "",
  type = "default",
}: ShowToastFn) => {
  toast(title, {
    description,
    style:
      type === "destructive"
        ? {
            background: "#fee2e2",
            color: "#b91c1c",
            border: "1px solid #f87171",
          }
        : {
            background: "#e6f0fa",
            color: "#1e3a8a",
            border: "1px solid #60a5fa",
          },
    className: "font-semibold",
    duration: 4000,
  });
};

export const successToast = (message: string, title?: string) => {
  showToast({
    title: title || "Success",
    description: message,
    type: "default",
  });
};

export const errorToast = (error: unknown, title?: string): void => {
  // console a common error message for each error
  console.log(`Error: ${error}, ${title}`);

  if (typeof error === "string") {
    showToast({
      title: title || "Error",
      description: error,
      type: "destructive",
    });
  } else if (
    typeof error === "object" &&
    error !== null &&
    ("message" in error || "reason" in error)
  ) {
    const { message, reason } = error as { message?: string; reason?: string };
    showToast({
      title: title || "Error",
      description: message ?? reason ?? "Something went wrong.",
      type: "destructive",
    });
  } else {
    showToast({
      title: title || "Error",
      description: "Unknown error occurred",
      type: "destructive",
    });
  }
};
