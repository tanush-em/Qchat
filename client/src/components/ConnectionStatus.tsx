import React from 'react';
import { useChat } from '../context/ChatContext';
import { Wifi, WifiOff } from 'lucide-react';

const ConnectionStatus: React.FC = () => {
  const { state } = useChat();

  if (!state.isConnected) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-md flex items-center space-x-2">
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">Disconnected</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded-md flex items-center space-x-2">
        <Wifi className="h-4 w-4" />
        <span className="text-sm font-medium">Connected</span>
      </div>
    </div>
  );
};

export default ConnectionStatus; 