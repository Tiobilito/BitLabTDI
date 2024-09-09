import * as SecureStore from 'expo-secure-store'
import { createClient } from '@supabase/supabase-js'
//import { SupaLink, SupaAnonKey } from '../LocalV'

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key)
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value)
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key)
  },
}

//Project URL
const supabaseUrl = "https://lpxsgoriiklrtkyfoxtk.supabase.co"
//API Key
const supabaseAnonKey= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxweHNnb3JpaWtscnRreWZveHRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY5MzkyNDUsImV4cCI6MjAzMjUxNTI0NX0.HSSUL1zoy944xHop9X36WGHDvdE4zUe9Y7Fb0GNVUj0"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: ExpoSecureStoreAdapter as any,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })