import { createContext, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";

const ToastContext = createContext(undefined);


export function ToastProvider({ children }) {
  const value = {
    success: (message) => toast.success(message),
    error: (message) => toast.error(message),
    info: (message) => toast(message, { icon: "ℹ️" }),
    loading: (message) => toast.loading(message),
    dismiss: (id) => toast.dismiss(id),
    promise: (promise, messages) => toast.promise(promise, messages),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#0f172a",
            color: "#fff",
            fontSize: "13.5px",
            fontWeight: 500,
            borderRadius: "12px",
            padding: "10px 14px",
          },
          success: {
            iconTheme: { primary: "#22c55e", secondary: "#0f172a" },
          },
          error: {
            iconTheme: { primary: "#f87171", secondary: "#0f172a" },
          },
        }}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
