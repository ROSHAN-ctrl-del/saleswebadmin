import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Demo users
const users = [
  {
    id: '1',
    email: 'superadmin@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: admin123
    name: 'Super Admin',
    role: 'super_admin',
    isActive: true,
  },
  {
    id: '2',
    email: 'salesadmin@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: sales123
    name: 'Sales Admin',
    role: 'sales_admin',
    isActive: true,
  },
];

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Find user
    const user = users.find(u => u.email === email && u.role === role);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password (for demo, we'll accept the demo passwords)
    const isValidPassword = 
      (email === 'superadmin@example.com' && password === 'admin123') ||
      (email === 'salesadmin@example.com' && password === 'sales123');
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data and token
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Refresh token
router.post('/refresh', (req, res) => {
  // In a real app, you'd validate the refresh token
  res.json({ message: 'Token refreshed' });
});

export default router;