type TransactionType = 'cheque' | 'duplicata';

type Transaction = {
  id: string;
  customerDocumentNumber: string;
  customerName: string;
  amount: number;
  date: Date;
  dueDate: Date;
  type: TransactionType;
  completed: boolean;
};
