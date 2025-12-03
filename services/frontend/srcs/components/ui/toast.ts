import { ExternalToast, toast as sonnerToast } from "sonner";

/* 
** This is a wrapper around the sonner toast function 
** adds a dismiss action to the toast by default
*/
const createToastWithDismiss = (
  message: string | React.ReactNode,
  data?: ExternalToast
) => {
  return sonnerToast(message, {
    ...data,
    action: data?.action ?? {
      label: "Dismiss",
      onClick: () => {},
    },
  });
};

export const toast = Object.assign(createToastWithDismiss, {
  success: (message: string | React.ReactNode, data?: ExternalToast) =>
    sonnerToast.success(message, {
      ...data,
      action: data?.action ?? { label: "Dismiss", onClick: () => {} },
    }),
  error: (message: string | React.ReactNode, data?: ExternalToast) =>
    sonnerToast.error(message, {
      ...data,
      action: data?.action ?? { label: "Dismiss", onClick: () => {} },
    }),
  warning: (message: string | React.ReactNode, data?: ExternalToast) =>
    sonnerToast.warning(message, {
      ...data,
      action: data?.action ?? { label: "Dismiss", onClick: () => {} },
    }),
  info: (message: string | React.ReactNode, data?: ExternalToast) =>
    sonnerToast.info(message, {
      ...data,
      action: data?.action ?? { label: "Dismiss", onClick: () => {} },
    }),
  loading: (message: string | React.ReactNode, data?: ExternalToast) =>
    sonnerToast.loading(message, {
      ...data,
      action: data?.action ?? { label: "Dismiss", onClick: () => {} },
    }),
  promise: sonnerToast.promise,
  dismiss: sonnerToast.dismiss,
  custom: sonnerToast.custom,
});
