// src/components/matches/match-card.tsx
import { useState } from "react";

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
  onLike: (userId: string) => void;
  onPass: (userId: string) => void;
  showLocation?: boolean;
}

export function MatchCard({ user, onLike, onPass, showLocation = false }: MatchCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold">{user.name}, {user.age}</h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {user.compatibilityScore?.toFixed(1)}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <p className="font-medium">{user.gender}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium">{user.role}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cleanliness</p>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-4 mr-1 ${i < user.cleanlinessLevel ? 'bg-green-500' : 'bg-gray-200'}`}
                ></div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Noise</p>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-4 mr-1 ${i < user.noiseTolerance ? 'bg-blue-500' : 'bg-gray-200'}`}
                ></div>
              ))}
            </div>
          </div>
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
        
        <div className="flex justify-between mt-4">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 text-sm underline"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onPass(user.id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Pass
            </button>
            <button
              onClick={() => onLike(user.id)}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Like
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}