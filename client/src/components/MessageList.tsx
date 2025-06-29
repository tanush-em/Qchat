import React, { useRef, useEffect } from 'react';
import { Message, User } from '../types';
import { formatTime } from '../utils/date';
import { cn } from '../utils/cn';

interface MessageListProps {
  messages: Message[];
  currentUser: User;
  typingUsers: Set<string>;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUser, typingUsers }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  const isOwnMessage = (message: Message) => message.userId === currentUser.id;

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex',
              isOwnMessage(message) ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
                isOwnMessage(message)
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              )}
            >
              {!isOwnMessage(message) && (
                <div className="text-xs font-medium text-gray-500 mb-1">
                  {message.username}
                </div>
              )}
              <div className="text-sm">{message.content}</div>
              <div
                className={cn(
                  'text-xs mt-1',
                  isOwnMessage(message) ? 'text-primary-100' : 'text-gray-500'
                )}
              >
                {formatTime(new Date(message.timestamp))}
              </div>
            </div>
          </div>
        ))
      )}

      {/* Typing Indicators */}
      {typingUsers.size > 0 && (
        <div className="flex justify-start">
          <div className="bg-gray-100 border border-gray-200 text-gray-600 px-4 py-2 rounded-lg">
            <div className="text-sm">
              {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
            </div>
            <div className="flex space-x-1 mt-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList; 