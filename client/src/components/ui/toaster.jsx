import React from "react";

export const ToastContext = React.createContext({
  show: (message, options) => {},
});

export function ToasterProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const show = (message, { type = "info", duration = 3000 } = {}) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`min-w-[240px] max-w-[360px] px-4 py-3 rounded-lg shadow-lg ring-1 ring-white/10 text-sm text-white ${
              t.type === "error"
                ? "bg-red-500/90"
                : t.type === "success"
                ? "bg-green-500/90"
                : "bg-black/70"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  return {
    toast: (message, options) => ctx.show(message, options),
    success: (message, options) => ctx.show(message, { type: "success", ...(options || {}) }),
    error: (message, options) => ctx.show(message, { type: "error", ...(options || {}) }),
    info: (message, options) => ctx.show(message, { type: "info", ...(options || {}) }),
  };
}


