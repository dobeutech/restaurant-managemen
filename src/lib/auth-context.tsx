import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RolePermissions } from '@/lib/types';
import { getRolePermissions } from '@/lib/permissions';
import { useKV } from '@github/spark/hooks';

interface AuthContextType {
  user: User | null;
  permissions: RolePermissions | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<RolePermissions | null>(null);
  const [users] = useKV<User[]>('users', []);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setPermissions(getRolePermissions(userData.role));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const foundUser = users?.find((u) => u.username === username);
    
    if (foundUser) {
      setUser(foundUser);
      setPermissions(getRolePermissions(foundUser.role));
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setPermissions(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
