import { getDynamoDB } from '@/clients/dynamodb';
import { getTransactionsTableName } from '@/configs';
import {
  GetCommand,
  GetCommandInput,
  GetCommandOutput,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { format } from 'date-fns';

const transactionsTableName = getTransactionsTableName();

export const validTransactionTypes = ['cheque', 'duplicata'] as const;

export const getTransactions = async (): Promise<Transaction[]> => {
  const { client, docClient } = getDynamoDB();

  try {
    const input: ScanCommandInput = {
      TableName: transactionsTableName,
    };
    const command = new ScanCommand(input);
    const response: ScanCommandOutput = await docClient.send(command);
    console.info({
      service: 'transaction',
      action: 'getTransactions',
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
    })).sort((a, b) => a.date.localeCompare(b.date));

    return transactions;
  } catch (error) {
    console.error({
      service: 'transaction',
      action: 'getTransactions',
      error,
    });
    throw error;
  } finally {
    console.info({
      service: 'transaction',
      action: 'getTransactions',
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
      service: 'transaction',
      action: 'getTransactionById',
      error,
    });
    throw error;
  } finally {
    console.info({
      service: 'transaction',
      action: 'getTransactionById',
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
      action: 'getTransactionsByDateRange',
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
    })).sort((a, b) => a.date.localeCompare(b.date));

    return transactions;
  } catch (error) {
    console.error({
      service: 'transaction',
      action: 'getTransactionsByDateRange',
      error,
    });
    throw error;
  } finally {
    console.info({
      service: 'transaction',
      action: 'getTransactionsByDateRange',
      message: 'DynamoDB client closed',
    });

    client.destroy();
    docClient.destroy();
  }
};

export const getTransactionsByCustomerDocumentNumber = async (
  customerDocumentNumber: string
): Promise<Transaction[]> => {
  const { client, docClient } = getDynamoDB();

  try {
    const input: QueryCommandInput = {
      TableName: transactionsTableName,
      IndexName: 'customerDocumentNumber-index',
      ConsistentRead: false,
      KeyConditionExpression:
        '#customerDocumentNumber = :customerDocumentNumber',
      ExpressionAttributeNames: {
        '#customerDocumentNumber': 'customerDocumentNumber',
      },
      ExpressionAttributeValues: {
        ':customerDocumentNumber': customerDocumentNumber,
      },
    };
    const command = new QueryCommand(input);
    const response: QueryCommandOutput = await docClient.send(command);
    console.info({
      service: 'transaction',
      action: 'getTransactionsByCustomerDocumentNumber',
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
    })).sort((a, b) => a.date.localeCompare(b.date));

    return transactions;
  } catch (error) {
    console.error({
      service: 'transaction',
      action: 'getTransactionsByCustomerDocumentNumber',
      error,
    });
    throw error;
  } finally {
    console.info({
      service: 'transaction',
      action: 'getTransactionsByCustomerDocumentNumber',
      message: 'DynamoDB client closed',
    });

    client.destroy();
    docClient.destroy();
  }
};

export const getTransactionsByCustomerDocumentNumberAndDateRange = async (
  customerDocumentNumber: string,
  startDate: Date,
  endDate: Date
): Promise<Transaction[]> => {
  const { client, docClient } = getDynamoDB();

  try {
    const input: QueryCommandInput = {
      TableName: transactionsTableName,
      IndexName: 'customerDocumentNumber-date-index',
      ConsistentRead: false,
      KeyConditionExpression:
        '#customerDocumentNumber = :customerDocumentNumber AND #date BETWEEN :startDate AND :endDate',
      ExpressionAttributeNames: {
        '#customerDocumentNumber': 'customerDocumentNumber',
        '#date': 'date',
      },
      ExpressionAttributeValues: {
        ':customerDocumentNumber': customerDocumentNumber,
        ':startDate': format(startDate, 'yyyy-MM-dd'),
        ':endDate': format(endDate, 'yyyy-MM-dd'),
      },
    };
    const command = new QueryCommand(input);
    const response: QueryCommandOutput = await docClient.send(command);
    console.info({
      service: 'transaction',
      action: 'getTransactionsByIdAndDateRange',
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
    })).sort((a, b) => a.date.localeCompare(b.date));

    return transactions;
  } catch (error) {
    console.error({
      service: 'transaction',
      action: 'getTransactionsByIdAndDateRange',
      error,
    });
    throw error;
  } finally {
    console.info({
      service: 'transaction',
      action: 'getTransactionsByIdAndDateRange',
      message: 'DynamoDB client closed',
    });

    client.destroy();
    docClient.destroy();
  }
};

