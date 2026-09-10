// src/app/(auth)/layout.jsx

import ReduxProvider from "@/redux/redux-provider/ReduxProvider";

export default function AuthLayout({ children }) {
  return <ReduxProvider>{children}</ReduxProvider>;
}
