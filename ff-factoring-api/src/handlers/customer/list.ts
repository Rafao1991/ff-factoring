import {
  getInternalServerErrorResponse,
  getSuccessResponse,
} from '@/helpers/api-wrapper';
import { scanCustomers } from '@/services/customer';

export const listCustomersHandler = async () => {
  try {
    const customers = await scanCustomers();
    console.info({ customers });
    return getSuccessResponse('List customers', customers);
  } catch (error) {
    console.error({ error });
    return getInternalServerErrorResponse('Error listing customers', error);
  }
};
