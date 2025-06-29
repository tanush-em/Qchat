import { Server, Socket } from 'socket.io';
import { 
  ServerToClientEvents, 
  ClientToServerEvents, 
  InterServerEvents, 
  SocketData 
} from '../types';
import { DataStore } from './DataStore';

export class SocketHandler {
  private io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
  private dataStore: DataStore;

  constructor(io: Server, dataStore: DataStore) {
    this.io = io;
    this.dataStore = dataStore;
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`User connected: ${socket.id}`);

      // Handle user joining with username
      socket.on('join_room', (data) => {
        this.handleJoinRoom(socket, data);
      });

      // Handle message sending
      socket.on('send_message', (data) => {
        this.handleSendMessage(socket, data);
      });

      // Handle room leaving
      socket.on('leave_room', () => {
        this.handleLeaveRoom(socket);
      });

      // Handle typing indicators
      socket.on('start_typing', (data) => {
        this.handleStartTyping(socket, data);
      });

      socket.on('stop_typing', (data) => {
        this.handleStopTyping(socket, data);
      });

      // Handle room list request
      socket.on('get_rooms', () => {
        this.handleGetRooms(socket);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });
  }

  private handleJoinRoom(socket: Socket, data: { roomName: string; username: string }): void {
    try {
      // Create or get user
      let user = this.dataStore.getUserBySocketId(socket.id);
      if (!user) {
        user = this.dataStore.createUser(data.username, socket.id);
      } else {
        this.dataStore.updateUserSocketId(user.id, socket.id);
      }

      // Get or create room
      let room = this.dataStore.getRoomByName(data.roomName);
      if (!room) {
        room = this.dataStore.createRoom(data.roomName);
      }

      // Join the room
      this.dataStore.joinRoom(user.id, room.id);
      socket.join(room.id);

      // Store user data in socket
      socket.data = {
        userId: user.id,
        username: user.username,
        currentRoom: room.id,
      };

      // Send room joined confirmation
      socket.emit('room_joined', { room, user });

      // Notify other users in the room
      socket.to(room.id).emit('user_joined', user);

      // Send updated user list to all users in room
      this.io.to(room.id).emit('room_users', room.users);

      console.log(`User ${user.username} joined room ${room.name}`);
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error', { message: error instanceof Error ? error.message : 'Failed to join room' });
    }
  }

  private handleSendMessage(socket: Socket, data: { content: string; room: string }): void {
    try {
      const user = this.dataStore.getUserBySocketId(socket.id);
      if (!user || user.currentRoom !== data.room) {
        socket.emit('error', { message: 'You are not in this room' });
        return;
      }

      const message = this.dataStore.addMessage(data.content, user.id, data.room);
      
      // Stop typing indicator for this user
      this.dataStore.removeTypingUser(user.id, data.room);
      socket.to(data.room).emit('typing_stop', { username: user.username, userId: user.id });

      // Broadcast message to all users in the room
      this.io.to(data.room).emit('message_received', message);

      console.log(`Message sent in room ${data.room} by ${user.username}`);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: error instanceof Error ? error.message : 'Failed to send message' });
    }
  }

  private handleLeaveRoom(socket: Socket): void {
    try {
      const user = this.dataStore.getUserBySocketId(socket.id);
      if (!user || !user.currentRoom) {
        return;
      }

      const room = this.dataStore.getRoom(user.currentRoom);
      if (!room) {
        return;
      }

      // Remove typing indicator
      this.dataStore.removeTypingUser(user.id, user.currentRoom);

      // Leave the room
      this.dataStore.leaveRoom(user.id, user.currentRoom);
      socket.leave(user.currentRoom);

      // Notify other users
      socket.to(user.currentRoom).emit('user_left', user);

      // Update user list for remaining users
      if (room.users.length > 0) {
        this.io.to(user.currentRoom).emit('room_users', room.users);
      }

      // Clear socket data
      socket.data = {
        userId: user.id,
        username: user.username,
        currentRoom: null,
      };

      console.log(`User ${user.username} left room ${room.name}`);
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  }

  private handleStartTyping(socket: Socket, data: { room: string }): void {
    try {
      const user = this.dataStore.getUserBySocketId(socket.id);
      if (!user || user.currentRoom !== data.room) {
        return;
      }

      this.dataStore.addTypingUser(user.id, data.room);
      socket.to(data.room).emit('typing_start', { username: user.username, userId: user.id });
    } catch (error) {
      console.error('Error starting typing indicator:', error);
    }
  }

  private handleStopTyping(socket: Socket, data: { room: string }): void {
    try {
      const user = this.dataStore.getUserBySocketId(socket.id);
      if (!user || user.currentRoom !== data.room) {
        return;
      }

      this.dataStore.removeTypingUser(user.id, data.room);
      socket.to(data.room).emit('typing_stop', { username: user.username, userId: user.id });
    } catch (error) {
      console.error('Error stopping typing indicator:', error);
    }
  }

  private handleGetRooms(socket: Socket): void {
    try {
      const rooms = this.dataStore.getAllRooms();
      socket.emit('room_list', rooms);
    } catch (error) {
      console.error('Error getting rooms:', error);
      socket.emit('error', { message: 'Failed to get rooms' });
    }
  }

  private handleDisconnect(socket: Socket): void {
    try {
      const user = this.dataStore.getUserBySocketId(socket.id);
      if (user) {
        if (user.currentRoom) {
          const room = this.dataStore.getRoom(user.currentRoom);
          if (room) {
            // Remove typing indicator
            this.dataStore.removeTypingUser(user.id, user.currentRoom);
            
            // Notify other users
            socket.to(user.currentRoom).emit('user_left', user);
            
            // Update user list
            if (room.users.length > 1) {
              this.io.to(user.currentRoom).emit('room_users', room.users);
            }
          }
        }
        
        // Remove user from data store
        this.dataStore.removeUser(user.id);
        console.log(`User ${user.username} disconnected`);
      }
    } catch (error) {
      console.error('Error handling disconnect:', error);
    }
  }
} 