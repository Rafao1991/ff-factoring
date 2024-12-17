import {
  getBadRequestResponse,
  getInternalServerErrorResponse,
  getNoContentResponse,
} from '@/helpers/api-wrapper';
import { putTransaction, validTransactionTypes } from '@/services/transaction';
import { APIGatewayEvent } from 'aws-lambda';
import Snowflake from 'snowflake-id';

const offset = (new Date().getFullYear() - 1970) * 31536000 * 1000;

export const createTransactionHandler = async (event: APIGatewayEvent) => {
  console.info({ event });

  const body: Transaction = JSON.parse(event.body || '{}');
  console.info({ body: body });

  if (!body.assignorDocumentNumber) {
    console.info({ message: 'Missing assignorDocumentNumber' });
    return getBadRequestResponse('Missing assignorDocumentNumber');
  }

  if (!body.assignorName) {
    console.info({ message: 'Missing assignorName' });
    return getBadRequestResponse('Missing assignorName');
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
    const snowflake = new Snowflake({
      mid: 1,
      offset,
    });

    const newTransaction: Transaction = {
      id: snowflake.generate(),
      assignorDocumentNumber: body.assignorDocumentNumber,
      assignorName: body.assignorName,
      payerDocumentNumber: body.payerDocumentNumber,
      payerName: body.payerName,
      investorDocumentNumber: body.investorDocumentNumber,
      investorName: body.investorName,
      amount: body.amount,
      date: body.date,
      dueDate: body.dueDate,
      type: body.type,
      completed: false,
      description: body.description,
    };
    console.info({ newTransaction });
    await putTransaction(newTransaction);
    console.info({ message: 'Transaction created' });

    return getNoContentResponse();
  } catch (error) {
    console.error({ error });
    return getInternalServerErrorResponse('Error creating customer', error);
  }
};
