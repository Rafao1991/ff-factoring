import {
  getBadRequestResponse,
  getSuccessResponse,
  getInternalServerErrorResponse,
} from '@/helpers/api-wrapper';
import { getTransactionsByCustomerDocumentNumberAndDueDateRange } from '@/services/transaction';
import { APIGatewayEvent } from 'aws-lambda';
import { isValid, toDate } from 'date-fns';

export const getTransactionsByCustomerDocumentNumberAndDueDateRangeHandler =
  async (event: APIGatewayEvent) => {
    console.info({ event });

    const customerDocumentNumber =
      event.queryStringParameters?.customerDocumentNumber;
    const startDate = event.queryStringParameters?.startDate;
    const endDate = event.queryStringParameters?.endDate;
    console.info({ customerDocumentNumber, startDate, endDate });

    if (!customerDocumentNumber) {
      console.info({ message: 'Missing customerDocumentNumber' });
      return getBadRequestResponse('Missing customerDocumentNumber');
    }

    if (!startDate || !isValid(new Date(startDate))) {
      console.info({ message: 'Missing startDate' });
      return getBadRequestResponse('Missing startDate');
    }

    if (!endDate || !isValid(new Date(endDate))) {
      console.info({ message: 'Missing endDate' });
      return getBadRequestResponse('Missing endDate');
    }

    try {
      const transactions =
        await getTransactionsByCustomerDocumentNumberAndDueDateRange(
          customerDocumentNumber,
          toDate(startDate),
          toDate(endDate)
        );
      console.info({ transactions });

      return getSuccessResponse('Transactions found', transactions);
    } catch (error) {
      console.error({ error });
      return getInternalServerErrorResponse(
        'Error getting transactions by customerDocumentNumber and date range',
        error
      );
    }
  };
