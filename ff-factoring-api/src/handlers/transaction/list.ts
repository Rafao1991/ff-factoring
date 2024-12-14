import {
  getInternalServerErrorResponse,
  getSuccessResponse,
} from '@/helpers/api-wrapper';
import { getTransactions } from '@/services/transaction';

export const listTransactionsHandler = async () => {
  try {
    const transactions = await getTransactions();
    console.info({ transactions });
    return getSuccessResponse('Transactions listed', transactions);
  } catch (error) {
    console.error({ error });
    return getInternalServerErrorResponse('Error listing transactions', error);
  }
};
