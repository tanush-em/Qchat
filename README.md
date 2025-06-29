# QChat - Real-time Chat Application

A modern, real-time chat application built with Node.js, Express, Socket.io, React, and TypeScript.

![QChat Demo](https://img.shields.io/badge/Status-Ready-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 🚀 Features

### Backend (Node.js + Express + Socket.io)
- ✅ Real-time messaging with Socket.io
- ✅ Room-based chat system
- ✅ User management (in-memory)
- ✅ Typing indicators
- ✅ Online user tracking
- ✅ Input validation and sanitization
- ✅ TypeScript for type safety
- ✅ CORS enabled for frontend integration
- ✅ Security middleware (Helmet, Rate Limiting)
- ✅ Comprehensive error handling
- ✅ Graceful shutdown handling

### Frontend (React + TypeScript)
- ✅ Modern, responsive UI with Tailwind CSS
- ✅ Real-time messaging with Socket.io client
- ✅ Room-based chat system
- ✅ User management and online status
- ✅ Typing indicators with animations
- ✅ Message timestamps
- ✅ Connection status indicators
- ✅ Smooth animations and transitions
- ✅ Mobile-responsive design

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.io** - Real-time communication
- **TypeScript** - Type safety
- **UUID** - Unique ID generation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection
- **Compression** - Response compression

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Socket.io Client** - Real-time communication
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **clsx & tailwind-merge** - Class utilities

## 📦 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Qchat
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**

   Create `.env` file in `server/`:
   ```env
   NODE_ENV=development
   PORT=3001
   CLIENT_URL=http://localhost:3000
   ```

   Create `.env` file in `client/`:
   ```env
   VITE_SERVER_URL=http://localhost:3001
   ```

5. **Start the backend**
   ```bash
   cd server
   npm run dev
   ```

6. **Start the frontend**
   ```bash
   cd client
   npm run dev
   ```

7. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/api/health

## 🏗️ Project Structure

```
Qchat/
├── server/                 # Backend application
│   ├── src/
│   │   ├── index.ts       # Main server file
│   │   ├── types/         # TypeScript interfaces
│   │   ├── services/      # Business logic
│   │   └── routes/        # Express routes
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # React context
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript interfaces
│   │   └── utils/         # Utility functions
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
└── README.md
```

## 🔌 API Endpoints

### REST API

- `GET /api/health` - Server health status
- `GET /api/` - Server information
- `GET /api/rooms` - Get all rooms and statistics
- `GET /api/rooms/:roomId` - Get specific room details
- `GET /api/rooms/:roomId/messages` - Get room messages
- `GET /api/users` - Get all online users

### Socket.io Events

#### Client to Server
- `join_room` - Join a chat room
- `send_message` - Send a message
- `leave_room` - Leave current room
- `start_typing` - Start typing indicator
- `stop_typing` - Stop typing indicator
- `get_rooms` - Get list of available rooms

#### Server to Client
- `room_joined` - Confirmation of room join
- `message_received` - New message received
- `user_joined` - User joined room
- `user_left` - User left room
- `typing_start` - User started typing
- `typing_stop` - User stopped typing
- `room_users` - Updated user list
- `room_list` - List of available rooms
- `error` - Error message

## 🎨 Features in Detail

### Real-time Messaging
- Instant message delivery across all connected clients
- Message timestamps and user identification
- Message bubbles with different colors for own/others
- Automatic scrolling to latest messages

### Typing Indicators
- Real-time typing status with animated dots
- Automatic timeout after 2 seconds of inactivity
- Visual feedback for all users in the room

### User Management
- Online user list with real-time updates
- User join/leave notifications
- Current user highlighting
- User avatars with initials and online status

### Room System
- Join any room by name (auto-creation)
- Room user count display
- Leave room functionality
- Room persistence during session

### Security & Performance
- Input sanitization to prevent XSS
- Rate limiting to prevent abuse
- CORS configuration for frontend integration
- Compression for faster responses
- Graceful error handling

### Environment Variables for Production

**Backend (.env)**
```env
NODE_ENV=production
PORT=3001
CLIENT_URL=https://your-frontend-domain.com
```

**Frontend (.env)**
```env
VITE_SERVER_URL=https://your-backend-domain.com
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Happy Chatting! 🎉** 