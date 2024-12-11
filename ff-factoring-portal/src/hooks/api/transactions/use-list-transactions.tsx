import { useQuery } from '@tanstack/react-query';

const listTransactions = async (token: string): Promise<Transaction[]> => {
  if (!token) {
    throw new Error('Token is required');
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/transactions`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const { data } = await response.json();
  return data;
};

export default function useListTransactions(token: string) {
  const query = useQuery({
    queryKey: ['listTransactions'],
    queryFn: () => listTransactions(token),
  });

  return query;
}
