// Global Toast Notification Helper
export type ToastType = 'info' | 'success' | 'accent';

export interface ToastEventDetail {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
}

export function showToast(message: string, type: ToastType = 'info', duration: number = 3000): void {
  if (typeof window === 'undefined') return;
  const id = Math.random().toString(36).slice(2, 9);
  window.dispatchEvent(
    new CustomEvent<ToastEventDetail>('show-portfolio-toast', {
      detail: { id, message, type, duration },
    }),
  );
}
