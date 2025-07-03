import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Plus, Search, MapPin, Phone, Mail, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SalesPerson {
  id: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  status: 'active' | 'inactive';
  currentLocation: string;
  totalSales: number;
  dealsCount: number;
  lastActivity: string;
}

const SalesAdminTeam = () => {
  const [salesPersons, setSalesPersons] = useState<SalesPerson[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice.johnson@company.com',
      phone: '+1-555-0201',
      region: 'Downtown',
      status: 'active',
      currentLocation: 'Tech District',
      totalSales: 374850, // ₹3,74,850
      dealsCount: 12,
      lastActivity: '2024-01-15T14:30:00Z',
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob.smith@company.com',
      phone: '+1-555-0202',
      region: 'Suburbs',
      status: 'active',
      currentLocation: 'Retail Park',
      totalSales: 266560, // ₹2,66,560
      dealsCount: 8,
      lastActivity: '2024-01-15T16:45:00Z',
    },
    {
      id: '3',
      name: 'Charlie Brown',
      email: 'charlie.brown@company.com',
      phone: '+1-555-0203',
      region: 'Industrial',
      status: 'inactive',
      currentLocation: 'Office',
      totalSales: 233240, // ₹2,33,240
      dealsCount: 7,
      lastActivity: '2024-01-14T09:15:00Z',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredPersons = salesPersons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Team</h1>
            <p className="text-gray-600 mt-1">Manage your sales team members and track their performance</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddModal(true)}
            className="mt-4 sm:mt-0 bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Sales Person
          </motion.button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPersons.map((person) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-lg">
                      {person.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{person.name}</h3>
                    <p className="text-sm text-gray-500">{person.region} Region</p>
                  </div>
                </div>
                <div className="relative">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {person.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {person.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  Currently at {person.currentLocation}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">₹{person.totalSales.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-gray-500">Total Sales</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{person.dealsCount}</p>
                  <p className="text-xs text-gray-500">Deals Closed</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  person.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {person.status}
                </span>
                <div className="flex space-x-2">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Edit className="h-4 w-4 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add New Sales Person</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned Region
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="">Select region</option>
                    <option value="Downtown">Downtown</option>
                    <option value="Suburbs">Suburbs</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Retail">Retail</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Add Sales Person
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SalesAdminTeam;