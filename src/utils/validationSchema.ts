import { z } from 'zod';
//This file to define validation schemas for accounts, jars, and transactions using Zod library
//Account schema
export const AccountSchema = z.object({
  name: z.string().min(1, 'Account name is required'),
  balance: z.number().min(0, 'Balance must be a non-negative number'),
});
//Jarschema
export const JarSchema = z.object({
  name: z.string().min(1, 'Jar name is required'),
  limit: z.number().min(0, 'Limit must be a non-negative number'),
  accountId: z.string().min(1, 'Account ID is required'),
  isDefault: z.boolean().optional(),
  isArchived: z.boolean().optional(),
});
//Transaction schema
export const TransactionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  amount: z.number().min(0, 'Amount must be a non-negative number'),
  type: z.enum(['expense', 'income']),
  jarId: z.string().optional(),
  accountId: z.string().optional(),
});
