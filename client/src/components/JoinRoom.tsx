import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { socketService } from '../services/socket';
import { MessageSquare, Users, ArrowRight } from 'lucide-react';

const JoinRoom: React.FC = () => {
  const { dispatch } = useChat();
  const [formData, setFormData] = useState({
    username: '',
    roomName: '',
  });
  const [isJoining, setIsJoining] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim() || !formData.roomName.trim()) {
      return;
    }

    setIsJoining(true);
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      socketService.joinRoom(formData.roomName, formData.username);
    } catch (error) {
      console.error('Error joining room:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to join room' });
      setIsJoining(false);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to QChat
          </h2>
          <p className="text-gray-600">
            Join a room and start chatting in real-time
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your username"
                minLength={2}
                maxLength={20}
                required
                disabled={isJoining}
              />
            </div>

            <div>
              <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-2">
                Room Name
              </label>
              <input
                type="text"
                id="roomName"
                name="roomName"
                value={formData.roomName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter room name"
                minLength={2}
                maxLength={30}
                required
                disabled={isJoining}
              />
            </div>

            <button
              type="submit"
              disabled={isJoining || !formData.username.trim() || !formData.roomName.trim()}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isJoining ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Joining...
                </>
              ) : (
                <>
                  Join Room
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>Real-time chat</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>Instant messaging</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom; 