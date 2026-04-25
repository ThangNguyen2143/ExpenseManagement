import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataService } from './dataService';

export const asyncStorageAdapter: DataService = {
  async getString(key) {
    return AsyncStorage.getItem(key);
  },

  async setString(key, value) {
    await AsyncStorage.setItem(key, value);
  },

  async remove(key) {
    await AsyncStorage.removeItem(key);
  },

  async multiGet(keys) {
    const pairs = await AsyncStorage.multiGet(keys);
    return Object.fromEntries(pairs);
  },

  async multiSet(values) {
    await AsyncStorage.multiSet(Object.entries(values));
  },
};
