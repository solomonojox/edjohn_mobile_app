// hooks/useAuth.js
import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create an authentication context
const AuthContext = createContext({});

// Provider component that wraps your app and makes auth object available to any child component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in when the app loads
    async function loadUserFromStorage() {
      try {
        const userJson = await AsyncStorage.getItem('edUserInfo');
        setUser(userJson ? JSON.parse(userJson) : null);
      } catch (error) {
        console.error('Failed to load user from storage:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadUserFromStorage();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      // Replace with your actual authentication API call
      // Example API call:
      // const response = await fetch('https://your-api.com/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      // const userData = await response.json();
      
      // For demonstration, creating mock user data
      const userData = { id: '123', email, name: 'Student Name' };
      
      // Save user data to storage
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Registration function
  const signup = async (email, password, name) => {
    try {
      // Replace with your actual registration API call
      // Example API call:
      // const response = await fetch('https://your-api.com/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password, name }),
      // });
      // const userData = await response.json();
      
      // For demonstration, creating mock user data
      const userData = { id: '123', email, name };
      
      // Save user data to storage
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Signup failed:', error);
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      login,
      logout,
      signup,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for using the auth context
export const useAuth = () => useContext(AuthContext);