import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { X } from 'lucide-react';

const ToastContext = createContext(null);

let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((toast) => {
    const id = nextId++;
    const t = {
      id,
      type: toast.type || 'info', // success | error | info
      title: toast.title,
      message: toast.message,
      duration: toast.duration ?? 3200,
    };
    setToasts((prev) => [...prev, t]);

    if (t.duration !== 0) {
      window.setTimeout(() => remove(id), t.duration);
    }

    return id;
  }, [remove]);

  const api = useMemo(() => ({ push, remove }), [push, remove]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-relevant="additions">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`} role="status">
            <div className="toast-top">
              <div className="toast-title">{t.title}</div>
              <button type="button" className="toast-close" onClick={() => remove(t.id)} aria-label="Dismiss">
                <X strokeWidth={1.75} />
              </button>
            </div>
            {t.message && <div className="toast-message">{t.message}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

