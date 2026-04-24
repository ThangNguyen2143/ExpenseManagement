import { ModelName } from '@/src/constants/ModelName';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const writeJSON = async (modelName: ModelName, value: object) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(modelName, jsonValue);
  } catch (e) {
    // saving error
  }
};
export async function readJSON<T>(key: string, fallback?: () => void): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? (JSON.parse(jsonValue) as T) : null;
  } catch (e) {
    console.error(`Error reading data for key "${key}":`, e);
    if (fallback) {
      fallback();
    }
    return null;
  }
}
export async function deleteData(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // remove error
  }
}
