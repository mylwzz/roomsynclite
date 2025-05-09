// src/components/matches/match-card.tsx
import { useState } from "react";
import { motion } from "framer-motion";

const getColorForLevel = (level: number) => {
  if (level <= 1) return "bg-red-500";
  if (level <= 3) return "bg-yellow-500";
  return "bg-green-500";
};

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

interface MatchCardProps {
  user: User;
  onLike: (id: string) => void;
  onPass: (id: string) => void;
  showLocation?: boolean;
}

export function MatchCard({ user, onLike, onPass, showLocation = false }: MatchCardProps) {
  const [expanded, setExpanded] = useState(false);
  const shortGender = (g: string) =>
    g === "male" ? "M" : g === "female" ? "F" : "–";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="bg-white rounded-2xl shadow-card border border-transparent hover:border-primary overflow-hidden">
        <div className="p-6 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-primary">
              {user.name}, {user.age}
            </h3>
            <div className="text-sm font-mono text-gray-500">
              {user.compatibilityScore?.toFixed(1)}%
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase">Gender</p>
              <p className="font-medium">{shortGender(user.gender)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase">Role</p>
              <p className="font-medium capitalize">{user.role}</p>
            </div>
          </div>

          <div className="text-xs text-gray-400 uppercase">Cleanliness</div>
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-4 rounded ${i < user.cleanlinessLevel ? getColorForLevel(user.cleanlinessLevel) : "bg-gray-200"}`}
              />
            ))}
          </div>
          <div className="text-xs text-gray-400 uppercase">Noise</div>
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-4 rounded ${i < user.noiseTolerance ? getColorForLevel(user.noiseTolerance) : "bg-gray-200"}`}
              />
            ))}
          </div>

          {expanded && (
            <div className="mt-3">
              <p className="text-sm text-gray-500">Sleep Time</p>
              <p className="font-medium mb-2">{user.sleepTime}</p>
              
              {showLocation && user.location && (
                <>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium mb-2">{user.location}</p>
                </>
              )}
              
              {user.bio && (
                <>
                  <p className="text-sm text-gray-500">Bio</p>
                  <p className="text-gray-700">{user.bio}</p>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between px-6 py-4 bg-gray-50">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 text-sm hover:underline"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onLike(user.id)}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Like
            </button>
            <button
              onClick={() => onPass(user.id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Pass
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}