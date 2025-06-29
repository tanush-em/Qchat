# QChat Backend

A real-time chat application backend built with Node.js, Express, Socket.io, and TypeScript.

## Features

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

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.io** - Real-time communication
- **TypeScript** - Type safety
- **UUID** - Unique ID generation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection
- **Compression** - Response compression

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start development server
npm run dev

# Start production server
npm start
```

### Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3001
CLIENT_URL=http://localhost:3000
```

## API Endpoints

### REST API

All endpoints return JSON responses with the following structure:
```json
{
  "success": boolean,
  "data": any,
  "error": string,
  "message": string
}
```

#### Health Check
- `GET /api/health` - Server health status

#### Server Status
- `GET /api/` - Server information

#### Rooms
- `GET /api/rooms` - Get all rooms and statistics
- `GET /api/rooms/:roomId` - Get specific room details
- `GET /api/rooms/:roomId/messages?limit=50` - Get room messages

#### Users
- `GET /api/users` - Get all online users

### Socket.io Events

#### Client to Server
- `join_room` - Join a chat room
  ```typescript
  { roomName: string; username: string }
  ```
- `send_message` - Send a message
  ```typescript
  { content: string; room: string }
  ```
- `leave_room` - Leave current room
- `start_typing` - Start typing indicator
  ```typescript
  { room: string }
  ```
- `stop_typing` - Stop typing indicator
  ```typescript
  { room: string }
  ```
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

## Data Models

### User
```typescript
interface User {
  id: string;
  username: string;
  currentRoom: string | null;
  socketId: string;
  joinedAt: Date;
}
```

### Room
```typescript
interface Room {
  id: string;
  name: string;
  users: User[];
  messages: Message[];
  createdAt: Date;
  lastActivity: Date;
}
```

### Message
```typescript
interface Message {
  id: string;
  content: string;
  username: string;
  userId: string;
  room: string;
  timestamp: Date;
}
```

## Architecture

### Services

- **DataStore** - In-memory data management for users, rooms, and messages
- **SocketHandler** - Socket.io event handling and real-time communication

### Security Features

- Input sanitization to prevent XSS attacks
- Rate limiting to prevent abuse
- Security headers with Helmet
- CORS configuration
- Request validation

### Error Handling

- Comprehensive error catching and logging
- Graceful error responses
- Unhandled promise rejection handling
- Uncaught exception handling

## Development

### Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build TypeScript to JavaScript
npm run start    # Start production server
npm run test     # Run tests
npm run lint     # Run ESLint
npm run lint:fix # Fix ESLint issues
```

### Project Structure

```
src/
├── index.ts           # Main server file
├── types/
│   └── index.ts      # TypeScript interfaces
├── services/
│   ├── DataStore.ts  # Data management
│   └── SocketHandler.ts # Socket.io events
└── routes/
    └── index.ts      # Express routes
```

## Notes

- All data is stored in memory (no persistence)
- Rooms are created automatically when first user joins
- Empty rooms are automatically deleted
- Input validation prevents XSS and ensures data quality
- CORS is configured for frontend integration
- Rate limiting is applied to prevent abuse
- Security headers are set with Helmet

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Deployment

The application is ready for deployment to platforms like:

- Heroku
- Railway
- DigitalOcean App Platform
- AWS Elastic Beanstalk
- Docker containers

Make sure to set the appropriate environment variables for production. 