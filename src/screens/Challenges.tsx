import React from 'react';
import { Trophy, Timer, Users } from 'lucide-react';

export function Challenges() {
  return (
    <div className="pb-16 p-4">
      <h1 className="text-2xl font-bold mb-6">Challenges</h1>

      {/* Active Challenges */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Active Challenges</h2>
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="text-yellow-500" />
              <span className="font-medium">Game of SKATE</span>
            </div>
            <Timer className="text-gray-500" />
          </div>
          <p className="text-sm text-gray-600 mb-2">vs. LocalLegend</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users size={16} />
            <span>2 witnesses</span>
          </div>
        </div>
      </section>

      {/* Available Challenges */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Available Challenges</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Kickflip Challenge</span>
                <span className="text-blue-500 font-medium">50 SKATE</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Land a clean kickflip</p>
              <button className="w-full bg-blue-500 text-white py-2 rounded-lg mt-2">
                Accept Challenge
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}