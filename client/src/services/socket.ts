import { io, Socket } from 'socket.io-client';
import { 
  ServerToClientEvents, 
  ClientToServerEvents, 
  InterServerEvents, 
  SocketData 
} from '../types';

class SocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData> | null = null;
  private serverUrl: string;

  constructor() {
    this.serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
  }

  connect(): Socket<ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData> {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(this.serverUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket<ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData> | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Event emitters
  joinRoom(roomName: string, username: string): void {
    if (this.socket?.connected) {
      this.socket.emit('join_room', { roomName, username });
    }
  }

  sendMessage(content: string, room: string): void {
    if (this.socket?.connected) {
      this.socket.emit('send_message', { content, room });
    }
  }

  leaveRoom(): void {
    if (this.socket?.connected) {
      this.socket.emit('leave_room');
    }
  }

  startTyping(room: string): void {
    if (this.socket?.connected) {
      this.socket.emit('start_typing', { room });
    }
  }

  stopTyping(room: string): void {
    if (this.socket?.connected) {
      this.socket.emit('stop_typing', { room });
    }
  }

  getRooms(): void {
    if (this.socket?.connected) {
      this.socket.emit('get_rooms');
    }
  }

  // Event listeners
  onConnect(callback: () => void): void {
    if (this.socket) {
      this.socket.on('connect', callback);
    }
  }

  onDisconnect(callback: () => void): void {
    if (this.socket) {
      this.socket.on('disconnect', callback);
    }
  }

  onRoomJoined(callback: (data: { room: any; user: any }) => void): void {
    if (this.socket) {
      this.socket.on('room_joined', callback);
    }
  }

  onMessageReceived(callback: (message: any) => void): void {
    if (this.socket) {
      this.socket.on('message_received', callback);
    }
  }

  onUserJoined(callback: (user: any) => void): void {
    if (this.socket) {
      this.socket.on('user_joined', callback);
    }
  }

  onUserLeft(callback: (user: any) => void): void {
    if (this.socket) {
      this.socket.on('user_left', callback);
    }
  }

  onTypingStart(callback: (data: { username: string; userId: string }) => void): void {
    if (this.socket) {
      this.socket.on('typing_start', callback);
    }
  }

  onTypingStop(callback: (data: { username: string; userId: string }) => void): void {
    if (this.socket) {
      this.socket.on('typing_stop', callback);
    }
  }

  onRoomUsers(callback: (users: any[]) => void): void {
    if (this.socket) {
      this.socket.on('room_users', callback);
    }
  }

  onRoomList(callback: (rooms: any[]) => void): void {
    if (this.socket) {
      this.socket.on('room_list', callback);
    }
  }

  onError(callback: (error: { message: string }) => void): void {
    if (this.socket) {
      this.socket.on('error', callback);
    }
  }

  // Remove event listeners
  offConnect(): void {
    if (this.socket) {
      this.socket.off('connect');
    }
  }

  offDisconnect(): void {
    if (this.socket) {
      this.socket.off('disconnect');
    }
  }

  offRoomJoined(): void {
    if (this.socket) {
      this.socket.off('room_joined');
    }
  }

  offMessageReceived(): void {
    if (this.socket) {
      this.socket.off('message_received');
    }
  }

  offUserJoined(): void {
    if (this.socket) {
      this.socket.off('user_joined');
    }
  }

  offUserLeft(): void {
    if (this.socket) {
      this.socket.off('user_left');
    }
  }

  offTypingStart(): void {
    if (this.socket) {
      this.socket.off('typing_start');
    }
  }

  offTypingStop(): void {
    if (this.socket) {
      this.socket.off('typing_stop');
    }
  }

  offRoomUsers(): void {
    if (this.socket) {
      this.socket.off('room_users');
    }
  }

  offRoomList(): void {
    if (this.socket) {
      this.socket.off('room_list');
    }
  }

  offError(): void {
    if (this.socket) {
      this.socket.off('error');
    }
  }

  // Remove all listeners
  removeAllListeners(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export const socketService = new SocketService(); 