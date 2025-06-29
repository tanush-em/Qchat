import { Router, Request, Response } from 'express';
import { DataStore } from '../services/DataStore';
import { ApiResponse, RoomStats } from '../types';

export function createRoutes(dataStore: DataStore): Router {
  const router = Router();

  // Health check endpoint
  router.get('/health', (req: Request, res: Response<ApiResponse>) => {
    res.json({
      success: true,
      message: 'Server is healthy',
      data: {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      },
    });
  });

  // Server status endpoint
  router.get('/', (req: Request, res: Response<ApiResponse>) => {
    res.json({
      success: true,
      message: 'QChat Server is running',
      data: {
        name: 'QChat Server',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        status: 'online',
      },
    });
  });

  // Get rooms and statistics
  router.get('/rooms', (req: Request, res: Response<ApiResponse<RoomStats>>) => {
    try {
      const stats = dataStore.getStats();
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Error getting room statistics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get room statistics',
      });
    }
  });

  // Get specific room details
  router.get('/rooms/:roomId', (req: Request, res: Response<ApiResponse>) => {
    try {
      const { roomId } = req.params;
      const room = dataStore.getRoom(roomId);
      
      if (!room) {
        return res.status(404).json({
          success: false,
          error: 'Room not found',
        });
      }

      res.json({
        success: true,
        data: {
          id: room.id,
          name: room.name,
          userCount: room.users.length,
          messageCount: room.messages.length,
          createdAt: room.createdAt,
          lastActivity: room.lastActivity,
          users: room.users.map(user => ({
            id: user.id,
            username: user.username,
            joinedAt: user.joinedAt,
          })),
        },
      });
    } catch (error) {
      console.error('Error getting room details:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get room details',
      });
    }
  });

  // Get room messages
  router.get('/rooms/:roomId/messages', (req: Request, res: Response<ApiResponse>) => {
    try {
      const { roomId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      
      const room = dataStore.getRoom(roomId);
      if (!room) {
        return res.status(404).json({
          success: false,
          error: 'Room not found',
        });
      }

      const messages = dataStore.getRoomMessages(roomId, Math.min(limit, 100));
      
      res.json({
        success: true,
        data: {
          roomId,
          roomName: room.name,
          messages,
          totalMessages: room.messages.length,
        },
      });
    } catch (error) {
      console.error('Error getting room messages:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get room messages',
      });
    }
  });

  // Get all users
  router.get('/users', (req: Request, res: Response<ApiResponse>) => {
    try {
      const users = dataStore.getAllUsers();
      res.json({
        success: true,
        data: {
          users: users.map(user => ({
            id: user.id,
            username: user.username,
            currentRoom: user.currentRoom,
            joinedAt: user.joinedAt,
          })),
          totalUsers: users.length,
        },
      });
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get users',
      });
    }
  });

  // 404 handler
  router.use('*', (req: Request, res: Response<ApiResponse>) => {
    res.status(404).json({
      success: false,
      error: 'Endpoint not found',
    });
  });

  return router;
} 