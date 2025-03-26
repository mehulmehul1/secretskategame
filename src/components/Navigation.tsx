import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Map, Compass, Trophy, User } from 'lucide-react';
import { cn } from '../lib/utils';

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Map, label: 'Map', path: '/' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: Trophy, label: 'Challenges', path: '/challenges' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ icon: Icon, label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={cn(
              'flex flex-col items-center justify-center w-full h-full',
              location.pathname === path ? 'text-blue-500' : 'text-gray-500'
            )}
          >
            <Icon size={24} />
            <span className="text-xs mt-1">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}