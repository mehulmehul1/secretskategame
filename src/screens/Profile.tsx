import React from 'react';
import { Trophy, Star, Medal, Award } from 'lucide-react';

export function Profile() {
  return (
    <div className="pb-16">
      {/* Header */}
      <div className="bg-blue-500 text-white p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <Award size={40} className="text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Street Skater</h1>
            <p className="opacity-80">Rookie Level</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-lg font-bold">10</p>
          <p className="text-sm text-gray-500">Wins</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-lg font-bold">150</p>
          <p className="text-sm text-gray-500">XP</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <Medal className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p className="text-lg font-bold">3</p>
          <p className="text-sm text-gray-500">Badges</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow">
              <p className="font-medium">Won a Game of SKATE</p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}