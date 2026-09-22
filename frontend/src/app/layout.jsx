import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { AnimatedBackground } from "@/components/AnimatedBackground";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "ERP System - Login",
  description: "Next-generation ERP System built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;

                const suppressError = (event) => {
                  let isExtensionError = false;
                  if (event.type === 'error') {
                    isExtensionError =
                      event.filename?.includes('chrome-extension://') ||
                      event.error?.stack?.includes('chrome-extension://') ||
                      event.message?.includes('chrome-extension://') ||
                      event.message?.includes('M_ID');
                  } else if (event.type === 'unhandledrejection') {
                    const reasonStr = event.reason?.stack || String(event.reason || '');
                    isExtensionError =
                      reasonStr.includes('chrome-extension://') ||
                      reasonStr.includes('M_ID');
                  }

                  if (isExtensionError) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    return true;
                  }
                  return false;
                };

                const originalAddEventListener = window.addEventListener;
                window.addEventListener = function(type, listener, options) {
                  if (type === 'error' || type === 'unhandledrejection') {
                    const wrappedListener = function(event) {
                      if (suppressError(event)) return;
                      return listener.apply(this, arguments);
                    };
                    if (!listener.__wrappedListeners) {
                      listener.__wrappedListeners = new Map();
                    }
                    listener.__wrappedListeners.set(type, wrappedListener);
                    return originalAddEventListener.call(this, type, wrappedListener, options);
                  }
                  return originalAddEventListener.call(this, type, listener, options);
                };

                const originalRemoveEventListener = window.removeEventListener;
                window.removeEventListener = function(type, listener, options) {
                  if (type === 'error' || type === 'unhandledrejection') {
                    const wrappedListener = listener.__wrappedListeners?.get(type);
                    if (wrappedListener) {
                      return originalRemoveEventListener.call(this, type, wrappedListener, options);
                    }
                  }
                  return originalRemoveEventListener.call(this, type, listener, options);
                };

                let originalOnError = window.onerror;
                window.onerror = function(message, source, lineno, colno, error) {
                  const isExtensionError =
                    String(message).includes('M_ID') ||
                    String(source).includes('chrome-extension://') ||
                    error?.stack?.includes('chrome-extension://');
                  if (isExtensionError) {
                    return true;
                  }
                  if (originalOnError) {
                    return originalOnError.apply(this, arguments);
                  }
                };

                Object.defineProperty(window, 'onerror', {
                  get() { return originalOnError; },
                  set(fn) { originalOnError = fn; },
                  configurable: true,
                  enumerable: true
                });

                // Remove bis_skin_checked injected by Bitwarden/browser extensions
                try {
                  const removeBisSkinChecked = (node) => {
                    if (node && node.nodeType === 1) {
                      if (node.hasAttribute('bis_skin_checked')) {
                        node.removeAttribute('bis_skin_checked');
                      }
                      for (let i = 0; i < node.children.length; i++) {
                        removeBisSkinChecked(node.children[i]);
                      }
                    }
                  };

                  const bisObserver = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                      if (mutation.type === 'attributes' && mutation.attributeName === 'bis_skin_checked') {
                        mutation.target.removeAttribute('bis_skin_checked');
                      } else if (mutation.type === 'childList') {
                        for (const added of mutation.addedNodes) {
                          removeBisSkinChecked(added);
                        }
                      }
                    }
                  });

                  if (document.documentElement) {
                    bisObserver.observe(document.documentElement, {
                      attributes: true,
                      subtree: true,
                      childList: true,
                      attributeFilter: ['bis_skin_checked'],
                    });
                  }

                  document.addEventListener('DOMContentLoaded', () => {
                    document.querySelectorAll('[bis_skin_checked]').forEach((el) => {
                      el.removeAttribute('bis_skin_checked');
                    });
                  });
                } catch (e) {}

                // Filter hydration warnings caused by browser extensions
                const origConsoleError = console.error;
                console.error = function(...args) {
                  const msg = args.map(a => {
                    if (typeof a === 'string') return a;
                    if (a && typeof a === 'object') {
                      try { return JSON.stringify(a); } catch (e) { return String(a); }
                    }
                    return String(a);
                  }).join(' ');

                  if (msg.includes('bis_skin_checked')) {
                    return;
                  }
                  return origConsoleError.apply(this, args);
                };
              })();
            `,
          }}
        />
      </head>
      <body
        className="min-h-full flex flex-col"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AnimatedBackground />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}