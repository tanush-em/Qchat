import React from 'react';
import { ChatProvider } from './context/ChatContext';
import ChatApp from './components/ChatApp';
import './index.css';

function App() {
  return (
    <ChatProvider>
      <div className="min-h-screen bg-gray-50">
        <ChatApp />
      </div>
    </ChatProvider>
  );
}

export default App; 