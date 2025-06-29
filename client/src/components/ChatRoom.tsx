import React from 'react';
import { useChat } from '../context/ChatContext';
import { socketService } from '../services/socket';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UsersList from './UsersList';
import RoomHeader from './RoomHeader';
import { LogOut } from 'lucide-react';

const ChatRoom: React.FC = () => {
  const { state, dispatch } = useChat();

  const handleLeaveRoom = () => {
    if (state.currentRoom) {
      socketService.leaveRoom();
      dispatch({ type: 'RESET_STATE' });
    }
  };

  if (!state.currentRoom || !state.currentUser) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <RoomHeader room={state.currentRoom} onLeave={handleLeaveRoom} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            <MessageList 
              messages={state.messages} 
              currentUser={state.currentUser}
              typingUsers={state.typingUsers}
            />
          </div>
          
          {/* Message Input */}
          <div className="border-t border-gray-200 bg-white p-4">
            <MessageInput 
              roomId={state.currentRoom.id}
              currentUser={state.currentUser}
            />
          </div>
        </div>
        
        {/* Users Sidebar */}
        <div className="w-80 border-l border-gray-200 bg-white">
          <UsersList users={state.users} currentUser={state.currentUser} />
        </div>
      </div>
    </div>
  );
};

export default ChatRoom; 