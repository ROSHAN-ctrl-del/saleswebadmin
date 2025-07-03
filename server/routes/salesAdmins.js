import express from 'express';
import db from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all sales admins
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [admins] = await db.query('SELECT id, name, email, phone, region, status, last_login as lastLogin, created_at as createdAt FROM sales_admins');
    res.json(admins);
  } catch (error) {
    console.error('Error fetching sales admins:', error);
    res.status(500).json({ error: 'Failed to fetch sales admins' });
  }
});

// Get single sales admin
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [admin] = await db.query(
      'SELECT id, name, email, phone, region, status, last_login as lastLogin, created_at as createdAt FROM sales_admins WHERE id = ?',
      [req.params.id]
    );
    
    if (admin.length === 0) {
      return res.status(404).json({ error: 'Sales admin not found' });
    }
    
    res.json(admin[0]);
  } catch (error) {
    console.error('Error fetching sales admin:', error);
    res.status(500).json({ error: 'Failed to fetch sales admin' });
  }
});

// Create new sales admin
router.post('/', authenticateToken, async (req, res) => {
  const { name, email, phone, region, password } = req.body;
  
  try {
    // Check if email already exists
    const [existing] = await db.query('SELECT id FROM sales_admins WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    
    // Hash password (you'll need to implement this function or use bcrypt)
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await db.query(
      'INSERT INTO sales_admins (name, email, phone, region, password) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, region, hashedPassword]
    );
    
    const [newAdmin] = await db.query(
      'SELECT id, name, email, phone, region, status, last_login as lastLogin, created_at as createdAt FROM sales_admins WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newAdmin[0]);
  } catch (error) {
    console.error('Error creating sales admin:', error);
    res.status(500).json({ error: 'Failed to create sales admin' });
  }
});

// Update sales admin
router.put('/:id', authenticateToken, async (req, res) => {
  const { name, email, phone, region, status, password } = req.body;
  
  try {
    // Check if email is being changed and already exists
    if (email) {
      const [existing] = await db.query(
        'SELECT id FROM sales_admins WHERE email = ? AND id != ?',
        [email, req.params.id]
      );
      
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }
    
    let updateFields = [];
    let values = [];
    
    if (name) { updateFields.push('name = ?'); values.push(name); }
    if (email) { updateFields.push('email = ?'); values.push(email); }
    if (phone) { updateFields.push('phone = ?'); values.push(phone); }
    if (region) { updateFields.push('region = ?'); values.push(region); }
    if (status) { updateFields.push('status = ?'); values.push(status); }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push('password = ?');
      values.push(hashedPassword);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    values.push(req.params.id);
    
    await db.query(
      `UPDATE sales_admins SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );
    
    const [updatedAdmin] = await db.query(
      'SELECT id, name, email, phone, region, status, last_login as lastLogin, created_at as createdAt FROM sales_admins WHERE id = ?',
      [req.params.id]
    );
    
    res.json(updatedAdmin[0]);
  } catch (error) {
    console.error('Error updating sales admin:', error);
    res.status(500).json({ error: 'Failed to update sales admin' });
  }
});

// Delete sales admin
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM sales_admins WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting sales admin:', error);
    res.status(500).json({ error: 'Failed to delete sales admin' });
  }
});

export default router;
