import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import {
  LayoutDashboard,
  Users,
  Package,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  UserCheck,
  ShoppingCart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  // Safely get socket context with default empty notifications
  const socketContext = useSocket();
  const notifications = socketContext?.notifications || [];
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const superAdminNavItems = [
    { path: '/super-admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/super-admin/sales-admins', icon: UserCheck, label: 'Sales Admins' },
    { path: '/super-admin/stock', icon: Package, label: 'Stock Management' },
    { path: '/super-admin/reports', icon: BarChart3, label: 'Reports' },
    { path: '/super-admin/settings', icon: Settings, label: 'Settings' },
  ];

  const salesAdminNavItems = [
    { path: '/sales-admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/sales-admin/team', icon: Users, label: 'My Team' },
    { path: '/sales-admin/customers', icon: ShoppingCart, label: 'Customers' },
    { path: '/sales-admin/reports', icon: BarChart3, label: 'Reports' },
  ];

  const navItems = user?.role === 'super_admin' ? superAdminNavItems : salesAdminNavItems;

  const handleLogout = () => {
    logout();
    navigate(`/${user?.role?.replace('_', '-')}/login`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 768) && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg md:relative md:translate-x-0"
          >
            <div className="flex h-full flex-col">
              {/* Logo */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h1 className="text-xl font-bold text-gray-900">
                  {user?.role === 'super_admin' ? 'Super Admin' : 'Sales Admin'}
                </h1>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="md:hidden"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* User Profile */}
              <div className="border-t px-4 py-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden mr-4"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-400 hover:text-gray-500"
                >
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10"
                    >
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {notifications.slice(0, 5).map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-3 rounded-lg ${
                                notification.read ? 'bg-gray-50' : 'bg-blue-50'
                              }`}
                            >
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.message}
                              </p>
                            </div>
                          ))}
                          {notifications.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">
                              No notifications
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;