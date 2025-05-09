// src/app/browse/page.tsx
import { MatchList } from "@/components/matches/match-list";

export default function BrowsePage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Find Your Perfect Roommate</h1>
      <MatchList />
    </div>
  );
}