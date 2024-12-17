import { APIGatewayProxyEvent } from 'aws-lambda';
import {
  getBadRequestResponse,
  getInternalServerErrorResponse,
  getNotFoundResponse,
  getSuccessResponse,
} from '@/helpers/api-wrapper';
import { getCustomerByDocumentNumber } from '@/services/customer';

export const getCustomerHandler = async (event: APIGatewayProxyEvent) => {
  console.info({ event });

  const documentNumber = event.pathParameters?.documentNumber;
  const type = event.pathParameters?.type as CustomerType;
  console.info({ documentNumber, type });

  if (!documentNumber) {
    console.info({ message: 'Missing documentNumber' });
    return getBadRequestResponse('Missing documentNumber');
  }

  if (!type) {
    console.info({ message: 'Missing type' });
    return getBadRequestResponse('Missing type');
  }

  try {
    const customer = await getCustomerByDocumentNumber(documentNumber, type);
    console.info({ customer });

    if (!customer) {
      return getNotFoundResponse('Customer not found');
    }

    return getSuccessResponse('Customer found', customer);
  } catch (error) {
    console.error({ error });
    return getInternalServerErrorResponse('Error getting customer', error);
  }
};
