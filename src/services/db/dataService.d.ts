export interface DataService {
  getString(key: string): Promise<string | null>;
  setString(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
  multiGet(keys: string[]): Promise<Record<string, string | null>>;
  multiSet(values: Record<string, string>): Promise<void>;
}
