"use client";

import { useEffect } from "react";

if (typeof window !== "undefined") {
  // Suppress uncaught extension errors
  const isExtensionMsg = (str) =>
    str.includes("chrome-extension://") ||
    str.includes("bis_skin_checked") ||
    str.includes("M_ID");

  const origConsoleError = window.console.error;
  window.console.error = function (...args) {
    const text = args
      .map((a) => {
        if (typeof a === "string") return a;
        try {
          return JSON.stringify(a);
        } catch {
          return String(a);
        }
      })
      .join(" ");

    if (isExtensionMsg(text)) {
      return;
    }
    return origConsoleError.apply(this, args);
  };

  window.addEventListener(
    "error",
    (event) => {
      const errStr = `${event.message} ${event.filename} ${event.error?.stack || ""}`;
      if (isExtensionMsg(errStr)) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    },
    true
  );

  window.addEventListener(
    "unhandledrejection",
    (event) => {
      const reasonStr = String(event.reason?.stack || event.reason || "");
      if (isExtensionMsg(reasonStr)) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    },
    true
  );
}

export function ExtensionSuppressor() {
  useEffect(() => {
    // Clean up any bis_skin_checked attributes injected by browser extensions
    try {
      const cleanNodes = () => {
        document.querySelectorAll("[bis_skin_checked]").forEach((el) => {
          el.removeAttribute("bis_skin_checked");
        });
      };
      cleanNodes();
      const observer = new MutationObserver(() => cleanNodes());
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["bis_skin_checked"],
        subtree: true,
      });
      return () => observer.disconnect();
    } catch {}
  }, []);

  return null;
}
