import "./globals.css";

export const metadata = {
  title: "Digital Marketing Dashboard",
  description: "Full-stack digital marketing analytics dashboard"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
