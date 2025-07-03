import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from '../services/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'sales_admin';
  avatar?: string;
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: any): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        user: null,
        token: null,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user data
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // You would typically verify the token here
      // For demo purposes, we'll assume it's valid
    }
  }, []);

  const login = async (email: string, password: string, role: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      // Demo authentication - replace with real API call
      if (
        (email === 'superadmin@example.com' && password === 'admin123' && role === 'super_admin') ||
        (email === 'salesadmin@example.com' && password === 'sales123' && role === 'sales_admin')
      ) {
        const userData = {
          id: '1',
          email,
          name: role === 'super_admin' ? 'Super Admin' : 'Sales Admin',
          role: role as 'super_admin' | 'sales_admin',
          isActive: true,
        };
        
        const token = 'demo-jwt-token';
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: userData, token },
        });
        
        toast.success('Login successful!');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      toast.error('Invalid credentials');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const value = {
    ...state,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};