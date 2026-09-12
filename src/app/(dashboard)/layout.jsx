// src/app/(dashboard)/layout.jsx
import ReduxProvider from "@/redux/redux-provider/ReduxProvider";
import DashboardContent from "./_client/DashboardContent";

export const metadata = {
  title: "Dashboard | Safe LPG Bangladesh",
};

export default function DashboardLayout({ children }) {
  return (
    <ReduxProvider>
      <DashboardContent>{children}</DashboardContent>
    </ReduxProvider>
  );
}
