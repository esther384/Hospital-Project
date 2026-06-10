import React, { useEffect } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

/**
 * Modal – a reusable alert / confirm dialog.
 *
 * Props:
 *  open        boolean   – controls visibility
 *  type        string    – "success" | "error" | "warning" | "info" | "confirm"
 *  title       string
 *  message     string
 *  onClose     fn        – called when user dismisses (OK or Cancel)
 *  onConfirm   fn        – (confirm variant only) called when user clicks confirm button
 *  confirmText string    – label for confirm button  (default "Confirm")
 *  cancelText  string    – label for cancel button   (default "Cancel")
 */
const ICONS = {
  success: <CheckCircle2 className="w-10 h-10 text-emerald-500" />,
  error: <XCircle className="w-10 h-10 text-rose-500" />,
  warning: <AlertTriangle className="w-10 h-10 text-amber-500" />,
  info: <Info className="w-10 h-10 text-blue-500" />,
  confirm: <AlertTriangle className="w-10 h-10 text-amber-500" />,
};

const BUTTON_COLORS = {
  success: "bg-emerald-500 hover:bg-emerald-600",
  error: "bg-rose-500 hover:bg-rose-600",
  warning: "bg-amber-500 hover:bg-amber-600",
  info: "bg-blue-500 hover:bg-blue-600",
  confirm: "bg-rose-500 hover:bg-rose-600",
};

const Modal = ({
  open,
  type = "info",
  title,
  message,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const isConfirm = type === "confirm";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center animate-scale-in">
        {/* Close button */}
        {!isConfirm && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Icon */}
        <div className="mb-4">{ICONS[type] ?? ICONS.info}</div>

        {/* Title */}
        {title && (
          <h2 id="modal-title" className="text-xl font-bold text-slate-800 mb-2">
            {title}
          </h2>
        )}

        {/* Message */}
        {message && (
          <p className="text-slate-500 text-sm leading-relaxed mb-6">{message}</p>
        )}

        {/* Actions */}
        {isConfirm ? (
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => { onConfirm?.(); onClose?.(); }}
              className={`flex-1 px-4 py-2.5 rounded-xl text-white font-semibold transition-colors ${BUTTON_COLORS[type]}`}
            >
              {confirmText}
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            className={`w-full px-4 py-2.5 rounded-xl text-white font-semibold transition-colors ${BUTTON_COLORS[type]}`}
          >
            OK
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;
