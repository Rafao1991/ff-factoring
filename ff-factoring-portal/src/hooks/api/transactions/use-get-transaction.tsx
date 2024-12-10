import { useQuery } from '@tanstack/react-query';

const getTransaction = async (id: string | null): Promise<Transaction> => {
  if (!id) throw new Error('Id is required');

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/${id}`
  );
  const { data } = await response.json();
  return data;
};

export default function useGetTransaction(id: string | null) {
  const query = useQuery({
    queryKey: ['getTransaction', id],
    queryFn: () => getTransaction(id),
  });

  return query;
}
