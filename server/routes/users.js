import express from 'express';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Demo data
let salesAdmins = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    phone: '+1-555-0123',
    region: 'North Region',
    status: 'active',
    lastLogin: '2024-01-15T10:30:00Z',
    salesPersonsCount: 12,
    totalSales: 450000,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1-555-0124',
    region: 'South Region',
    status: 'active',
    lastLogin: '2024-01-14T16:45:00Z',
    salesPersonsCount: 8,
    totalSales: 320000,
  },
];

let salesPersons = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@company.com',
    phone: '+1-555-0201',
    region: 'Downtown',
    status: 'active',
    currentLocation: 'Tech District',
    totalSales: 4500,
    dealsCount: 12,
    lastActivity: '2024-01-15T14:30:00Z',
    salesAdminId: '1',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob.smith@company.com',
    phone: '+1-555-0202',
    region: 'Suburbs',
    status: 'active',
    currentLocation: 'Retail Park',
    totalSales: 3200,
    dealsCount: 8,
    lastActivity: '2024-01-15T16:45:00Z',
    salesAdminId: '1',
  },
];

// Sales Admins routes (Super Admin only)
router.get('/sales-admins', requireRole(['super_admin']), (req, res) => {
  res.json(salesAdmins);
});

router.post('/sales-admins', requireRole(['super_admin']), (req, res) => {
  const newAdmin = {
    id: Date.now().toString(),
    ...req.body,
    status: 'active',
    lastLogin: null,
    salesPersonsCount: 0,
    totalSales: 0,
  };
  salesAdmins.push(newAdmin);
  res.status(201).json(newAdmin);
});

router.put('/sales-admins/:id', requireRole(['super_admin']), (req, res) => {
  const id = req.params.id;
  const index = salesAdmins.findIndex(admin => admin.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Sales admin not found' });
  }
  
  salesAdmins[index] = { ...salesAdmins[index], ...req.body };
  res.json(salesAdmins[index]);
});

router.delete('/sales-admins/:id', requireRole(['super_admin']), (req, res) => {
  const id = req.params.id;
  salesAdmins = salesAdmins.filter(admin => admin.id !== id);
  res.json({ message: 'Sales admin deleted successfully' });
});

// Sales Persons routes
router.get('/sales-persons', requireRole(['super_admin', 'sales_admin']), (req, res) => {
  let filteredPersons = salesPersons;
  
  // If sales admin, only show their team members
  if (req.user.role === 'sales_admin') {
    filteredPersons = salesPersons.filter(person => person.salesAdminId === req.user.id);
  }
  
  res.json(filteredPersons);
});

router.post('/sales-persons', requireRole(['super_admin', 'sales_admin']), (req, res) => {
  const newPerson = {
    id: Date.now().toString(),
    ...req.body,
    status: 'active',
    totalSales: 0,
    dealsCount: 0,
    lastActivity: new Date().toISOString(),
    salesAdminId: req.user.role === 'sales_admin' ? req.user.id : req.body.salesAdminId,
  };
  salesPersons.push(newPerson);
  res.status(201).json(newPerson);
});

router.put('/sales-persons/:id', requireRole(['super_admin', 'sales_admin']), (req, res) => {
  const id = req.params.id;
  const index = salesPersons.findIndex(person => person.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Sales person not found' });
  }
  
  // Sales admin can only edit their own team members
  if (req.user.role === 'sales_admin' && salesPersons[index].salesAdminId !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to edit this sales person' });
  }
  
  salesPersons[index] = { ...salesPersons[index], ...req.body };
  res.json(salesPersons[index]);
});

router.delete('/sales-persons/:id', requireRole(['super_admin', 'sales_admin']), (req, res) => {
  const id = req.params.id;
  const personIndex = salesPersons.findIndex(person => person.id === id);
  
  if (personIndex === -1) {
    return res.status(404).json({ message: 'Sales person not found' });
  }
  
  // Sales admin can only delete their own team members
  if (req.user.role === 'sales_admin' && salesPersons[personIndex].salesAdminId !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to delete this sales person' });
  }
  
  salesPersons = salesPersons.filter(person => person.id !== id);
  res.json({ message: 'Sales person deleted successfully' });
});

export default router;