import {
  getBadRequestResponse,
  getInternalServerErrorResponse,
  getNoContentResponse,
} from '@/helpers/api-wrapper';
import {
  getTransactionById,
  putTransaction,
  validTransactionTypes,
} from '@/services/transaction';
import { APIGatewayEvent } from 'aws-lambda';

export const updateTransactionHandler = async (event: APIGatewayEvent) => {
  console.info({ event });

  const id = event.pathParameters?.id;
  const body = JSON.parse(event.body || '{}');
  console.info({ id, body });

  if (!id) {
    console.info({ message: 'Missing id' });
    return getBadRequestResponse('Missing id');
  }

  if (!body.customerDocumentNumber) {
    console.info({ message: 'Missing customerDocumentNumber' });
    return getBadRequestResponse('Missing customerDocumentNumber');
  }

  if (!body.customerName) {
    console.info({ message: 'Missing customerName' });
    return getBadRequestResponse('Missing customerName');
  }

  if (!body.amount) {
    console.info({ message: 'Missing amount' });
    return getBadRequestResponse('Missing amount');
  }

  if (!body.date) {
    console.info({ message: 'Missing date' });
    return getBadRequestResponse('Missing date');
  }

  if (!body.dueDate) {
    console.info({ message: 'Missing dueDate' });
    return getBadRequestResponse('Missing dueDate');
  }

  if (!body.type || !validTransactionTypes.includes(body.type)) {
    console.info({ message: 'Missing type' });
    return getBadRequestResponse('Missing type');
  }

  try {
    const existingTransaction = await getTransactionById(id);
    console.info({ existingTransaction });

    if (!existingTransaction) {
      console.info({ message: 'Transaction not found' });
      return getBadRequestResponse('Transaction not found');
    }

    const transaction: Transaction = {
      id: existingTransaction.id,
      customerDocumentNumber: body.customerDocumentNumber,
      customerName: body.customerName,
      amount: body.amount,
      date: body.date,
      dueDate: body.dueDate,
      type: body.type,
      completed: existingTransaction.completed,
    };
    console.info({ transaction });

    await putTransaction(transaction);

    return getNoContentResponse();
  } catch (error) {
    console.error({ error });
    return getInternalServerErrorResponse('Error creating customer', error);
  }
};
