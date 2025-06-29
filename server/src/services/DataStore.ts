import { v4 as uuidv4 } from 'uuid';
import { User, Room, Message } from '../types';

export class DataStore {
  private users: Map<string, User> = new Map();
  private rooms: Map<string, Room> = new Map();
  private messages: Map<string, Message> = new Map();
  private typingUsers: Map<string, Set<string>> = new Map(); // roomId -> Set of userIds

  // User Management
  createUser(username: string, socketId: string): User {
    const sanitizedUsername = this.sanitizeInput(username);
    
    if (!sanitizedUsername || sanitizedUsername.length < 2) {
      throw new Error('Username must be at least 2 characters long');
    }

    if (sanitizedUsername.length > 20) {
      throw new Error('Username must be less than 20 characters');
    }

    // Check if username is already taken
    const existingUser = Array.from(this.users.values()).find(
      user => user.username.toLowerCase() === sanitizedUsername.toLowerCase()
    );

    if (existingUser) {
      throw new Error('Username is already taken');
    }

    const user: User = {
      id: uuidv4(),
      username: sanitizedUsername,
      currentRoom: null,
      socketId,
      joinedAt: new Date(),
    };

    this.users.set(user.id, user);
    return user;
  }

  getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }

  getUserBySocketId(socketId: string): User | undefined {
    return Array.from(this.users.values()).find(user => user.socketId === socketId);
  }

  updateUserSocketId(userId: string, socketId: string): void {
    const user = this.users.get(userId);
    if (user) {
      user.socketId = socketId;
      this.users.set(userId, user);
    }
  }

  removeUser(userId: string): void {
    const user = this.users.get(userId);
    if (user && user.currentRoom) {
      this.leaveRoom(userId, user.currentRoom);
    }
    this.users.delete(userId);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  // Room Management
  createRoom(roomName: string): Room {
    const sanitizedRoomName = this.sanitizeInput(roomName);
    
    if (!sanitizedRoomName || sanitizedRoomName.length < 2) {
      throw new Error('Room name must be at least 2 characters long');
    }

    if (sanitizedRoomName.length > 30) {
      throw new Error('Room name must be less than 30 characters');
    }

    // Check if room already exists
    const existingRoom = Array.from(this.rooms.values()).find(
      room => room.name.toLowerCase() === sanitizedRoomName.toLowerCase()
    );

    if (existingRoom) {
      throw new Error('Room already exists');
    }

    const room: Room = {
      id: uuidv4(),
      name: sanitizedRoomName,
      users: [],
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date(),
    };

    this.rooms.set(room.id, room);
    return room;
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  getRoomByName(roomName: string): Room | undefined {
    return Array.from(this.rooms.values()).find(
      room => room.name.toLowerCase() === roomName.toLowerCase()
    );
  }

  joinRoom(userId: string, roomId: string): void {
    const user = this.users.get(userId);
    const room = this.rooms.get(roomId);

    if (!user || !room) {
      throw new Error('User or room not found');
    }

    // Leave current room if any
    if (user.currentRoom) {
      this.leaveRoom(userId, user.currentRoom);
    }

    // Add user to room
    user.currentRoom = roomId;
    room.users.push(user);
    room.lastActivity = new Date();

    this.users.set(userId, user);
    this.rooms.set(roomId, room);
  }

  leaveRoom(userId: string, roomId: string): void {
    const user = this.users.get(userId);
    const room = this.rooms.get(roomId);

    if (!user || !room) {
      return;
    }

    // Remove user from room
    room.users = room.users.filter(u => u.id !== userId);
    user.currentRoom = null;

    // Delete room if empty
    if (room.users.length === 0) {
      this.rooms.delete(roomId);
      // Clean up messages for this room
      Array.from(this.messages.values())
        .filter(msg => msg.room === roomId)
        .forEach(msg => this.messages.delete(msg.id));
    } else {
      room.lastActivity = new Date();
      this.rooms.set(roomId, room);
    }

    this.users.set(userId, user);
  }

  getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  // Message Management
  addMessage(content: string, userId: string, roomId: string): Message {
    const user = this.users.get(userId);
    const room = this.rooms.get(roomId);

    if (!user || !room) {
      throw new Error('User or room not found');
    }

    const sanitizedContent = this.sanitizeInput(content);
    
    if (!sanitizedContent || sanitizedContent.length === 0) {
      throw new Error('Message cannot be empty');
    }

    if (sanitizedContent.length > 500) {
      throw new Error('Message must be less than 500 characters');
    }

    const message: Message = {
      id: uuidv4(),
      content: sanitizedContent,
      username: user.username,
      userId: user.id,
      room: roomId,
      timestamp: new Date(),
    };

    this.messages.set(message.id, message);
    room.messages.push(message);
    room.lastActivity = new Date();

    this.rooms.set(roomId, room);
    return message;
  }

  getRoomMessages(roomId: string, limit: number = 50): Message[] {
    const room = this.rooms.get(roomId);
    if (!room) {
      return [];
    }
    return room.messages.slice(-limit);
  }

  // Typing Indicators
  addTypingUser(userId: string, roomId: string): void {
    if (!this.typingUsers.has(roomId)) {
      this.typingUsers.set(roomId, new Set());
    }
    this.typingUsers.get(roomId)!.add(userId);
  }

  removeTypingUser(userId: string, roomId: string): void {
    const typingSet = this.typingUsers.get(roomId);
    if (typingSet) {
      typingSet.delete(userId);
      if (typingSet.size === 0) {
        this.typingUsers.delete(roomId);
      }
    }
  }

  getTypingUsers(roomId: string): string[] {
    const typingSet = this.typingUsers.get(roomId);
    return typingSet ? Array.from(typingSet) : [];
  }

  // Statistics
  getStats() {
    const rooms = Array.from(this.rooms.values()).map(room => ({
      id: room.id,
      name: room.name,
      userCount: room.users.length,
      messageCount: room.messages.length,
      createdAt: room.createdAt,
      lastActivity: room.lastActivity,
    }));

    return {
      totalRooms: this.rooms.size,
      totalUsers: this.users.size,
      totalMessages: this.messages.size,
      rooms,
    };
  }

  // Input Sanitization
  private sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
} 