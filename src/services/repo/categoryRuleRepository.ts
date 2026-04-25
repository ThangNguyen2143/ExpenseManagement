import { StorageKeys } from '@/src/constants/ModelName';
import { CategoryRuleModel } from '@/src/types/Models/CategoryRule';
import { JsonStorage } from '../db/JsonStore';
export class CategoryRuleRepository {
  constructor(private db: JsonStorage) {}

  async getAll(): Promise<CategoryRuleModel[]> {
    return this.db.get<CategoryRuleModel[]>(StorageKeys.categoryRules, []);
  }

  async findByKeyWord(keyWord: string): Promise<CategoryRuleModel[]> {
    const all = await this.getAll();
    return all.filter((t) => t.keywords.includes(keyWord));
  }

  async create(input: CategoryRuleModel): Promise<void> {
    const all = await this.getAll();
    await this.db.set(StorageKeys.categoryRules, [input, ...all]);
  }

  async update(id: string, patch: Partial<CategoryRuleModel>): Promise<void> {
    const all = await this.getAll();
    const next = all.map((t) => (t.id === id ? { ...t, ...patch } : t));
    await this.db.set(StorageKeys.categoryRules, next);
  }

  async delete(id: string): Promise<void> {
    const all = await this.getAll();
    await this.db.set(
      StorageKeys.categoryRules,
      all.filter((t) => t.id !== id)
    );
  }
}
