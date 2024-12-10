import { useMutation } from '@tanstack/react-query';

const completeTransaction = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/${id}/complete`,
    {
      method: 'PUT',
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `${response.status} - ${response.statusText} - ${error.message}`
    );
  }
};

export default function useCompleteTransaction() {
  const mutation = useMutation({
    mutationFn: (id: string) => completeTransaction(id),
  });

  return mutation;
}
