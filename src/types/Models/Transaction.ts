export type TypeTransactionModel = 'expense' | 'income';
export type TransactionModel = {
  id: string;
  title: string;
  amount: number;
  type: TypeTransactionModel;
  jarId?: string;
  accountId: string;
  transactionAt: string; // thời điểm phát sinh giao dịch
  createdAt: string; // thời điểm record được tạo
  updatedAt: string;

  dayKey: number; // 20260423
  monthKey: number; // 202604
  yearKey: number; // 2026
  isDraft: boolean; // cho case nhập thiếu dữ liệu
};
