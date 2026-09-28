// src/app/(auth)/layout.jsx

export default function AuthLayout({ children }) {
  return (
    <div className="h-screen w-full overflow-hidden bg-slate-950">
      {children}
    </div>
  );
}
