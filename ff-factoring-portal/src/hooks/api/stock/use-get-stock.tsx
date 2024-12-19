import { useQuery } from '@tanstack/react-query';

const getStock = async (token: string): Promise<Transaction[]> => {
  if (!token) {
    throw new Error('Token is required');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/stock`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const { data } = await response.json();
  return data;
};

export default function useGetStock(token: string) {
  const query = useQuery({
    queryKey: ['getStock'],
    queryFn: () => getStock(token),
  });

  return query;
}
