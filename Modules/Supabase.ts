import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Crea un adaptador universal para el almacenamiento
const UniversalStorageAdapter = {
  getItem: async (key: string) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key); // Usa localStorage para la web
    } else {
      return await AsyncStorage.getItem(key); // Usa AsyncStorage para móviles
    }
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value); // Usa localStorage para la web
    } else {
      await AsyncStorage.setItem(key, value); // Usa AsyncStorage para móviles
    }
  },
  removeItem: async (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key); // Usa localStorage para la web
    } else {
      await AsyncStorage.removeItem(key); // Usa AsyncStorage para móviles
    }
  },
};

//Project URL
const supabaseUrl = process.env.EXPO_PUBLIC_API_URL;
//API Key
const supabaseAnonKey= process.env.EXPO_PUBLIC_API_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: UniversalStorageAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
