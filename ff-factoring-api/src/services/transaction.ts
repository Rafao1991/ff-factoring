import { getDynamoDB } from '@/clients/dynamodb';
import { getTransactionsTableName } from '@/configs';
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
import { format } from 'date-fns';

const transactionsTableName = getTransactionsTableName();

export const validTransactionTypes = ['cheque', 'duplicata'] as const;

export const scanTransactions = async (): Promise<Transaction[]> => {
  const { client, docClient } = getDynamoDB();

  try {
    const input: ScanCommandInput = {
      TableName: transactionsTableName,
    };
    const command = new ScanCommand(input);
    const response: ScanCommandOutput = await docClient.send(command);
    console.info({
      service: 'transaction',
      action: 'scanTransactions',
      input,
      command,
      response: JSON.stringify(response, null, 4),
    });

    if (!response.Items) {
      return [];
    }

    const transactions: Transaction[] = response.Items.map((item) => ({
      id: item.id,
      customerDocumentNumber: item.customerDocumentNumber,
      customerName: item.customerName,
      amount: item.amount,
      date: item.date,
      dueDate: item.dueDate,
      type: item.type,
      completed: item.completed,
    }));

    return transactions;
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

export const getTransactionById = async (
  id: string
): Promise<Transaction | undefined> => {
  const { client, docClient } = getDynamoDB();

  try {
    const input: GetCommandInput = {
      TableName: transactionsTableName,
      Key: {
        id,
      },
      ConsistentRead: true,
    };
    const command = new GetCommand(input);
    const response: GetCommandOutput = await docClient.send(command);
    console.info({
      service: 'transaction',
      action: 'getTransactionById',
      input,
      command,
      response,
    });

    if (!response.Item) {
      return undefined;
    }

    const transaction: Transaction = {
      id: response.Item.id,
      customerDocumentNumber: response.Item.customerDocumentNumber,
      customerName: response.Item.customerName,
      amount: response.Item.amount,
      date: response.Item.date,
      dueDate: response.Item.dueDate,
      type: response.Item.type,
      completed: response.Item.completed,
    };

    return transaction;
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

export const putTransaction = async (transaction: Transaction) => {
  const { client, docClient } = getDynamoDB();

  try {
    const input: PutCommandInput = {
      TableName: transactionsTableName,
      Item: {
        id: transaction.id,
        customerDocumentNumber: transaction.customerDocumentNumber,
        customerName: transaction.customerName,
        amount: transaction.amount,
        date: transaction.date,
        dueDate: transaction.dueDate,
        type: transaction.type,
        completed: transaction.completed,
      },
    };
    const command = new PutCommand(input);
    await docClient.send(command);
    console.info({
      service: 'transaction',
      action: 'createTransaction',
      input,
      command,
    });
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

export const getTransactionsByDateRange = async (
  startDate: Date,
  endDate: Date
): Promise<Transaction[]> => {
  const { client, docClient } = getDynamoDB();

  try {
    const input: ScanCommandInput = {
      TableName: transactionsTableName,
      ConsistentRead: false,
      FilterExpression: '#date BETWEEN :startDate AND :endDate',
      ExpressionAttributeNames: {
        '#date': 'date',
      },
      ExpressionAttributeValues: {
        ':startDate': format(startDate, 'yyyy-MM-dd'),
        ':endDate': format(endDate, 'yyyy-MM-dd'),
      },
    };
    const command = new ScanCommand(input);
    const response: ScanCommandOutput = await docClient.send(command);
    console.info({
      service: 'transaction',
      action: 'getTransactionByDate',
      input,
      command,
      response,
    });

    if (!response.Items) {
      return [];
    }

    const transactions: Transaction[] = response.Items.map((item) => ({
      id: item.id,
      customerDocumentNumber: item.customerDocumentNumber,
      customerName: item.customerName,
      amount: item.amount,
      date: item.date,
      dueDate: item.dueDate,
      type: item.type,
      completed: item.completed,
    }));

    return transactions;
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
