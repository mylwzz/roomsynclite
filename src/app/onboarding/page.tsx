// src/app/onboarding/page.tsx
import { getSessionWithProfile } from "@/lib/auth.server";
import { redirect }              from "next/navigation";
import { ProfileForm }           from "@/components/profile/profile-form";

export default async function OnboardingPage() {
  const { session, profile } = await getSessionWithProfile();

  if (session?.user && profile) {
    redirect("/browse");
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-primary-light/20 to-accent/10">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Welcome to RoomSync</h1>
            <p className="text-lg text-gray-600">Tell us a bit about yourself to get matched with compatible roommates</p>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mr-3">
                <span className="font-bold">1</span>
              </div>
              <h2 className="text-xl font-semibold">Create Your Profile</h2>
            </div>
            
            <ProfileForm />
          </div>
        </div>
      </div>
    </div>
  );
}