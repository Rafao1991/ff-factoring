type TransactionType = 'Cheque' | 'Duplicata';

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
