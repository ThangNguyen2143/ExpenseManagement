export type AddNewJarDTO = {
  name: string;
  limit: number;
  accountId: string;
  isDefault?: boolean;
  isArchived?: boolean;
};
