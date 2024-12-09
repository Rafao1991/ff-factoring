import { putCustomer, getCustomerByDocumentNumber } from '@/services/customer';
import {
  getBadRequestResponse,
  getInternalServerErrorResponse,
  getNoContentResponse,
} from '@/helpers/api-wrapper';
import { APIGatewayProxyEvent } from 'aws-lambda';

export const createCustomerHandler = async (event: APIGatewayProxyEvent) => {
  console.info({ event });

  const newCustomer: Customer = JSON.parse(event.body || '{}');
  console.info({ body: newCustomer });

  if (!newCustomer.documentNumber) {
    console.info({ message: 'Missing documentNumber' });
    return getBadRequestResponse('Missing documentNumber');
  }

  if (!newCustomer.name) {
    console.info({ message: 'Missing name' });
    return getBadRequestResponse('Missing name');
  }

  try {
    const existingCustomer: Customer | undefined =
      await getCustomerByDocumentNumber(newCustomer.documentNumber);
    console.info({ existingCustomer });

    if (existingCustomer) {
      console.info({ message: 'Customer already exists' });
      return getBadRequestResponse(
        `Customer with documentNumber ${newCustomer.documentNumber} already exists`
      );
    }

    await putCustomer(newCustomer);
    console.info({ message: 'Customer created' });

    return getNoContentResponse();
  } catch (error) {
    console.error({ error });
    return getInternalServerErrorResponse('Error creating customer', error);
  }
};
