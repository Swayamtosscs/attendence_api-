"use client";

export default function HomePage() {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        flexDirection: "column",
        gap: "1rem",
        fontFamily: "system-ui, sans-serif"
      }}
    >
      <h1>Attendance API</h1>
      <p>Use the API routes under /api for backend functionality.</p>
    </main>
  );
}



