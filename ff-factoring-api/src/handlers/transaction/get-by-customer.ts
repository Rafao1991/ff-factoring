import {
  getBadRequestResponse,
  getSuccessResponse,
  getInternalServerErrorResponse,
} from '@/helpers/api-wrapper';
import { getTransactionsByCustomerDocumentNumber } from '@/services/transaction';
import { APIGatewayEvent } from 'aws-lambda';

export const getTransactionsByCustomerDocumentNumberHandler = async (
  event: APIGatewayEvent
) => {
  console.info({ event });

  const customerDocumentNumber =
    event.queryStringParameters?.customerDocumentNumber;
  console.info({ customerDocumentNumber });

  if (!customerDocumentNumber) {
    console.info({ message: 'Missing customerDocumentNumber' });
    return getBadRequestResponse('Missing customerDocumentNumber');
  }

  try {
    const transactions = await getTransactionsByCustomerDocumentNumber(
      customerDocumentNumber
    );
    console.info({ transactions });

    return getSuccessResponse('Transactions found', transactions);
  } catch (error) {
    console.error({ error });
    return getInternalServerErrorResponse(
      'Error getting transactions by customerDocumentNumber',
      error
    );
  }
};
