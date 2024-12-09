import { dynamodbClient } from '@/clients/dynamodb';
import { ListTablesCommand, ListTablesInput } from '@aws-sdk/client-dynamodb';

export const healthCheckHandler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Health check - OK',
    }),
  };
};

export const deepCheckHandler = async () => {
  const client = dynamodbClient();

  try {
    const input: ListTablesInput = {
      Limit: 1,
    };
    const command = new ListTablesCommand(input);
    const response = await client.send(command);
    console.info({ input, command, response });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Deep check - OK',
        response,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Deep check - ERROR',
        error,
      }),
    };
  } finally {
    console.info({
      message: 'DynamoDB client closed',
    });

    client.destroy();
  }
};
