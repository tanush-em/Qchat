# QChat Frontend

A modern, real-time chat application frontend built with React, TypeScript, and Socket.io.

## Features

- ✅ Real-time messaging with Socket.io
- ✅ Modern, responsive UI with Tailwind CSS
- ✅ TypeScript for type safety
- ✅ Room-based chat system
- ✅ User management and online status
- ✅ Typing indicators
- ✅ Message timestamps
- ✅ Connection status indicators
- ✅ Smooth animations and transitions
- ✅ Mobile-responsive design

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Socket.io Client** - Real-time communication
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **clsx & tailwind-merge** - Class utilities

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SERVER_URL=http://localhost:3001
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ChatApp.tsx     # Main app component
│   ├── ChatRoom.tsx    # Chat room interface
│   ├── JoinRoom.tsx    # Room joining form
│   ├── MessageList.tsx # Message display
│   ├── MessageInput.tsx # Message input
│   ├── UsersList.tsx   # Users sidebar
│   ├── RoomHeader.tsx  # Room header
│   └── ConnectionStatus.tsx # Connection indicator
├── context/
│   └── ChatContext.tsx # React context for state management
├── services/
│   └── socket.ts       # Socket.io service
├── types/
│   └── index.ts        # TypeScript interfaces
├── utils/
│   ├── cn.ts          # Class name utilities
│   └── date.ts        # Date formatting utilities
├── App.tsx            # Root component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## Components

### ChatApp
Main application component that manages socket connections and renders the appropriate UI based on connection state.

### JoinRoom
Form component for users to enter their username and join a chat room.

### ChatRoom
Main chat interface with message list, input, and users sidebar.

### MessageList
Displays chat messages with proper formatting, timestamps, and typing indicators.

### MessageInput
Input component with typing indicators and message sending functionality.

### UsersList
Sidebar component showing all users in the current room with their online status.

### RoomHeader
Header component displaying room information and leave room button.

### ConnectionStatus
Visual indicator showing the current connection status.

## State Management

The application uses React Context with useReducer for state management:

- **ChatState** - Current user, room, messages, users, typing indicators
- **ChatAction** - Actions for updating state
- **ChatProvider** - Context provider wrapping the app

## Socket.io Integration

The frontend communicates with the backend through Socket.io events:

### Client to Server
- `join_room` - Join a chat room
- `send_message` - Send a message
- `leave_room` - Leave current room
- `start_typing` - Start typing indicator
- `stop_typing` - Stop typing indicator
- `get_rooms` - Get list of available rooms

### Server to Client
- `room_joined` - Confirmation of room join
- `message_received` - New message received
- `user_joined` - User joined room
- `user_left` - User left room
- `typing_start` - User started typing
- `typing_stop` - User stopped typing
- `room_users` - Updated user list
- `room_list` - List of available rooms
- `error` - Error message

## Styling

The application uses Tailwind CSS with custom configurations:

- Custom color palette with primary colors
- Custom animations for smooth transitions
- Responsive design for mobile and desktop
- Custom scrollbar styling
- Typing indicator animations

## Development

### Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run lint:fix # Fix ESLint issues
```

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Strict TypeScript configuration

## Features in Detail

### Real-time Messaging
- Instant message delivery
- Message timestamps
- User avatars with initials
- Message bubbles with different colors for own/others

### Typing Indicators
- Real-time typing status
- Animated dots
- Automatic timeout after 2 seconds

### User Management
- Online user list
- User join/leave notifications
- Current user highlighting
- User avatars with online status

### Room System
- Join any room by name
- Room creation on first join
- Room user count
- Leave room functionality

### Connection Management
- Automatic reconnection
- Connection status indicators
- Error handling and display
- Graceful disconnection

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Optimized bundle size with Vite
- Lazy loading of components
- Efficient re-renders with React.memo
- Debounced typing indicators
- Smooth scrolling for messages

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast color scheme
- Focus indicators

## Deployment

The application can be deployed to:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

Make sure to set the `VITE_SERVER_URL` environment variable to point to your backend server. 