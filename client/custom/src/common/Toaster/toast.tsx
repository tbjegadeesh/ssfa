// toast.ts
import { toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Common toast options
const toastOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

// Enum for toast types
type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default';

// Success message
export const showSuccessToast = (message: string): void => {
  toast.success(message, toastOptions);
};

// Error message
export const showErrorToast = (message: string): void => {
  toast.error(message, toastOptions);
};

// Info message
export const showInfoToast = (message: string): void => {
  toast.info(message, toastOptions);
};

// Warning message
export const showWarningToast = (message: string): void => {
  toast.warn(message, toastOptions);
};

// General message based on status
export const showToast = (
  message: string,
  type: ToastType = 'default',
): void => {
  switch (type) {
    case 'success':
      toast.success(message, toastOptions);
      break;
    case 'error':
      toast.error(message, toastOptions);
      break;
    case 'info':
      toast.info(message, toastOptions);
      break;
    case 'warning':
      toast.warn(message, toastOptions);
      break;
    default:
      toast(message, toastOptions);
  }
};
