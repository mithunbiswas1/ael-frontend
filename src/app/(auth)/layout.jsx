// src/app/(auth)/layout.jsx

export default function AuthLayout({ children }) {
  return (
    <div className="h-screen w-full overflow-hidden bg-gray-100">
      {children}
    </div>
  );
}
