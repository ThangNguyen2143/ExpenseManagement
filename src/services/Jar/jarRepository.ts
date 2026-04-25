import { StorageKeys } from '@/src/constants/ModelName';
import { AddNewJarDTO } from '@/src/types/dto/AddNewJar';
import { JarModel } from '@/src/types/Models/Jar';
import { JsonStorage } from '../db/JsonStore';
export class JarRepository {
  constructor(private db: JsonStorage) {}

  async getAll(): Promise<JarModel[]> {
    return this.db.get<JarModel[]>(StorageKeys.jars, []);
  }

  async findByAccount(accountId: string): Promise<JarModel[]> {
    const all = await this.getAll();
    return all.filter((t) => t.accountId === accountId);
  }

  async findDefaultJar(accountId: string): Promise<JarModel | undefined> {
    const all = await this.getAll();
    return all.find((t) => t.accountId === accountId && t.isDefault);
  }
  async create(input: AddNewJarDTO): Promise<void> {
    const newJar: JarModel = {
      id: crypto.randomUUID(),
      name: input.name,
      limit: input.limit,
      accountId: input.accountId,
      isDefault: input.isDefault ?? false,
      isArchived: input.isArchived ?? false,
      createdAt: new Date().toISOString(),
    };
    const all = await this.getAll();
    await this.db.set(StorageKeys.jars, [newJar, ...all]);
  }

  async update(id: string, patch: Partial<AddNewJarDTO>): Promise<void> {
    const all = await this.getAll();
    const next = all.map((t) => (t.id === id ? { ...t, ...patch } : t));
    await this.db.set(StorageKeys.jars, next);
  }

  async delete(id: string): Promise<void> {
    const all = await this.getAll();
    await this.db.set(
      StorageKeys.jars,
      all.filter((t) => t.id !== id)
    );
  }
}
