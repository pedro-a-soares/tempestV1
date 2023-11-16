require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import config from 'config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './utils/connectDB';
import userRouter from './routes/user.route';
import authRouter from './routes/auth.route';
import contactsRouter from './routes/contacts.route';
import chatsRouter from './routes/chats.route';
import { startImagesClient } from './utils/initializeImages';
import { Server } from 'socket.io';

const app = express();

// Middleware

// 1. Body Parser
app.use(express.json({ limit: '500kb' }));

// 2. Cookie Parser
app.use(cookieParser());

// 3. Logger
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// 4. Cors
app.use(
  cors({
    origin: '*',//config.get<string>('origin'),
    credentials: true,
  })
);


// 5. Routes
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/chats', chatsRouter);


// Testing
app.get('/healthChecker', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to tempest',
  });
});

// UnKnown Routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

const port = config.get<number>('port');
const server = app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
  // ? call the connectDB function here
  connectDB();
  startImagesClient();
});

const io = new Server(server);

//sockets

// Map to store room information
const rooms = new Map();

// Map to store online users
const users = new Map();

// Set up a connection event
io.on('connection', (socket) => {
  socket.on('goOnline', (handle) => {
    if(!users.has(handle)) {
      socket.join('onlineUsers');
      users.set(handle, socket.id);
    }

    console.log("====> Users on", users);
  })

  socket.on('contactAdded', (contactHandle) => {
    if(users.has(contactHandle)){
      socket.to(users.get(contactHandle)).emit('syncContactState')
    }
  })

  // Handle when a user joins a room
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);

    // Store user's socket ID in the room map
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(socket.id);

    // Broadcast to others in the room that a user has joined
    socket.to(roomId).emit('userJoined');
  });

  socket.on('messageSent', (roomId) => {
    console.log("A MESSAGE WAS SENT IN ROOM =====>", roomId)
    io.to(roomId).emit('syncState')
  })

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected');

    users.forEach((socketId, handle) => {
      if(socketId === socket.id){
        users.delete(handle)
      }
    })

    console.log("====> Users on", users);

    // Find and remove the user's socket ID from the room map
    rooms.forEach((users, roomId) => {
      if (users.has(socket.id)) {
        users.delete(socket.id);

        // If the room is empty, remove it from the map
        if (users.size === 0) {
          rooms.delete(roomId);
        }
      }
    });
  });
});