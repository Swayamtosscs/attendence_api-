import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attendance API",
  description: "Backend API for attendance application built with Next.js"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}



