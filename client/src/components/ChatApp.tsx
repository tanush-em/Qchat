import React, { useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { socketService } from '../services/socket';
import JoinRoom from './JoinRoom';
import ChatRoom from './ChatRoom';
import ConnectionStatus from './ConnectionStatus';

const ChatApp: React.FC = () => {
  const { state, dispatch } = useChat();

  useEffect(() => {
    // Connect to socket
    const socket = socketService.connect();
    
    // Set up event listeners
    socketService.onConnect(() => {
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
    });

    socketService.onDisconnect(() => {
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: false });
    });

    socketService.onRoomJoined((data) => {
      dispatch({ type: 'SET_CURRENT_USER', payload: data.user });
      dispatch({ type: 'SET_CURRENT_ROOM', payload: data.room });
      dispatch({ type: 'SET_MESSAGES', payload: data.room.messages });
      dispatch({ type: 'SET_USERS', payload: data.room.users });
      dispatch({ type: 'CLEAR_ERROR' });
    });

    socketService.onMessageReceived((message) => {
      dispatch({ type: 'ADD_MESSAGE', payload: message });
    });

    socketService.onUserJoined((user) => {
      dispatch({ type: 'ADD_USER', payload: user });
    });

    socketService.onUserLeft((user) => {
      dispatch({ type: 'REMOVE_USER', payload: user });
    });

    socketService.onTypingStart((data) => {
      dispatch({ type: 'ADD_TYPING_USER', payload: data.username });
    });

    socketService.onTypingStop((data) => {
      dispatch({ type: 'REMOVE_TYPING_USER', payload: data.username });
    });

    socketService.onRoomUsers((users) => {
      dispatch({ type: 'SET_USERS', payload: users });
    });

    socketService.onRoomList((rooms) => {
      dispatch({ type: 'SET_ROOMS', payload: rooms });
    });

    socketService.onError((error) => {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    });

    // Cleanup on unmount
    return () => {
      socketService.removeAllListeners();
      socketService.disconnect();
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <ConnectionStatus />
      
      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{state.error}</span>
          <button
            onClick={() => dispatch({ type: 'CLEAR_ERROR' })}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="sr-only">Dismiss</span>
            <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </button>
        </div>
      )}

      {!state.isConnected ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Connecting to server...</p>
          </div>
        </div>
      ) : !state.currentUser ? (
        <JoinRoom />
      ) : (
        <ChatRoom />
      )}
    </div>
  );
};

export default ChatApp; 