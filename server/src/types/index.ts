export interface User {
  id: string;
  username: string;
  currentRoom: string | null;
  socketId: string;
  joinedAt: Date;
}

export interface Room {
  id: string;
  name: string;
  users: User[];
  messages: Message[];
  createdAt: Date;
  lastActivity: Date;
}

export interface Message {
  id: string;
  content: string;
  username: string;
  userId: string;
  room: string;
  timestamp: Date;
}

export interface TypingUser {
  username: string;
  userId: string;
  room: string;
}

// Socket.io Event Types
export interface ServerToClientEvents {
  room_joined: (data: { room: Room; user: User }) => void;
  message_received: (message: Message) => void;
  user_joined: (user: User) => void;
  user_left: (user: User) => void;
  typing_start: (data: { username: string; userId: string }) => void;
  typing_stop: (data: { username: string; userId: string }) => void;
  room_users: (users: User[]) => void;
  error: (error: { message: string }) => void;
  room_list: (rooms: Room[]) => void;
}

export interface ClientToServerEvents {
  join_room: (data: { roomName: string; username: string }) => void;
  send_message: (data: { content: string; room: string }) => void;
  leave_room: () => void;
  start_typing: (data: { room: string }) => void;
  stop_typing: (data: { room: string }) => void;
  get_rooms: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
  username: string;
  currentRoom: string | null;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface RoomStats {
  totalRooms: number;
  totalUsers: number;
  totalMessages: number;
  rooms: Array<{
    id: string;
    name: string;
    userCount: number;
    messageCount: number;
    createdAt: Date;
    lastActivity: Date;
  }>;
} 