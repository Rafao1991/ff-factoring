import {
  getInternalServerErrorResponse,
  getNoContentResponse,
} from '@/helpers/api-wrapper';
import { putTransaction } from '@/services/transaction';
import { APIGatewayEvent } from 'aws-lambda';
import Snowflake from 'snowflake-id';

const validTransactionTypes = ['cheque', 'duplicata'] as const;
const offset = (new Date().getFullYear() - 1970) * 31536000 * 1000;

export const createTransactionHandler = async (event: APIGatewayEvent) => {
  console.info({ event });

  const newTransaction: Transaction = JSON.parse(event.body || '{}');
  console.info({ body: newTransaction });

  if (!newTransaction.customerDocumentNumber) {
    console.info({ message: 'Missing customerDocumentNumber' });
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing customerDocumentNumber',
      }),
    };
  }

  if (!newTransaction.customerName) {
    console.info({ message: 'Missing customerName' });
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing customerName',
      }),
    };
  }

  if (!newTransaction.amount) {
    console.info({ message: 'Missing amount' });
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing amount',
      }),
    };
  }

  if (!newTransaction.date) {
    console.info({ message: 'Missing date' });
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing date',
      }),
    };
  }

  if (!newTransaction.dueDate) {
    console.info({ message: 'Missing dueDate' });
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing dueDate',
      }),
    };
  }

  if (
    !newTransaction.type ||
    !validTransactionTypes.includes(newTransaction.type)
  ) {
    console.info({ message: 'Missing type' });
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing type',
      }),
    };
  }

  if (
    newTransaction.completed === undefined ||
    newTransaction.completed === null ||
    newTransaction.completed === true
  ) {
    console.info({
      message: 'Wrong transaction status',
    });
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Wrong transaction status',
      }),
    };
  }

  try {
    const snowflake = new Snowflake({
      mid: 1,
      offset,
    });
    newTransaction.id = snowflake.generate();
    await putTransaction(newTransaction);
    console.info({ message: 'Transaction created' });

    return getNoContentResponse();
  } catch (error) {
    console.error({ error });
    return getInternalServerErrorResponse('Error creating customer', error);
  }
};
