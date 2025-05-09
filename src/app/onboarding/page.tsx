// src/app/onboarding/page.tsx
import { getSessionWithProfile } from "@/lib/auth.server";
import { redirect }              from "next/navigation";
import { ProfileForm }           from "@/components/profile/profile-form";

export default async function OnboardingPage() {
  const { session, profile } = await getSessionWithProfile();

  // if we already have both session _and_ profile, skip onboarding
  if (session?.user && profile) {
    redirect("/browse");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-8">Create Your Profile</h1>
      <ProfileForm />
    </div>
  );
}