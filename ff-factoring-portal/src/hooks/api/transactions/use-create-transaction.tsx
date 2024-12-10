import { TransactionSchema } from '@/components/transaction/transaction-form';
import { useMutation } from '@tanstack/react-query';

const createTransaction = async (transaction: TransactionSchema) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/transactions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `${response.status} - ${response.statusText} - ${error.message}`
    );
  }
};

export default function useCreateTransaction() {
  const mutation = useMutation({
    mutationFn: (transaction: TransactionSchema) =>
      createTransaction(transaction),
  });

  return mutation;
}
