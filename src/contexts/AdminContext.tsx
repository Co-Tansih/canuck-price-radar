
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface AdminContextType {
  isAdmin: boolean;
  adminData: AdminData | null;
  setAdminMode: (isAdmin: boolean) => void;
}

interface AdminData {
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

// Admin credentials - in production, this should be in environment variables
const ADMIN_CREDENTIALS = {
  email: 'admin@pricetrackr.ca',
  password: 'admin123',
  role: 'super_admin' as const,
  permissions: ['all']
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Check if current user is admin
    if (user?.email === ADMIN_CREDENTIALS.email) {
      setIsAdmin(true);
      setAdminData({
        email: user.email,
        role: ADMIN_CREDENTIALS.role,
        permissions: ADMIN_CREDENTIALS.permissions
      });
    } else {
      setIsAdmin(false);
      setAdminData(null);
    }
  }, [user]);

  const setAdminMode = (adminMode: boolean) => {
    setIsAdmin(adminMode);
  };

  const value = {
    isAdmin,
    adminData,
    setAdminMode,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const checkAdminCredentials = (email: string, password: string): boolean => {
  return email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password;
};
