// src/app/(pages)/newsletter/unsubscribe/page.jsx

import UnsubscribeModal from "./_components/UnsubscribeModal";

export const metadata = {
  title: "Unsubscribe from Newsletter | AEL SafeLPG Bangladesh",
  description: "Manage your email preferences and unsubscribe from the AEL SafeLPG newsletter.",
};

export default async function UnsubscribePage({ searchParams }) {
  // Asynchronously resolve searchParams as per Next.js 16 requirements
  const resolvedSearchParams = await searchParams;
  const initialEmail = resolvedSearchParams?.email || "";

  return (
    <main className="w-full">
      <UnsubscribeModal initialEmail={initialEmail} />
    </main>
  );
}
