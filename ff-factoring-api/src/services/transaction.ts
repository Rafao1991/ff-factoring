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
import { compareDesc, format } from 'date-fns';

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

    const transactions: Transaction[] = response.Items.map(
      (item): Transaction => ({
        id: item.id,
        assignorDocumentNumber: item.assignorDocumentNumber,
        assignorName: item.assignorName,
        payerDocumentNumber: item.payerDocumentNumber,
        payerName: item.payerName,
        investorDocumentNumber: item.investorDocumentNumber,
        investorName: item.investorName,
        amount: item.amount,
        date: item.date,
        dueDate: item.dueDate,
        type: item.type,
        completed: item.completed,
        description: item.description,
      })
    ).sort((a, b) => compareDesc(a.date, b.date));

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

    const { Item: item } = response;

    const transaction: Transaction = {
      id: item.id,
      assignorDocumentNumber: item.assignorDocumentNumber,
      assignorName: item.assignorName,
      payerDocumentNumber: item.payerDocumentNumber,
      payerName: item.payerName,
      investorDocumentNumber: item.investorDocumentNumber,
      investorName: item.investorName,
      amount: item.amount,
      date: item.date,
      dueDate: item.dueDate,
      type: item.type,
      completed: item.completed,
      description: item.description,
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

    const transactions: Transaction[] = response.Items.map(
      (item): Transaction => ({
        id: item.id,
        assignorDocumentNumber: item.assignorDocumentNumber,
        assignorName: item.assignorName,
        payerDocumentNumber: item.payerDocumentNumber,
        payerName: item.payerName,
        investorDocumentNumber: item.investorDocumentNumber,
        investorName: item.investorName,
        amount: item.amount,
        date: item.date,
        dueDate: item.dueDate,
        type: item.type,
        completed: item.completed,
        description: item.description,
      })
    ).sort((a, b) => compareDesc(a.date, b.date));

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

export const getTransactionsByAssignorDocumentNumber = async (
  assignorDocumentNumber: string
): Promise<Transaction[]> => {
  const { client, docClient } = getDynamoDB();

  try {
    const input: QueryCommandInput = {
      TableName: transactionsTableName,
      IndexName: 'assignorDocumentNumber-index',
      ConsistentRead: false,
      KeyConditionExpression:
        '#assignorDocumentNumber = :assignorDocumentNumber',
      ExpressionAttributeNames: {
        '#assignorDocumentNumber': 'assignorDocumentNumber',
      },
      ExpressionAttributeValues: {
        ':assignorDocumentNumber': assignorDocumentNumber,
      },
    };
    const command = new QueryCommand(input);
    const response: QueryCommandOutput = await docClient.send(command);
    console.info({
      service: 'transaction',
      action: 'getTransactionsByAssignorDocumentNumber',
      input,
      command,
      response,
    });

    if (!response.Items) {
      return [];
    }

    const transactions: Transaction[] = response.Items.map(
      (item): Transaction => ({
        id: item.id,
        assignorDocumentNumber: item.assignorDocumentNumber,
        assignorName: item.assignorName,
        payerDocumentNumber: item.payerDocumentNumber,
        payerName: item.payerName,
        investorDocumentNumber: item.investorDocumentNumber,
        investorName: item.investorName,
        amount: item.amount,
        date: item.date,
        dueDate: item.dueDate,
        type: item.type,
        completed: item.completed,
        description: item.description,
      })
    ).sort((a, b) => compareDesc(a.date, b.date));

    return transactions;
  } catch (error) {
    console.error({
      service: 'transaction',
      action: 'getTransactionsByAssignorDocumentNumber',
      error,
    });
    throw error;
  } finally {
    console.info({
      service: 'transaction',
      action: 'getTransactionsByAssignorDocumentNumber',
      message: 'DynamoDB client closed',
    });

    client.destroy();
    docClient.destroy();
  }
};

export const getTransactionsByAssignorDocumentNumberAndDateRange = async (
  assignorDocumentNumber: string,
  startDate: Date,
  endDate: Date
): Promise<Transaction[]> => {
  const { client, docClient } = getDynamoDB();

  try {
    const input: QueryCommandInput = {
      TableName: transactionsTableName,
      IndexName: 'assignorDocumentNumber-date-index',
      ConsistentRead: false,
      KeyConditionExpression:
        '#assignorDocumentNumber = :assignorDocumentNumber AND #date BETWEEN :startDate AND :endDate',
      ExpressionAttributeNames: {
        '#assignorDocumentNumber': 'assignorDocumentNumber',
        '#date': 'date',
      },
      ExpressionAttributeValues: {
        ':assignorDocumentNumber': assignorDocumentNumber,
        ':startDate': format(startDate, 'yyyy-MM-dd'),
        ':endDate': format(endDate, 'yyyy-MM-dd'),
      },
    };
    const command = new QueryCommand(input);
    const response: QueryCommandOutput = await docClient.send(command);
    console.info({
      service: 'transaction',
      action: 'getTransactionsByAssignorDocumentNumberAndDateRange',
      input,
      command,
      response,
    });

    if (!response.Items) {
      return [];
    }

    const transactions: Transaction[] = response.Items.map(
      (item): Transaction => ({
        id: item.id,
        assignorDocumentNumber: item.assignorDocumentNumber,
        assignorName: item.assignorName,
        payerDocumentNumber: item.payerDocumentNumber,
        payerName: item.payerName,
        investorDocumentNumber: item.investorDocumentNumber,
        investorName: item.investorName,
        amount: item.amount,
        date: item.date,
        dueDate: item.dueDate,
        type: item.type,
        completed: item.completed,
        description: item.description,
      })
    ).sort((a, b) => compareDesc(a.date, b.date));

    return transactions;
  } catch (error) {
    console.error({
      service: 'transaction',
      action: 'getTransactionsByAssignorDocumentNumberAndDateRange',
      error,
    });
    throw error;
  } finally {
    console.info({
      service: 'transaction',
      action: 'getTransactionsByAssignorDocumentNumberAndDateRange',
      message: 'DynamoDB client closed',
    });

    client.destroy();
    docClient.destroy();
  }
};

export const getTransactionsByAssignorDocumentNumberAndDueDateRange = async (
  assignorDocumentNumber: string,
  startDate: Date,
  endDate: Date
): Promise<Transaction[]> => {
  const { client, docClient } = getDynamoDB();

  try {
    const input: QueryCommandInput = {
      TableName: transactionsTableName,
      IndexName: 'assignorDocumentNumber-dueDate-index',
      ConsistentRead: false,
      KeyConditionExpression:
        '#assignorDocumentNumber = :assignorDocumentNumber AND #dueDate BETWEEN :startDate AND :endDate',
      ExpressionAttributeNames: {
        '#assignorDocumentNumber': 'assignorDocumentNumber',
        '#dueDate': 'dueDate',
      },
      ExpressionAttributeValues: {
        ':assignorDocumentNumber': assignorDocumentNumber,
        ':startDate': format(startDate, 'yyyy-MM-dd'),
        ':endDate': format(endDate, 'yyyy-MM-dd'),
      },
    };
    const command = new QueryCommand(input);
    const response: QueryCommandOutput = await docClient.send(command);
    console.info({
      service: 'transaction',
      action: 'getTransactionsByAssignorDocumentNumberAndDueDateRange',
      input,
      command,
      response,
    });

    if (!response.Items) {
      return [];
    }

    const transactions: Transaction[] = response.Items.map(
      (item): Transaction => ({
        id: item.id,
        assignorDocumentNumber: item.assignorDocumentNumber,
        assignorName: item.assignorName,
        payerDocumentNumber: item.payerDocumentNumber,
        payerName: item.payerName,
        investorDocumentNumber: item.investorDocumentNumber,
        investorName: item.investorName,
        amount: item.amount,
        date: item.date,
        dueDate: item.dueDate,
        type: item.type,
        completed: item.completed,
        description: item.description,
      })
    ).sort((a, b) => compareDesc(a.date, b.date));

    return transactions;
  } catch (error) {
    console.error({
      service: 'transaction',
      action: 'getTransactionsByAssignorDocumentNumberAndDueDateRange',
      error,
    });
    throw error;
  } finally {
    console.info({
      service: 'transaction',
      action: 'getTransactionsByAssignorDocumentNumberAndDueDateRange',
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
        assignorDocumentNumber: transaction.assignorDocumentNumber,
        assignorName: transaction.assignorName,
        payerDocumentNumber: transaction.payerDocumentNumber,
        payerName: transaction.payerName,
        investorDocumentNumber: transaction.investorDocumentNumber,
        investorName: transaction.investorName,
        amount: transaction.amount,
        date: transaction.date,
        dueDate: transaction.dueDate,
        type: transaction.type,
        completed: transaction.completed,
        description: transaction.description,
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
