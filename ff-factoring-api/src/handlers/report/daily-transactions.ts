import {
  getInternalServerErrorResponse,
  getNotFoundResponse,
  getSuccessResponse,
} from '@/helpers/api-wrapper';
import { getTransactionsByDateRange } from '@/services/transaction';
import { addDays, format } from 'date-fns';

const getTransactions = async (
  startDate: Date,
  endDate: Date
): Promise<Transaction[]> => {
  console.info({
    action: 'getTransactions',
    message: 'Getting transactions by date range',
    startDate: format(startDate, 'PPP'),
    endDate: format(endDate, 'PPP'),
  });
  const transactions = await getTransactionsByDateRange(startDate, endDate);
  console.info({
    action: 'getTransactions',
    message: 'Transactions by date range retrieved',
    transactions,
  });
  return transactions;
};

export const dailyTransactionsHandler = async () => {
  console.info({
    action: 'dailyTransactionsHandler',
    message: 'Daily transactions handler started',
  });

  try {
    const startDate = new Date(new Date().setHours(0, 0, 0, 0));
    const endDate = new Date(addDays(startDate, 1).setHours(0, 0, 0, 0));

    console.info({
      startDate,
      endDate,
    });

    const transactions = await getTransactions(startDate, endDate);

    if (transactions.length === 0) {
      return getSuccessResponse('Daily transactions', {
        startDate: format(startDate, 'PPP'),
        endDate: format(endDate, 'PPP'),
        transactionsByCustomer: {},
      });
    }

    const transactionsByCustomer = transactions.reduce((acc, transaction) => {
      const customerDocumentNumber = transaction.customerDocumentNumber;
      if (!acc[customerDocumentNumber]) {
        acc[customerDocumentNumber] = {
          name: transaction.customerName,
          checks: [],
          tickets: [],
          total: 0,
        };
      }

      acc[customerDocumentNumber].name = transaction.customerName;
      acc[customerDocumentNumber].total += transaction.amount;

      switch (transaction.type) {
        case 'cheque':
          acc[customerDocumentNumber].checks.push(transaction);
          break;
        case 'duplicata':
          acc[customerDocumentNumber].tickets.push(transaction);
          break;
        default:
          break;
      }

      return acc;
    }, {} as Record<string, DailyTransaction>);

    const response: DailyTransactions = {
      startDate: format(startDate, 'PP'),
      endDate: format(endDate, 'PP'),
      transactionsByCustomer,
    };

    console.info({
      action: 'dailyTransactionsHandler',
      message: 'Daily transactions handler finished',
      response,
    });

    return getSuccessResponse('Daily transactions', response);
  } catch (error) {
    console.error({ error });
    return getInternalServerErrorResponse(
      'Error getting daily transactions',
      error
    );
  }
};
