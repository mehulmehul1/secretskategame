import React from 'react';
import { Keyboard as Skateboard } from 'lucide-react';

interface SkaterAvatarProps {
  isCurrentUser?: boolean;
  onClick?: () => void;
}

export function SkaterAvatar({ isCurrentUser, onClick }: SkaterAvatarProps) {
  return (
    <div 
      onClick={onClick}
      className={`relative cursor-pointer transform transition-transform hover:scale-110 ${
        isCurrentUser ? '-translate-x-1/2 -translate-y-1/2' : ''
      }`}
    >
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center
        ${isCurrentUser ? 'bg-blue-500' : 'bg-purple-500'}
      `}>
        <Skateboard className="text-white" size={20} />
      </div>
      {isCurrentUser && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
          You
        </div>
      )}
    </div>
  );
}