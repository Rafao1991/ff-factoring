import { useQuery } from '@tanstack/react-query';

const getTransaction = async (
  id: string | null,
  token: string
): Promise<Transaction> => {
  if (!id) throw new Error('Id is required');

  if (!token) {
    throw new Error('Token is required');
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const { data } = await response.json();
  return data;
};

export default function useGetTransaction(id: string | null, token: string) {
  const query = useQuery({
    queryKey: ['getTransaction', id],
    queryFn: () => getTransaction(id, token),
  });

  return query;
}
