import { AddTransactionDTO } from '@/src/types/dto/AddTransaction.dto';
import { TransactionModel } from '@/src/types/Models/Transaction';

export async function AddNewTransaction(payload: AddTransactionDTO) {
  //Chuyển đổi payload thành TransactionModel và lưu vào database
  if (!payload.accountId) {
    // Nếu không có accountId, gán một giá trị mặc định hoặc xử lý theo logic của bạn
  }
  const transaction: TransactionModel = {
    id: Date.now().toString(),
    title: payload.title,
    amount: payload.amount,
    type: payload.type,
    dayKey: Number(new Date().toISOString().slice(0, 10).replace(/-/g, '')), // 20260423
    monthKey: Number(new Date().toISOString().slice(0, 7).replace(/-/g, '')), // 202604
    yearKey: Number(new Date().toISOString().slice(0, 4)), // 2026
    isDraft: true, // mặc định là draft, có thể cập nhật sau khi hoàn thiện dữ liệu
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
    transactionAt: Date.now().toString(),
    accountId: payload.accountId || 'default-account-id',
  };
  if (payload.jarId) {
    transaction.jarId = payload.jarId;
    transaction.isDraft = false;
  }
  // Lưu transaction vào database
}