export const getTransactionsByCustomerDocumentNumberAndDueDateRange = async (
  customerDocumentNumber: string,
  startDate: Date,
  endDate: Date
): Promise<Transaction[]> => {
  const { client, docClient } = getDynamoDB();

  try {
    const input: QueryCommandInput = {
      TableName: transactionsTableName,
      IndexName: 'customerDocumentNumber-dueDate-index',
      ConsistentRead: false,
      KeyConditionExpression:
        '#customerDocumentNumber = :customerDocumentNumber AND #dueDate BETWEEN :startDate AND :endDate',
      ExpressionAttributeNames: {
        '#customerDocumentNumber': 'customerDocumentNumber',
        '#dueDate': 'dueDate',
      },
      ExpressionAttributeValues: {
        ':customerDocumentNumber': customerDocumentNumber,
        ':startDate': format(startDate, 'yyyy-MM-dd'),
        ':endDate': format(endDate, 'yyyy-MM-dd'),
      },
    };
    const command = new QueryCommand(input);
    const response: QueryCommandOutput = await docClient.send(command);
    console.info({
      service: 'transaction',
      action: 'getTransactionsByCustomerDocumentNumberAndDueDateRange',
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
    })).sort((a, b) => a.date.localeCompare(b.date));

    return transactions;
  } catch (error) {
    console.error({
      service: 'transaction',
      action: 'getTransactionsByCustomerDocumentNumberAndDueDateRange',
      error,
    });
    throw error;
  } finally {
    console.info({
      service: 'transaction',
      action: 'getTransactionsByCustomerDocumentNumberAndDueDateRange',
      message: 'DynamoDB client closed',
    });

    client.destroy();
    docClient.destroy();
  }
};

export const getTransactionsByCustomerDocumentNumberAndAmountRange = async (
  customerDocumentNumber: string,
  minAmount: number,
  maxAmount: number
): Promise<Transaction[]> => {
  const { client, docClient } = getDynamoDB();

  try {
    const input: QueryCommandInput = {
      TableName: transactionsTableName,
      IndexName: 'customerDocumentNumber-amount-index',
      ConsistentRead: false,
      KeyConditionExpression:
        '#customerDocumentNumber = :customerDocumentNumber AND #amount BETWEEN :minAmount AND :maxAmount',
      ExpressionAttributeNames: {
        '#customerDocumentNumber': 'customerDocumentNumber',
        '#amount': 'amount',
      },
      ExpressionAttributeValues: {
        ':customerDocumentNumber': customerDocumentNumber,
        ':minAmount': minAmount,
        ':maxAmount': maxAmount,
      },
    };
    const command = new QueryCommand(input);
    const response: QueryCommandOutput = await docClient.send(command);
    console.info({
      service: 'transaction',
      action: 'getTransactionsByCustomerDocumentNumberAndAmountRange',
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
    })).sort((a, b) => a.date.localeCompare(b.date));

    return transactions;
  } catch (error) {
    console.error({
      service: 'transaction',
      action: 'getTransactionsByCustomerDocumentNumberAndAmountRange',
      error,
    });
    throw error;
  } finally {
    console.info({
      service: 'transaction',
      action: 'getTransactionsByCustomerDocumentNumberAndAmountRange',
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
      action: 'putTransaction',
      input,
      command,
    });
  } catch (error) {
    console.error({
      service: 'transaction',
      action: 'putTransaction',
      error,
    });
    throw error;
  } finally {
    console.info({
      service: 'transaction',
      action: 'putTransaction',
      message: 'DynamoDB client closed',
    });

    client.destroy();
    docClient.destroy();
  }
};
