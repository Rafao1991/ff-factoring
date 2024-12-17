type TransactionType = 'cheque' | 'duplicata';

type Transaction = {
  id: string;
  assignorDocumentNumber: string;
  assignorName: string;
  payerDocumentNumber: string;
  payerName: string;
  investorDocumentNumber?: string;
  investorName?: string;
  amount: number;
  date: Date;
  dueDate: Date;
  type: TransactionType;
  completed: boolean;
  description?: string;
};
