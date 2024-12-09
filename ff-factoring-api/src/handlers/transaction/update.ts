import { APIGatewayEvent } from 'aws-lambda';

export const updateTransactionHandler = (event: APIGatewayEvent) => {
  console.info({ event });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Transaction updated',
    }),
  };
};
