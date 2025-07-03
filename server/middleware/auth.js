import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    // For demo purposes, we'll accept any token
    // In production, you'd verify the JWT properly
    const decoded = jwt.decode(token) || {
      id: '1',
      email: 'demo@example.com',
      role: 'super_admin'
    };
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Access token required'));
  }

  try {
    // For demo purposes, we'll accept any token
    const decoded = jwt.decode(token) || {
      id: '1',
      email: 'demo@example.com',
      role: 'super_admin'
    };
    
    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};