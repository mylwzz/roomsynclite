// src/app/page.tsx  (Server Component)
import { redirect } from "next/navigation";
import { getSessionWithProfile } from "@/lib/auth";
import { AuthForm } from "@/components/auth/auth-form";

export default async function LandingPage() {
  const { session, profile } = await getSessionWithProfile();

  if (session?.user) {
    // Logged-in user → choose where to go
    if (!profile) {
      redirect("/onboarding");
    } else {
      redirect("/browse");
    }
  }

  // Visitor not logged-in → show sign-up / login form
  return (
    <div className="grid min-h-screen p-8 sm:p-20 place-items-center gap-12">
      <main className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold">RoomSync Lite</h1>
        <p className="text-xl text-center">Find your perfect roommate match</p>
        <AuthForm />
      </main>

      <footer className="text-sm text-gray-500">
        © 2025 RoomSync Lite
      </footer>
    </div>
  );
}
