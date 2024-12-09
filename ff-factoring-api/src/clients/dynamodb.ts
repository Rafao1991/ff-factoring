import { isOffline } from '@/configs';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const dynamodbClient = () => {
  const offline = isOffline();
  console.info({ offline });

  const client = new DynamoDBClient(
    !offline ? {} : { endpoint: 'http://localhost:8000' }
  );
  console.info({
    service: 'dynamodb',
    action: 'dynamodbClient',
    message: 'DynamoDB client created',
    client,
  });

  return client;
};

const dynamodbDocumentClient = (client: DynamoDBClient) => {
  if (!client) {
    throw new Error('DynamoDB client is undefined');
  }

  const docClient = DynamoDBDocumentClient.from(client);
  console.info({
    service: 'dynamodb',
    action: 'dynamodbDocumentClient',
    message: 'DynamoDB document client created',
    docClient,
  });

  return docClient;
};

export const getDynamoDB = () => {
  const client = dynamodbClient();
  const docClient = dynamodbDocumentClient(client);

  return {
    client,
    docClient,
  };
};
