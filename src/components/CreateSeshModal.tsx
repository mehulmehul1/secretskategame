import React from 'react';
import { X, Clock, Users, MapPin } from 'lucide-react';

interface CreateSeshModalProps {
  onClose: () => void;
}

export function CreateSeshModal({ onClose }: CreateSeshModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Create Session</h2>
          <button onClick={onClose} className="text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session Type
            </label>
            <select className="w-full p-2 border rounded">
              <option>Chill Session</option>
              <option>Competition</option>
              <option>Filming</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={20} />
              <select className="flex-1 p-2 border rounded">
                <option>1 hour</option>
                <option>2 hours</option>
                <option>3 hours</option>
                <option>All day</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Participants
            </label>
            <div className="flex items-center gap-2 text-gray-600">
              <Users size={20} />
              <select className="flex-1 p-2 border rounded">
                <option>5</option>
                <option>10</option>
                <option>15</option>
                <option>Unlimited</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={20} />
              <input
                type="text"
                placeholder="Current location"
                className="flex-1 p-2 border rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t">
          <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium">
            Create Session
          </button>
        </div>
      </div>
    </div>
  );
}