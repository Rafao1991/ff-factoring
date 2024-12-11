import { useMutation } from '@tanstack/react-query';

const completeTransaction = async (id: string, token: string) => {
  if (!token) {
    throw new Error('Token is required');
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/${id}/complete`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `${response.status} - ${response.statusText} - ${error.message}`
    );
  }
};

export default function useCompleteTransaction(token: string) {
  const mutation = useMutation({
    mutationFn: (id: string) => completeTransaction(id, token),
  });

  return mutation;
}
