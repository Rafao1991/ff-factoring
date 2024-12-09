import { APIGatewayEvent } from 'aws-lambda';

export const getTransactionHandler = (event: APIGatewayEvent) => {
  console.info({ event });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Transaction retrieved',
    }),
  };
};
