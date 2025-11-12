
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  email: string;
  phone?: string;
  searchesRemaining: number;
  isPremium: boolean;
  premiumExpiresAt?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, phone?: string) => Promise<void>;
  signOut: () => Promise<void>;
  decrementSearches: () => Promise<void>;
  updatePremiumStatus: (isPremium: boolean, expiresAt?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        setUser(JSON.parse(userJson));
      }
    } catch (error) {
      console.log('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // In a real app, this would call your backend API
      // For now, we'll simulate authentication
      const storedPassword = await SecureStore.getItemAsync(`password_${email}`);
      
      if (storedPassword !== password) {
        throw new Error('Invalid credentials');
      }

      const userJson = await AsyncStorage.getItem(`user_${email}`);
      if (userJson) {
        const userData = JSON.parse(userJson);
        setUser(userData);
        await AsyncStorage.setItem('user', userJson);
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.log('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, phone?: string) => {
    try {
      // Check if user already exists
      const existingUser = await AsyncStorage.getItem(`user_${email}`);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Create new user with 3 free searches
      const newUser: User = {
        id: Date.now().toString(),
        email,
        phone,
        searchesRemaining: 3,
        isPremium: false,
      };

      // Store password securely
      await SecureStore.setItemAsync(`password_${email}`, password);
      
      // Store user data
      const userJson = JSON.stringify(newUser);
      await AsyncStorage.setItem(`user_${email}`, userJson);
      await AsyncStorage.setItem('user', userJson);
      
      setUser(newUser);
    } catch (error) {
      console.log('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.log('Sign out error:', error);
      throw error;
    }
  };

  const decrementSearches = async () => {
    if (!user) return;

    if (user.isPremium) {
      // Premium users have unlimited searches
      return;
    }

    if (user.searchesRemaining > 0) {
      const updatedUser = {
        ...user,
        searchesRemaining: user.searchesRemaining - 1,
      };
      
      const userJson = JSON.stringify(updatedUser);
      await AsyncStorage.setItem(`user_${user.email}`, userJson);
      await AsyncStorage.setItem('user', userJson);
      setUser(updatedUser);
    }
  };

  const updatePremiumStatus = async (isPremium: boolean, expiresAt?: string) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      isPremium,
      premiumExpiresAt: expiresAt,
    };

    const userJson = JSON.stringify(updatedUser);
    await AsyncStorage.setItem(`user_${user.email}`, userJson);
    await AsyncStorage.setItem('user', userJson);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        decrementSearches,
        updatePremiumStatus,
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
