import {
  getBadRequestResponse,
  getSuccessResponse,
  getInternalServerErrorResponse,
} from '@/helpers/api-wrapper';
import { getTransactionsByAssignorDocumentNumber } from '@/services/transaction';
import { APIGatewayEvent } from 'aws-lambda';

export const getTransactionsByAssignorDocumentNumberHandler = async (
  event: APIGatewayEvent
) => {
  console.info({ event });

  const assignorDocumentNumber =
    event.queryStringParameters?.assignorDocumentNumber;
  console.info({ assignorDocumentNumber });

  if (!assignorDocumentNumber) {
    console.info({ message: 'Missing assignorDocumentNumber' });
    return getBadRequestResponse('Missing assignorDocumentNumber');
  }

  try {
    const transactions = await getTransactionsByAssignorDocumentNumber(
      assignorDocumentNumber
    );
    console.info({ transactions });

    return getSuccessResponse('Transactions found', transactions);
  } catch (error) {
    console.error({ error });
    return getInternalServerErrorResponse(
      'Error getting transactions by assignorDocumentNumber',
      error
    );
  }
};
