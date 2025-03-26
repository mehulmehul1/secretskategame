import React from 'react';
import { MapPin, Star, Users } from 'lucide-react';

interface SpotCardProps {
  spot: {
    name: string;
    difficulty: number;
    activeUsers: number;
  };
}

export function SpotCard({ spot }: SpotCardProps) {
  return (
    <div className="p-2 min-w-[200px]">
      <h3 className="font-bold text-lg mb-2">{spot.name}</h3>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <Star size={16} className="text-yellow-500" />
        <span>Difficulty: {spot.difficulty}/5</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <Users size={16} />
        <span>{spot.activeUsers} skating now</span>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 bg-blue-500 text-white py-2 rounded text-sm">
          Start Sesh
        </button>
        <button className="flex-1 border border-blue-500 text-blue-500 py-2 rounded text-sm">
          View Details
        </button>
      </div>
    </div>
  );
}