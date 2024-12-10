import {
  getInternalServerErrorResponse,
  getSuccessResponse,
} from '@/helpers/api-wrapper';
import { scanTransactions } from '@/services/transaction';

export const listTransactionsHandler = async () => {
  try {
    const transactions = await scanTransactions();
    console.info({ transactions });
    return getSuccessResponse('Transactions listed', transactions);
  } catch (error) {
    console.error({ error });
    return getInternalServerErrorResponse('Error listing transactions', error);
  }
};
