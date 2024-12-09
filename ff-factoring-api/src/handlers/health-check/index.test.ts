const dynamoDbSendFn = jest.fn();

import { healthCheckHandler, deepCheckHandler } from '@/handlers/health-check';

jest.mock('@aws-sdk/client-dynamodb', () => {
  class DynamoDBClient {
    send = dynamoDbSendFn;
    destroy = jest.fn();
  }

  class ListTablesCommand {}

  return { DynamoDBClient, ListTablesCommand };
});

jest.mock('@/config', () => ({
  isOffline: () => true,
}));

describe('health check', () => {
  describe('healthCheckHandler', () => {
    it('should return 200 OK', async () => {
      const result = await healthCheckHandler();

      expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify({
          message: 'Health check - OK',
        }),
      });
    });
  });

  describe('deepCheckHandler', () => {
    beforeEach(() => {
      dynamoDbSendFn.mockReset();
    });

    it('should return 200 OK', async () => {
      dynamoDbSendFn.mockResolvedValue({
        TableNames: ['Table'],
        LastEvaluatedTableName: 'Table',
      });

      const result = await deepCheckHandler();

      expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify({
          message: 'Deep check - OK',
          response: {
            TableNames: ['Table'],
            LastEvaluatedTableName: 'Table',
          },
        }),
      });
    });

    it('should return 500 ERROR', async () => {
      dynamoDbSendFn.mockRejectedValue(new Error('Error'));

      const result = await deepCheckHandler();

      expect(result).toEqual({
        statusCode: 500,
        body: JSON.stringify({
          message: 'Deep check - ERROR',
          error: new Error('Error'),
        }),
      });
    });
  });
});
