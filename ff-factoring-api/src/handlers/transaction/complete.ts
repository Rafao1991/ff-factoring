import { APIGatewayEvent } from 'aws-lambda';

export const completeTransactionHandler = (event: APIGatewayEvent) => {
  console.info({ event });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Transaction completed',
    }),
  };
};
