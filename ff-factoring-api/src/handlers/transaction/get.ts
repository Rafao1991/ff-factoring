import {
  getBadRequestResponse,
  getInternalServerErrorResponse,
  getNotFoundResponse,
  getSuccessResponse,
} from '@/helpers/api-wrapper';
import { getTransactionById } from '@/services/transaction';
import { APIGatewayEvent } from 'aws-lambda';

export const getTransactionHandler = async (event: APIGatewayEvent) => {
  console.info({ event });

  const id = event.pathParameters?.id;
  console.info({ id });

  if (!id) {
    console.info({ message: 'Missing id' });
    return getBadRequestResponse('Missing id');
  }

  try {
    const transaction = await getTransactionById(id);
    console.info({ transaction });

    if (!transaction) {
      return getNotFoundResponse('Transaction not found');
    }

    return getSuccessResponse('Transaction found', transaction);
  } catch (error) {
    console.error({ error });
    return getInternalServerErrorResponse('Error getting transaction', error);
  }
};
