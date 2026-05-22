import { TransactionModel } from '../types/Models/Transaction';
type DateKeyParts = {
  year: number;
  month: number;
  day: number;
};
export function splitDateKeyStrict(dateKey: number): DateKeyParts {
  const str = String(dateKey);

  if (!/^\d{8}$/.test(str)) {
    throw new Error('dateKey phải có dạng yyyyMMdd');
  }

  const year = Number(str.slice(0, 4));
  const month = Number(str.slice(4, 6));
  const day = Number(str.slice(6, 8));

  const date = new Date(year, month - 1, day);

  const isValid =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

  if (!isValid) {
    throw new Error('dateKey không phải ngày hợp lệ');
  }

  return { year, month, day };
}
/**
 *
 * @param month Tháng (1-12)
 * @param day Ngày cần kiểm tra (1-31)
 * @returns Kết quả true nếu là ngày cuối cùng của tháng, false nếu không phải
 */
function isLastDayInMonth(month: number, day: number): boolean {
  const year = new Date().getFullYear();
  const lastDay = new Date(year, month, 0).getDate();
  return day === lastDay;
}
function createTitlefromDateKey(dateKey: number) {
  const today = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  let title = '';
  const { year: y, month: m, day: d } = splitDateKeyStrict(dateKey);
  if (y === year && m === month && d === today) {
    title = 'Hôm nay';
  } else if (y === year && m === month && d === today - 1) {
    title = 'Hôm qua';
  } else if (y === year && m === month - 1 && today === 1 && isLastDayInMonth(m - 1, d)) {
    title = 'Cuối tháng trước';
  } else {
    title = `Cũ hơn`;
  }
  return title;
}
export default function groupTransactionByDate(transactions: TransactionModel[]) {
  let groupedTransactions: { title: string; data: TransactionModel[] }[] = [];

  transactions.forEach((transaction) => {
    const datekey = transaction.dayKey;
    let title = createTitlefromDateKey(datekey);
    const existingGroup = groupedTransactions.find((group) => group.title === title);
    if (existingGroup) {
      existingGroup.data.push(transaction);
    } else {
      groupedTransactions.push({ title, data: [transaction] });
    }
  });

  return groupedTransactions;
}
