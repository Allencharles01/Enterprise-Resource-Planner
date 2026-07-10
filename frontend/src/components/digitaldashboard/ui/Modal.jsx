import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({
  open,
  onClose,
  icon,
  iconBg = "bg-blue-500",
  title,
  subtitle,
  accent = "border-white/10",
  maxWidth = "max-w-4xl",
  children,
  footer,
  bodyClassName = "",
}) {
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

      <div
        className={`relative flex max-h-[90vh] w-full ${maxWidth} flex-col overflow-hidden rounded-2xl border ${accent} bg-white shadow-2xl dark:bg-[#0B1224]`}
      >

        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-200 p-5 dark:border-white/10">

          <div className="flex items-start gap-4">

            {icon && (
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg} text-white`}
              >
                {icon}
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>

              {subtitle && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X size={20} />
          </button>

        </div>

        {/* Body */}
        <div
          className={`flex-1 overflow-y-auto p-5 ${bodyClassName}`}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-gray-200 p-5 dark:border-white/10">
            {footer}
          </div>
        )}

      </div>

    </div>
  );
}