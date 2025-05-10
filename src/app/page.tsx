// src/app/page.tsx  (Server Component)
import { redirect } from "next/navigation";
import { getSessionWithProfile } from "@/lib/auth.server";
import { AuthForm } from "@/components/auth/auth-form";

export default async function LandingPage() {
  const { session, profile } = await getSessionWithProfile();

  if (session?.user) {
    if (!profile) {
      redirect("/onboarding");
    } else {
      redirect("/browse");
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center mb-12">
          <div className="text-[124px] mb-6">🏡</div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-primary">Room</span>
            <span className="text-gray-700">Sync</span>
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto">
            Find your perfect roommate match based on lifestyle, habits, and preferences
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8 md:p-12 w-full max-w-md border border-gray-200 relative overflow-hidden">
          <div className="relative">
            <AuthForm />
          </div>
        </div>

        <div className="mt-12 text-gray-500 text-sm text-center">
          <p>© {new Date().getFullYear()} RoomSync. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
