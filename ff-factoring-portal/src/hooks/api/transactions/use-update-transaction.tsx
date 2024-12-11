import { TransactionSchema } from '@/components/transaction/transaction-form';
import { useMutation } from '@tanstack/react-query';

const updateTransaction = async (
  id: string,
  transaction: TransactionSchema,
  token: string
) => {
  if (!token) {
    throw new Error('Token is required');
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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

export default function useUpdateTransaction(token: string) {
  const mutation = useMutation({
    mutationFn: ({
      id,
      transaction,
    }: {
      id: string;
      transaction: TransactionSchema;
    }) => updateTransaction(id, transaction, token),
  });

  return mutation;
}
