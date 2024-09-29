// Toast.tsx
import { ToastProps } from "@/types";
import React, { useEffect } from "react";

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast toast-end `}>
      <div
        className={`alert alert-${type} ${
          type === "success" ? "bg-blue-600" : "bg-red-600"
        } text-white`}
      >
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
