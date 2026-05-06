import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

declare const localStorage: {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

const tokenKey = 'lab5.authToken';

const webTokenStore = {
  get: async () => localStorage.getItem(tokenKey),
  set: async (token: string) => {
    localStorage.setItem(tokenKey, token);
  },
  remove: async () => {
    localStorage.removeItem(tokenKey);
  },
};

const nativeTokenStore = {
  get: () => SecureStore.getItemAsync(tokenKey),
  set: (token: string) => SecureStore.setItemAsync(tokenKey, token),
  remove: () => SecureStore.deleteItemAsync(tokenKey),
};

export const tokenStore = {
  get: () => (Platform.OS === 'web' ? webTokenStore.get() : nativeTokenStore.get()),
  set: (token: string) => (Platform.OS === 'web' ? webTokenStore.set(token) : nativeTokenStore.set(token)),
  remove: () => (Platform.OS === 'web' ? webTokenStore.remove() : nativeTokenStore.remove()),
};
