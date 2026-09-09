import { useState, useEffect } from 'react';
import type { ToastEventDetail } from '../hooks/useToast';

interface ActiveToast extends ToastEventDetail {
  timerId: number;
}

export function Toast() {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);

  useEffect(() => {
    const handleShowToast = (e: Event) => {
      const customEvent = e as CustomEvent<ToastEventDetail>;
      const detail = customEvent.detail;
      if (!detail) return;

      const timerId = window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== detail.id));
      }, detail.duration || 3000);

      setToasts((prev) => [...prev.slice(-3), { ...detail, timerId }]);
    };

    window.addEventListener('show-portfolio-toast', handleShowToast);
    return () => {
      window.removeEventListener('show-portfolio-toast', handleShowToast);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none max-w-sm w-full"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-line-strong bg-ink/95 backdrop-blur-md shadow-2xl shadow-accent/5 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2 h-2 rounded-full ${
                toast.type === 'success'
                  ? 'bg-emerald-400 animate-pulse'
                  : toast.type === 'accent'
                    ? 'bg-accent animate-pulse'
                    : 'bg-cyan-400'
              }`}
            />
            <span className="mono-label text-xs text-text">{toast.message}</span>
          </div>

          <button
            onClick={() => {
              clearTimeout(toast.timerId);
              setToasts((prev) => prev.filter((t) => t.id !== toast.id));
            }}
            className="text-text-dim hover:text-text transition-colors p-1"
            aria-label="Dismiss notification"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
