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

// URL del proyecto y clave de API
const supabaseUrl = 'https://lpxsgoriiklrtkyfoxtk.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxweHNnb3JpaWtscnRreWZveHRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY5MzkyNDUsImV4cCI6MjAzMjUxNTI0NX0.HSSUL1zoy944xHop9X36WGHDvdE4zUe9Y7Fb0GNVUj0';

// Configura Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: UniversalStorageAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
