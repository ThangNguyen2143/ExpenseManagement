import { StorageKey } from '@/src/constants/ModelName';
import { DataService } from './dataService';
import { AppStorageError } from './StorageError';
type JsonStorageOptions = {
  removeCorruptedData?: boolean;
};
export class JsonStorage {
  constructor(
    private storage: DataService,
    private options: JsonStorageOptions = {}
  ) {}

  async get<T>(key: StorageKey, fallback: T): Promise<T> {
    let raw: string | null;

    try {
      raw = await this.storage.getString(key);
    } catch (error) {
      throw new AppStorageError(
        'READ_FAILED',
        `Failed to read data from storage key: ${key}`,
        error
      );
    }

    if (!raw) return fallback;

    try {
      return JSON.parse(raw) as T;
    } catch (error) {
      if (this.options.removeCorruptedData) {
        await this.removeCorruptedKey(key);
      }
      throw new AppStorageError(
        'JSON_PARSE_FAILED',
        `Failed to parse JSON from storage key: ${key}`,
        error
      );
    }
  }

  async set<T>(key: StorageKey, value: T): Promise<void> {
    try {
      await this.storage.setString(key, JSON.stringify(value));
    } catch (error) {
      throw new AppStorageError(
        'WRITE_FAILED',
        `Failed to write data to storage key: ${key}`,
        error
      );
    }
  }

  async remove(key: StorageKey): Promise<void> {
    try {
      await this.storage.remove(key);
    } catch (error) {
      throw new AppStorageError(
        'WRITE_FAILED',
        `Failed to remove data from storage key: ${key}`,
        error
      );
    }
  }

  async getMulti<T extends Record<StorageKey, unknown>>(
    keys: StorageKey[],
    fallback: T
  ): Promise<T> {
    let rawMap: Record<StorageKey, string | null>;

    try {
      rawMap = await this.storage.multiGet(keys);
    } catch (error) {
      throw new AppStorageError(
        'READ_FAILED',
        `Failed to read multiple storage keys: ${keys.join(', ')}`,
        error
      );
    }

    const result = { ...fallback };

    for (const key of keys) {
      const raw = rawMap[key];

      if (!raw) continue;

      try {
        result[key as keyof T] = JSON.parse(raw) as T[keyof T];
      } catch (error) {
        if (this.options.removeCorruptedData) {
          await this.removeCorruptedKey(key);
        }
        throw new AppStorageError(
          'JSON_PARSE_FAILED',
          `Failed to parse JSON from storage key: ${key}`,
          error
        );
      }
    }

    return result;
  }

  async setMulti(values: Partial<Record<StorageKey, unknown>>): Promise<void> {
    const keys = Object.keys(values) as StorageKey[];
    const serializedValues: Record<string, string> = {};

    try {
      for (const key of keys) {
        serializedValues[key] = JSON.stringify(values[key]);
      }

      await this.storage.multiSet(serializedValues);
    } catch (error) {
      throw new AppStorageError(
        'WRITE_FAILED',
        `Failed to write multiple storage keys: ${Object.keys(values).join(', ')}`,
        error
      );
    }
  }
  private async removeCorruptedKey(key: StorageKey): Promise<void> {
    try {
      await this.storage.remove(key);
    } catch (error) {
      throw new AppStorageError(
        'DATA_CORRUPTED',
        `Failed to remove corrupted storage key: ${key}`,
        error
      );
    }
  }
}
