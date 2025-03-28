import React, { createContext, useContext, useState, useEffect } from 'react';
import { webhookService } from '../utils/webhookService';

interface User {
  id: string;
  username: string;
  email?: string;
  name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user session on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check for staff credentials first
      const staffCredentials: Record<string, { password: string, role: string, name: string }> = {
        'DRIVER123': { password: 'driver123', role: 'driver', name: 'John Driver' },
        'DRIVER456': { password: 'driver456', role: 'driver', name: 'Sarah Driver' },
        'OWNER789': { password: 'owner789', role: 'owner', name: 'Owner Admin' },
        'ADMIN123': { password: 'admin123', role: 'admin', name: 'System Admin' }
      };
      
      if (staffCredentials[username] && staffCredentials[username].password === password) {
        const userData: User = {
          id: `staff-${Date.now()}`,
          username: username,
          name: staffCredentials[username].name,
          role: staffCredentials[username].role
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      }
      
      // Check for regular user credentials
      if (username === 'demo' && password === 'password') {
        const userData: User = {
          id: '1',
          username: 'demo',
          name: 'Demo User',
          email: 'demo@example.com',
          role: 'customer'
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      }
      
      // Check for registered users in localStorage
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const foundUser = users.find((u: any) => 
        u.username === username && u.password === password
      );
      
      if (foundUser) {
        const userData: User = {
          id: foundUser.id,
          username: foundUser.username,
          name: foundUser.name,
          email: foundUser.email,
          role: 'customer'
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    username: string, 
    email: string, 
    password: string, 
    name: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if username already exists
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      if (users.some((u: any) => u.username === username)) {
        return false;
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password, // In a real app, this should be hashed
        name,
        role: 'customer'
      };
      
      // Save to "database"
      users.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      
      // Log user in
      const userData: User = {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        role: 'customer'
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Send webhook for new user registration using the specialized method
      try {
        await webhookService.sendUserRegistrationWebhook({
          event: "new_customer_signup",
          customer_id: userData.id,
          name: userData.name || "",
          email: userData.email || "",
          username: userData.username,
          registration_date: new Date().toISOString(),
          location: "Thailand", // Default location
          phone: "+66123456789" // Default phone format for Thailand
        });
        console.log("Welcome email webhook triggered successfully");
      } catch (webhookError) {
        console.error("Failed to trigger welcome email webhook:", webhookError);
        // Continue with signup process even if webhook fails
      }
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      signup, 
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
