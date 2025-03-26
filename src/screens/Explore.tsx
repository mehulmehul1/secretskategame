import React from 'react';
import { MapPin, Star, Users } from 'lucide-react';

export function Explore() {
  return (
    <div className="pb-16 p-4">
      <h1 className="text-2xl font-bold mb-6">Explore Spots</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search spots..."
          className="w-full p-3 rounded-lg border border-gray-200"
        />
      </div>

      {/* Spots List */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="h-48 bg-gray-200 relative">
              <div className="absolute bottom-2 right-2 bg-white rounded-full px-3 py-1 flex items-center gap-1">
                <Star className="text-yellow-500" size={16} />
                <span className="text-sm font-medium">4.5</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">Downtown Plaza</h3>
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <MapPin size={16} />
                <span className="text-sm">2.5 miles away</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Users size={16} />
                <span className="text-sm">3 skating now</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}