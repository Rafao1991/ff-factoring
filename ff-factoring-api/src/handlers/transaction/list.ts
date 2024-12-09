export const listTransactionsHandler = () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Transactions listed',
    }),
  };
};
