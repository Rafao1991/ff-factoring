import {
  getBadRequestResponse,
  getInternalServerErrorResponse,
  getNoContentResponse,
} from '@/helpers/api-wrapper';
import { getTransactionById, putTransaction } from '@/services/transaction';
import { APIGatewayEvent } from 'aws-lambda';

export const completeTransactionHandler = async (event: APIGatewayEvent) => {
  console.info({ event });

  const id = event.pathParameters?.id;
  console.info({ id });

  if (!id) {
    console.info({ message: 'Missing id' });
    return getBadRequestResponse('Missing id');
  }

  try {
    const existingTransaction = await getTransactionById(id);
    console.info({ existingTransaction });

    if (!existingTransaction) {
      console.info({ message: 'Transaction not found' });
      return getBadRequestResponse('Transaction not found');
    }

    if (existingTransaction.completed) {
      console.info({ message: 'Transaction already completed' });
      return getBadRequestResponse('Transaction already completed');
    }

    const transaction: Transaction = {
      id: existingTransaction.id,
      assignorDocumentNumber: existingTransaction.assignorDocumentNumber,
      assignorName: existingTransaction.assignorName,
      payerDocumentNumber: existingTransaction.payerDocumentNumber,
      payerName: existingTransaction.payerName,
      investorDocumentNumber: existingTransaction.investorDocumentNumber,
      investorName: existingTransaction.investorName,
      amount: existingTransaction.amount,
      date: existingTransaction.date,
      dueDate: existingTransaction.dueDate,
      type: existingTransaction.type,
      completed: true,
      description: existingTransaction.description,
    };
    console.info({ transaction });

    await putTransaction(transaction);

    return getNoContentResponse();
  } catch (error) {
    console.error({ error });
    return getInternalServerErrorResponse(
      'Error completing transaction',
      error
    );
  }
};
