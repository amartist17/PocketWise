import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const TOKEN_KEY = 'pocketwise-access-token';
const storage = Platform.OS === 'web'
  ? {
      getItemAsync: (key: string) => AsyncStorage.getItem(key),
      setItemAsync: (key: string, value: string) => AsyncStorage.setItem(key, value),
      deleteItemAsync: (key: string) => AsyncStorage.removeItem(key),
    }
  : SecureStore;

export const tokenStorage = {
  get: () => storage.getItemAsync(TOKEN_KEY),
  set: (token: string) => storage.setItemAsync(TOKEN_KEY, token),
  remove: () => storage.deleteItemAsync(TOKEN_KEY),
};
