import {
  getBadRequestResponse,
  getSuccessResponse,
  getInternalServerErrorResponse,
} from '@/helpers/api-wrapper';
import { getTransactionsByAssignorDocumentNumberAndDateRange } from '@/services/transaction';
import { APIGatewayEvent } from 'aws-lambda';
import { isValid, toDate } from 'date-fns';

export const getTransactionsByAssignorDocumentNumberAndDateRangeHandler =
  async (event: APIGatewayEvent) => {
    console.info({ event });

    const assignorDocumentNumber =
      event.queryStringParameters?.assignorDocumentNumber;
    const startDate = event.queryStringParameters?.startDate;
    const endDate = event.queryStringParameters?.endDate;
    console.info({ assignorDocumentNumber, startDate, endDate });

    if (!assignorDocumentNumber) {
      console.info({ message: 'Missing assignorDocumentNumber' });
      return getBadRequestResponse('Missing assignorDocumentNumber');
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
        await getTransactionsByAssignorDocumentNumberAndDateRange(
          assignorDocumentNumber,
          toDate(startDate),
          toDate(endDate)
        );
      console.info({ transactions });

      return getSuccessResponse('Transactions found', transactions);
    } catch (error) {
      console.error({ error });
      return getInternalServerErrorResponse(
        'Error getting transactions by assignorDocumentNumber and date range',
        error
      );
    }
  };
