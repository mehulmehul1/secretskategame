import React from 'react';
import { Trophy, Star } from 'lucide-react';

interface SkaterPopupProps {
  skater: {
    name: string;
    rank: string;
    wins: number;
  };
}

export function SkaterPopup({ skater }: SkaterPopupProps) {
  return (
    <div className="p-2 min-w-[200px]">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">{skater.name[0]}</span>
        </div>
        <div>
          <h3 className="font-bold">{skater.name}</h3>
          <p className="text-sm text-gray-500">{skater.rank}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <Trophy size={16} className="text-yellow-500" />
        <span>{skater.wins} wins</span>
      </div>
      <button className="w-full bg-blue-500 text-white py-2 rounded text-sm">
        Challenge
      </button>
    </div>
  );
}