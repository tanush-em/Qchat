import React from 'react';
import { Room } from '../types';
import { LogOut, Users } from 'lucide-react';

interface RoomHeaderProps {
  room: Room;
  onLeave: () => void;
}

const RoomHeader: React.FC<RoomHeaderProps> = ({ room, onLeave }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {room.name}
            </h1>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Users className="h-4 w-4" />
              <span>{room.users.length} user{room.users.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={onLeave}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
        >
          <LogOut className="h-4 w-4" />
          <span>Leave Room</span>
        </button>
      </div>
    </div>
  );
};

export default RoomHeader; 