import { getDynamoDB } from '@/clients/dynamodb';
import { getCustomerTableName } from '@/configs';
import {
  GetCommand,
  GetCommandInput,
  GetCommandOutput,
  PutCommand,
  PutCommandInput,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput,
} from '@aws-sdk/lib-dynamodb';

const customerTableName = getCustomerTableName();

export const scanCustomers = async (): Promise<Customer[]> => {
  const { client, docClient } = getDynamoDB();

  try {
    const input: ScanCommandInput = {
      TableName: customerTableName,
    };
    const command = new ScanCommand(input);
    const response: ScanCommandOutput = await docClient.send(command);
    console.info({
      service: 'customer',
      action: 'scanCustomers',
      input,
      command,
      response,
    });

    if (!response.Items) {
      return [];
    }

    const customers: Customer[] = response.Items.map((item) => ({
      documentNumber: item.documentNumber,
      name: item.name,
      emails: item.emails,
      phones: item.phones,
    })).sort((a, b) => a.name.localeCompare(b.name));

    return customers;
  } catch (error) {
    console.error({
      service: 'customer',
      action: 'scanCustomers',
      error,
    });
    throw error;
  } finally {
    console.info({
      service: 'customer',
      action: 'scanCustomers',
      message: 'DynamoDB client closed',
    });

    client.destroy();
    docClient.destroy();
  }
};

export const getCustomerByDocumentNumber = async (
  documentNumber: string
): Promise<Customer | undefined> => {
  const { client, docClient } = getDynamoDB();

  console.info({
    service: 'customer',
    action: 'getCustomerByDocumentNumber',
    message: 'Getting customer by document number',
    customerTableName,
    documentNumber,
  });

  try {
    const input: GetCommandInput = {
      TableName: customerTableName,
      Key: {
        documentNumber,
      },
      ConsistentRead: true,
    };
    const command = new GetCommand(input);
    const response: GetCommandOutput = await docClient.send(command);
    console.info({
      service: 'customer',
      action: 'getCustomerByDocumentNumber',
      input,
      command,
      response,
    });

    if (!response.Item) {
      return undefined;
    }

    const customer: Customer = {
      documentNumber: response.Item.documentNumber,
      name: response.Item.name,
      emails: response.Item.emails,
      phones: response.Item.phones,
    };

    return customer;
  } catch (error) {
    console.error({
      service: 'customer',
      action: 'getCustomerByDocumentNumber',
      error,
    });
    throw error;
  } finally {
    console.info({
      service: 'customer',
      action: 'getCustomerByDocumentNumber',
      message: 'DynamoDB client closed',
    });

    client.destroy();
    docClient.destroy();
  }
};

export const putCustomer = async (customer: Customer) => {
  const { client, docClient } = getDynamoDB();

  try {
    const input: PutCommandInput = {
      TableName: customerTableName,
      Item: {
        documentNumber: customer.documentNumber,
        name: customer.name,
        emails: customer.emails,
        phones: customer.phones,
      },
    };
    const command = new PutCommand(input);
    await docClient.send(command);
    console.info({
      service: 'customer',
      action: 'createCustomer',
      input,
      command,
    });
  } catch (error) {
    console.error({
      service: 'customer',
      action: 'createCustomer',
      error,
    });
    throw error;
  } finally {
    console.info({
      service: 'customer',
      action: 'createCustomer',
      message: 'DynamoDB client closed',
    });

    client.destroy();
    docClient.destroy();
  }
};
