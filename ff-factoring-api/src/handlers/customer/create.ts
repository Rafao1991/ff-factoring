import { putCustomer, getCustomerByDocumentNumber } from '@/services/customer';
import {
  getBadRequestResponse,
  getInternalServerErrorResponse,
  getNoContentResponse,
} from '@/helpers/api-wrapper';
import { APIGatewayProxyEvent } from 'aws-lambda';

export const createCustomerHandler = async (event: APIGatewayProxyEvent) => {
  console.info({ event });

  const body: Customer = JSON.parse(event.body || '{}');
  console.info({ body: body });

  if (!body.documentNumber) {
    console.info({ message: 'Missing documentNumber' });
    return getBadRequestResponse('Missing documentNumber');
  }

  if (!body.type) {
    console.info({ message: 'Missing type' });
    return getBadRequestResponse('Missing type');
  }

  if (!body.name) {
    console.info({ message: 'Missing name' });
    return getBadRequestResponse('Missing name');
  }

  try {
    const existingCustomer: Customer | undefined =
      await getCustomerByDocumentNumber(body.documentNumber, body.type);
    console.info({ existingCustomer });

    if (existingCustomer) {
      console.info({ message: 'Customer already exists' });
      return getBadRequestResponse(
        `Customer with documentNumber ${body.documentNumber} already exists`
      );
    }

    const customer: Customer = {
      documentNumber: body.documentNumber,
      type: body.type,
      name: body.name,
      address: body.address,
      addressNumber: body.addressNumber,
      addressComplement: body.addressComplement,
      city: body.city,
      state: body.state,
      zip: body.zip,
      emails: body.emails,
      phones: body.phones,
    };
    console.info({ customer });
    await putCustomer(customer);
    console.info({ message: 'Customer created' });

    return getNoContentResponse();
  } catch (error) {
    console.error({ error });
    return getInternalServerErrorResponse('Error creating customer', error);
  }
};
