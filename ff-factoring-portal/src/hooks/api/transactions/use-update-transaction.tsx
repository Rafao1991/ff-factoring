import { TransactionSchema } from '@/components/transaction/transaction-form';
import { useMutation } from '@tanstack/react-query';

const updateTransaction = async (
  id: string,
  transaction: TransactionSchema
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/${id}`,
    {
      method: 'PUT',
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

export default function useUpdateTransaction() {
  const mutation = useMutation({
    mutationFn: ({
      id,
      transaction,
    }: {
      id: string;
      transaction: TransactionSchema;
    }) => updateTransaction(id, transaction),
  });

  return mutation;
}
