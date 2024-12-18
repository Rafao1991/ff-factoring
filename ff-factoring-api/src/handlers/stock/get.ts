import { getStockLimit } from '@/configs';
import {
  getInternalServerErrorResponse,
  getSuccessResponse,
} from '@/helpers/api-wrapper';
import { getTransactions } from '@/services/transaction';

const stockLimit = getStockLimit();

export const getStockHandler = async () => {
  try {
    const transactions = await getTransactions();
    console.info({ transactions });

    let total = 0;
    let completedBalance = 0;
    const transactionsNotCompleted: Transaction[] = [];

    transactions.forEach((transaction) => {
      total += transaction.amount;
      if (transaction.completed) {
        completedBalance += transaction.amount;
        return;
      }
      transactionsNotCompleted.push(transaction);
    });

    const currentBalance = total - completedBalance;
    const remainingBalance = stockLimit - currentBalance;
    const response = {
      transactionsNotCompleted,
      stockLimit,
      currentBalance,
      remainingBalance,
      total,
      completedBalance,
    };
    console.info({
      ...response,
    });

    return getSuccessResponse('Transactions listed', response);
  } catch (error) {
    console.error({ error });
    return getInternalServerErrorResponse('Error listing transactions', error);
  }
};
