import { isOffline } from '@/configs';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export const dynamodbClient = () => {
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

export const dynamodbDocumentClient = (client: DynamoDBClient) => {
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