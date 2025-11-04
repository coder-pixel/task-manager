import { Toaster } from "sonner";

const ToasterWrapper = () => {
  return (
    <Toaster
      position="bottom-left"
      theme="light"
      toastOptions={{
        style: {
          background: "#e6f0fa", // light blue background
          color: "#1e3a8a", // blue text
          borderRadius: "10px",
          fontSize: "16px",
          boxShadow: "0 3px 16px rgba(30, 58, 138, 0.12)",
          border: "1px solid #60a5fa",
        },
        className: "font-semibold",
        duration: 4000,
      }}
    />
  );
};

export default ToasterWrapper;
