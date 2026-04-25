export type StorageErrorCode =
  | 'READ_FAILED'
  | 'WRITE_FAILED'
  | 'JSON_PARSE_FAILED'
  | 'MIGRATION_FAILED'
  | 'DATA_CORRUPTED';

export class AppStorageError extends Error {
  constructor(
    public code: StorageErrorCode,
    message: string,
    public cause?: unknown
  ) {
    super(message);
  }
}
