import {
  getBadRequestResponse,
  getInternalServerErrorResponse,
  getNoContentResponse,
} from '@/helpers/api-wrapper';
import { getCustomerByDocumentNumber, putCustomer } from '@/services/customer';
import { APIGatewayProxyEvent } from 'aws-lambda';

export const updateCustomerHandler = async (event: APIGatewayProxyEvent) => {
  console.info({ event });

  const documentNumber = event.pathParameters?.documentNumber;
  const type = event.pathParameters?.type as CustomerType;
  const body: Customer = JSON.parse(event.body || '{}');
  console.info({ documentNumber, body });

  if (!documentNumber) {
    console.info({ message: 'Missing documentNumber' });
    return getBadRequestResponse('Missing documentNumber');
  }

  if (!type) {
    console.info({ message: 'Missing type' });
    return getBadRequestResponse('Missing type');
  }

  if (!body.name) {
    console.info({ message: 'Missing name' });
    return getBadRequestResponse('Missing name');
  }

  try {
    const existingCustomer = await getCustomerByDocumentNumber(
      documentNumber,
      type
    );
    console.info({ existingCustomer });

    if (!existingCustomer) {
      console.info({ message: 'Customer not found' });
      return getBadRequestResponse('Customer not found');
    }

    const customer: Customer = {
      documentNumber,
      type,
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

    return getNoContentResponse();
  } catch (error) {
    console.error({ error });
    return getInternalServerErrorResponse('Error updating customer', error);
  }
};
