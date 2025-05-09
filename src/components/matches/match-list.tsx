// src/components/matches/match-list.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { MatchCard } from "./match-card";

const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

const Td = ({ children }: { children: React.ReactNode }) => (
  <td className="px-6 py-4 whitespace-nowrap">{children}</td>
);

const InfoIcon = () => (
  <svg className="w-4 h-4 ml-1 opacity-60 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm.75 15h-1.5v-1.5h1.5V17zm1.72-6.53l-.63.65c-.9.92-1.34 1.52-1.34 2.88h-1.5v-.38c0-1.1.45-2.1 1.26-2.93l.87-.89a1.74 1.74 0 00.51-1.22 1.76 1.76 0 10-3.52 0H8.58a3.26 3.26 0 016.52 0c0 .83-.33 1.62-.63 1.97z"/>
  </svg>
);

const shortGender = (g: string) => (g === "male" ? "M" : g === "female" ? "F" : "–");

function RolePill({ role }: { role: string }) {
  const map = {
    offering: "bg-emerald-100 text-emerald-800",
    looking:  "bg-indigo-100 text-indigo-800",
    browsing: "bg-gray-100 text-gray-800",
  } as const;
  return (
    <span className={`px-2 inline-flex text-xs font-semibold rounded-full capitalize ${map[role as keyof typeof map]}`}>
      {role}
    </span>
  );
}

function ActionBtn({
  children,
  onClick,
  color,
}: {
  children: React.ReactNode;
  onClick: () => void;
  color: "green" | "red";
}) {
  const base = "px-3 py-1 rounded text-white";
  const clr  = color === "green" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600";
  return (
    <motion.button whileTap={{ scale: 0.93 }} className={`${base} ${clr}`} onClick={onClick}>
      {children}
    </motion.button>
  );
}

interface User {
  id: string;
  name: string;
  age: number;
  gender: string;
  role: string;
  cleanlinessLevel: number;
  sleepTime: string;
  noiseTolerance: number;
  location?: string;
  compatibilityScore?: number;
  bio?: string;
}

const getColorForLevel = (level: number) => {
  if (level <= 1) return "bg-red-500";
  if (level <= 3) return "bg-yellow-500";
  return "bg-green-500";
};

export function MatchList() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [filters, setFilters] = useState({
    role: "",
    gender: "",
    ageMin: "",
    ageMax: "",
    sortBy: "compatibilityScore",
  });

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);

        const p = await fetch("/api/profile");
        if (!p.ok) {
          router.push("/onboarding");
          return;
        }
        setCurrentUser(await p.json());

        const m = await fetch("/api/matches");
        const arr = await m.json();
        setUsers(Array.isArray(arr) ? arr : []);
      } catch (err) {
        console.error("fetch error", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [router]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleLike = async (id: string) => {
    await fetch("/api/likes", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likedId: id }),     
    });
    setUsers((u) => u.filter((x) => x.id !== id));
  };

  const handlePass = async (id: string) => {
    await fetch("/api/passes", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passedId: id }),
    });
    setUsers((u) => u.filter((x) => x.id !== id));
  };

  // filter + sort
  const filtered = users
    .filter((u) => {
      if (filters.role && u.role !== filters.role) return false;
      if (filters.gender && u.gender !== filters.gender) return false;
      if (filters.ageMin && u.age < +filters.ageMin) return false;
      if (filters.ageMax && u.age > +filters.ageMax) return false;

      // role vis
      if (currentUser?.role === "looking"  && u.role !== "offering") return false;
      if (currentUser?.role === "offering" && u.role !== "looking")  return false;
      if (currentUser?.role === "browsing" && u.role === "looking")  return false;

      return true;
    })
    .sort((a, b) =>
      filters.sortBy === "compatibilityScore"
        ? (b.compatibilityScore || 0) - (a.compatibilityScore || 0)
        : a.name.localeCompare(b.name)
    );

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  const roleOptions = currentUser?.role === "browsing"
    ? [
        { value: "", label: "All Roles" },
        { value: "offering", label: "Offering" },
        { value: "browsing", label: "Browsing" },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Your Matches</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode("table")}
            className={`px-3 py-1 rounded ${
              viewMode === "table"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Table
          </button>
          <button
            onClick={() => setViewMode("card")}
            className={`px-3 py-1 rounded ${
              viewMode === "card"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Card
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {currentUser?.role === "browsing" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select 
                name="role" 
                value={filters.role} 
                onChange={handleFilterChange} 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              >
                {roleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select 
              name="gender" 
              value={filters.gender} 
              onChange={handleFilterChange} 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
            <div className="flex space-x-2">
              <input 
                type="number" 
                name="ageMin" 
                placeholder="Min" 
                value={filters.ageMin} 
                onChange={handleFilterChange} 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" 
              />
              <input 
                type="number" 
                name="ageMax" 
                placeholder="Max" 
                value={filters.ageMax} 
                onChange={handleFilterChange} 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select 
              name="sortBy" 
              value={filters.sortBy} 
              onChange={handleFilterChange} 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            >
              <option value="compatibilityScore">Compatibility</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* list */}
      {filtered.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-card">
          <p className="text-lg">No matches fit your filters.</p>
          <p className="text-gray-500">Try broadening the criteria or check back later.</p>
        </div>
      ) : viewMode === "table" ? (
        /* table view */
        <div className="overflow-x-auto bg-white rounded-lg shadow-card">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <Th>Name</Th>
                <Th>Age</Th>
                <Th>Gender</Th>
                <Th>Role</Th>
                <Th>Clean</Th>
                <Th>Noise</Th>
                <Th>Sleep</Th>
                <Th>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center cursor-help">
                        Score
                        <InfoIcon />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Compatibility score based on your preferences</p>
                    </TooltipContent>
                  </Tooltip>
                </Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <Td>{user.name}</Td>
                  <Td>{user.age}</Td>
                  <Td>{shortGender(user.gender)}</Td>
                  <Td><RolePill role={user.role} /></Td>
                  <Td>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-4 rounded ${i < user.cleanlinessLevel ? getColorForLevel(user.cleanlinessLevel) : "bg-gray-200"}`}
                        />
                      ))}
                    </div>
                  </Td>
                  <Td>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-4 rounded ${i < user.noiseTolerance ? getColorForLevel(user.noiseTolerance) : "bg-gray-200"}`}
                        />
                      ))}
                    </div>
                  </Td>
                  <Td>{user.sleepTime}</Td>
                  <Td>{user.compatibilityScore?.toFixed(1) || "–"}</Td>
                  <Td>
                    <div className="flex space-x-2">
                      <ActionBtn onClick={() => handleLike(user.id)} color="green">
                        Like
                      </ActionBtn>
                      <ActionBtn onClick={() => handlePass(user.id)} color="red">
                        Pass
                      </ActionBtn>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* card view */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((user) => (
            <MatchCard
              key={user.id}
              user={user}
              onLike={() => handleLike(user.id)}
              onPass={() => handlePass(user.id)}
              showLocation={currentUser?.role === "looking"}
            />
          ))}
        </div>
      )}
    </div>
  );
}