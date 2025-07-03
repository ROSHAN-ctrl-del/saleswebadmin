import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import stockRoutes from './routes/stock.js';
import salesRoutes from './routes/sales.js';
import reportsRoutes from './routes/reports.js';
import customerRoutes from './routes/customers.js';
import salesAdminRoutes from './routes/salesAdmins.js';
import { authenticateToken, authenticateSocket } from './middleware/auth.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/stock', authenticateToken, stockRoutes);
app.use('/api/sales', authenticateToken, salesRoutes);
app.use('/api/reports', authenticateToken, reportsRoutes);
app.use('/api/customers', authenticateToken, customerRoutes);
app.use('/api/sales-admins', authenticateToken, salesAdminRoutes);

// Socket.IO for real-time features
io.use(authenticateSocket);

io.on('connection', (socket) => {
  console.log('User connected:', socket.user?.email);
  
  socket.join(`role_${socket.user?.role}`);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.user?.email);
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io };