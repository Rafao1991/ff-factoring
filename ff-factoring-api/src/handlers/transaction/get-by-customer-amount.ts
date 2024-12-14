import {
  getBadRequestResponse,
  getSuccessResponse,
  getInternalServerErrorResponse,
} from '@/helpers/api-wrapper';
import { getTransactionsByCustomerDocumentNumberAndAmountRange } from '@/services/transaction';
import { APIGatewayEvent } from 'aws-lambda';

export const getTransactionsByCustomerDocumentNumberAndAmountRangeHandler =
  async (event: APIGatewayEvent) => {
    console.info({ event });

    const customerDocumentNumber =
      event.queryStringParameters?.customerDocumentNumber;
    const minAmount = event.queryStringParameters?.minAmount;
    const maxAmount = event.queryStringParameters?.maxAmount;
    console.info({ customerDocumentNumber, minAmount, maxAmount });

    if (!customerDocumentNumber) {
      console.info({ message: 'Missing customerDocumentNumber' });
      return getBadRequestResponse('Missing customerDocumentNumber');
    }

    if (minAmount && isNaN(Number(minAmount))) {
      console.info({ message: 'minAmount is not a number' });
      return getBadRequestResponse('minAmount is not a number');
    }

    if (maxAmount && isNaN(Number(maxAmount))) {
      console.info({ message: 'maxAmount is not a number' });
      return getBadRequestResponse('maxAmount is not a number');
    }

    try {
      const transactions =
        await getTransactionsByCustomerDocumentNumberAndAmountRange(
          customerDocumentNumber,
          minAmount ? Number(minAmount) : 0,
          maxAmount ? Number(maxAmount) : Number.MAX_SAFE_INTEGER
        );
      console.info({ transactions });

      return getSuccessResponse('Transactions found', transactions);
    } catch (error) {
      console.error({ error });
      return getInternalServerErrorResponse(
        'Error getting transactions by customerDocumentNumber and amount range',
        error
      );
    }
  };
