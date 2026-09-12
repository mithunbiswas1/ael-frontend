// src/app/(dashboard)/profile/page.jsx
import ProfileContent from "./_client/ProfileContent";

export const metadata = {
  title: "My Profile | Safe LPG Bangladesh",
  description: "Manage your profile, certificates and training progress.",
};

export default function ProfilePage() {
  return <ProfileContent />;
}
