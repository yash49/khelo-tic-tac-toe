import { Alert, AlertProps, AlertTitle } from '@mui/material';
import { ReactNode } from 'react';
import hotToast, { ToastOptions } from 'react-hot-toast';

type ToastCreateOptions = {
  severity?: AlertProps['severity'];
  title?: ReactNode;
  description: ReactNode;
  options?: ToastOptions;
};

export const create = (options: ToastCreateOptions) => {
  const {
    description,
    severity = 'info',
    title,
    options: toastOptions = {},
  } = options;

  const toastId = hotToast.custom(
    <div>
      <Alert
        severity={severity}
        onClose={() => {
          if (toastId) hotToast.remove(toastId);
        }}
      >
        {title && <AlertTitle>title</AlertTitle>}
        {description}
      </Alert>
    </div>,
    toastOptions
  );
};

export const toast = { create };
