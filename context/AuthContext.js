// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('edUserInfo');
      if (storedUser) setUser(JSON.parse(storedUser));
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const login = async (userData) => {
    // console.log('userData', userData);
    setUser(userData);
    await AsyncStorage.setItem('edUserInfo', JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('edUserInfo');
    await AsyncStorage.removeItem('edToken');
    navigation.navigate("auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
